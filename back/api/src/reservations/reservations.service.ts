import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { Table } from '../restaurants/entities/table.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { addMinutes, subMinutes, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Table)
    private tableRepository: Repository<Table>
  ) {}

  async create(
    restaurantId: string,
    createReservationDto: CreateReservationDto,
    customerId?: string
  ): Promise<Reservation> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    if (!restaurant.isActive || !restaurant.settings?.acceptReservations) {
      throw new BadRequestException('This restaurant is not accepting reservations');
    }

    // Validate party size
    const { maxPartySize } = restaurant.settings;
    if (createReservationDto.partySize > maxPartySize) {
      throw new BadRequestException(`Party size cannot exceed ${maxPartySize} guests`);
    }

    // Validate reservation time
    const reservationDate = new Date(createReservationDto.reservationDate);
    const now = new Date();

    if (reservationDate < now) {
      throw new BadRequestException('Cannot create reservation in the past');
    }

    // Check availability if table is specified
    if (createReservationDto.tableId) {
      const table = await this.tableRepository.findOne({
        where: { id: createReservationDto.tableId, restaurantId },
      });

      if (!table) {
        throw new NotFoundException('Table not found');
      }

      if (table.capacity < createReservationDto.partySize) {
        throw new BadRequestException(
          `Table capacity (${table.capacity}) is less than party size (${createReservationDto.partySize})`
        );
      }

      const isAvailable = await this.checkTableAvailability(
        createReservationDto.tableId,
        reservationDate,
        createReservationDto.estimatedDuration || 90
      );

      if (!isAvailable) {
        throw new ConflictException('Table is not available at this time');
      }
    }

    // Generate confirmation code
    const confirmationCode = this.generateConfirmationCode();

    const reservation = this.reservationRepository.create({
      ...createReservationDto,
      restaurantId,
      customerId,
      confirmationCode,
      status: restaurant.settings?.autoConfirmReservations
        ? ReservationStatus.CONFIRMED
        : ReservationStatus.PENDING,
    });

    return await this.reservationRepository.save(reservation);
  }

  async findAll(filters?: {
    restaurantId?: string;
    customerId?: string;
    status?: ReservationStatus;
    date?: Date;
    page?: number;
    limit?: number;
  }): Promise<{
    reservations: Reservation[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { restaurantId, customerId, status, date, page = 1, limit = 10 } = filters || {};

    const queryBuilder = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.restaurant', 'restaurant')
      .leftJoinAndSelect('reservation.customer', 'customer')
      .leftJoinAndSelect('reservation.table', 'table');

    if (restaurantId) {
      queryBuilder.andWhere('reservation.restaurantId = :restaurantId', {
        restaurantId,
      });
    }

    if (customerId) {
      queryBuilder.andWhere('reservation.customerId = :customerId', {
        customerId,
      });
    }

    if (status) {
      queryBuilder.andWhere('reservation.status = :status', { status });
    }

    if (date) {
      const startDate = startOfDay(date);
      const endDate = endOfDay(date);
      queryBuilder.andWhere('reservation.reservationDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('reservation.reservationDate', 'ASC');

    const [reservations, total] = await queryBuilder.getManyAndCount();

    return {
      reservations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['restaurant', 'customer', 'table'],
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
    userId: string,
    userRole: string
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);

    // Check authorization
    const canUpdate =
      reservation.customerId === userId ||
      reservation.restaurant.ownerId === userId ||
      userRole === 'super_admin';

    if (!canUpdate) {
      throw new ForbiddenException('You do not have permission to update this reservation');
    }

    Object.assign(reservation, updateReservationDto);

    return await this.reservationRepository.save(reservation);
  }

  async cancel(id: string, reason: string, userId: string, userRole: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    // Check authorization
    const canCancel =
      reservation.customerId === userId ||
      reservation.restaurant.ownerId === userId ||
      userRole === 'super_admin';

    if (!canCancel) {
      throw new ForbiddenException('You do not have permission to cancel this reservation');
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Reservation is already cancelled');
    }

    if (reservation.status === ReservationStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed reservation');
    }

    reservation.status = ReservationStatus.CANCELLED;
    reservation.cancelledAt = new Date();
    reservation.cancellationReason = reason;

    return await this.reservationRepository.save(reservation);
  }

  async confirm(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be confirmed');
    }

    reservation.status = ReservationStatus.CONFIRMED;
    reservation.confirmedAt = new Date();

    return await this.reservationRepository.save(reservation);
  }

  async seat(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed reservations can be seated');
    }

    reservation.status = ReservationStatus.SEATED;
    reservation.seatedAt = new Date();

    return await this.reservationRepository.save(reservation);
  }

  async complete(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.SEATED) {
      throw new BadRequestException('Only seated reservations can be completed');
    }

    reservation.status = ReservationStatus.COMPLETED;
    reservation.completedAt = new Date();

    return await this.reservationRepository.save(reservation);
  }

  async markNoShow(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    reservation.status = ReservationStatus.NO_SHOW;

    return await this.reservationRepository.save(reservation);
  }

  private async checkTableAvailability(
    tableId: string,
    reservationDate: Date,
    duration: number
  ): Promise<boolean> {
    const startTime = subMinutes(reservationDate, 15); // 15 min buffer before
    const endTime = addMinutes(reservationDate, duration + 15); // duration + 15 min buffer after

    const conflictingReservations = await this.reservationRepository.count({
      where: {
        tableId,
        reservationDate: Between(startTime, endTime),
        status: Between(ReservationStatus.CONFIRMED, ReservationStatus.SEATED),
      },
    });

    return conflictingReservations === 0;
  }

  private generateConfirmationCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
