import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DataSource } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { Table } from '../restaurants/entities/table.entity';
import { TimeSlot } from '../restaurants/entities/time-slot.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { EventsGateway } from '../gateways/events.gateway';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { addMinutes, subMinutes, startOfDay, endOfDay, format, parse, getDay } from 'date-fns';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private usersService: UsersService,
    private eventsGateway: EventsGateway,
    private dataSource: DataSource
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

    // Auto-create or find customer if not authenticated
    let finalCustomerId = customerId;
    if (!customerId && createReservationDto.customerEmail) {
      // Check if customer already exists
      let customer = await this.userRepository.findOne({
        where: { email: createReservationDto.customerEmail },
      });

      // Create customer if doesn't exist
      if (!customer) {
        const [firstName, ...lastNameParts] = createReservationDto.customerName.split(' ');
        customer = await this.usersService.create({
          email: createReservationDto.customerEmail,
          password: Math.random().toString(36).slice(-8), // Random password
          firstName: firstName || 'Customer',
          lastName: lastNameParts.join(' ') || '',
          phone: createReservationDto.customerPhone,
          role: UserRole.CUSTOMER,
        });
      }

      finalCustomerId = customer.id;
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

    // Validate against advance booking settings
    const { minAdvanceBooking, maxAdvanceBooking } = restaurant.settings;
    const minDate = addMinutes(now, minAdvanceBooking * 60);
    const maxDate = addMinutes(now, maxAdvanceBooking * 24 * 60);

    if (reservationDate < minDate) {
      throw new BadRequestException(
        `Reservations must be made at least ${minAdvanceBooking} hours in advance`
      );
    }

    if (reservationDate > maxDate) {
      throw new BadRequestException(
        `Reservations cannot be made more than ${maxAdvanceBooking} days in advance`
      );
    }

    // Validate that the restaurant is open at this time
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = dayNames[getDay(reservationDate)];
    const reservationTime = format(reservationDate, 'HH:mm');

    const openTimeSlots = await this.timeSlotRepository.find({
      where: {
        restaurantId,
        dayOfWeek: dayOfWeek as any,
        isActive: true,
      },
    });

    if (openTimeSlots.length === 0) {
      throw new BadRequestException('Restaurant is closed on this day');
    }

    // Check if reservation time falls within any time slot
    let isWithinTimeSlot = false;
    for (const slot of openTimeSlots) {
      const [resHour, resMinute] = reservationTime.split(':').map(Number);
      const [openHour, openMinute] = slot.openTime.split(':').map(Number);
      const [closeHour, closeMinute] = slot.closeTime.split(':').map(Number);

      const resMinutes = resHour * 60 + resMinute;
      const openMinutes = openHour * 60 + openMinute;
      let closeMinutes = closeHour * 60 + closeMinute;

      // Handle overnight closing
      if (closeMinutes <= openMinutes) {
        closeMinutes += 24 * 60;
      }

      if (resMinutes >= openMinutes && resMinutes < closeMinutes) {
        isWithinTimeSlot = true;
        break;
      }
    }

    if (!isWithinTimeSlot) {
      throw new BadRequestException('Restaurant is closed at this time');
    }

    // Use transaction to prevent race conditions
    return await this.dataSource.transaction('SERIALIZABLE', async transactionalEntityManager => {
      // Check availability if table is specified (with lock)
      if (createReservationDto.tableId) {
        const table = await transactionalEntityManager.findOne(Table, {
          where: { id: createReservationDto.tableId, restaurantId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!table) {
          throw new NotFoundException('Table not found');
        }

        if (table.capacity < createReservationDto.partySize) {
          throw new BadRequestException(
            `Table capacity (${table.capacity}) is less than party size (${createReservationDto.partySize})`
          );
        }

        // Check for conflicting reservations within transaction
        const startTime = subMinutes(reservationDate, 15);
        const endTime = addMinutes(
          reservationDate,
          createReservationDto.estimatedDuration || 90 + 15
        );

        const conflictingReservations = await transactionalEntityManager.count(Reservation, {
          where: {
            tableId: createReservationDto.tableId,
            reservationDate: Between(startTime, endTime),
            status: Between(ReservationStatus.CONFIRMED, ReservationStatus.SEATED),
          },
          lock: { mode: 'pessimistic_read' },
        });

        if (conflictingReservations > 0) {
          throw new ConflictException('Table is not available at this time');
        }
      }

      // Generate confirmation code
      const confirmationCode = this.generateConfirmationCode();

      const reservation = transactionalEntityManager.create(Reservation, {
        ...createReservationDto,
        restaurantId,
        customerId: finalCustomerId,
        confirmationCode,
        status: restaurant.settings?.autoConfirmReservations
          ? ReservationStatus.CONFIRMED
          : ReservationStatus.PENDING,
      });

      const savedReservation = await transactionalEntityManager.save(reservation);

      // Emit WebSocket event
      this.eventsGateway.emitReservationCreated(restaurantId, savedReservation);

      return savedReservation;
    });
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

    const updatedReservation = await this.reservationRepository.save(reservation);

    // Emit WebSocket event
    this.eventsGateway.emitReservationUpdated(reservation.restaurantId, updatedReservation);

    return updatedReservation;
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

    const cancelledReservation = await this.reservationRepository.save(reservation);

    // Emit WebSocket event
    this.eventsGateway.emitReservationCancelled(reservation.restaurantId, cancelledReservation);

    return cancelledReservation;
  }

  async confirm(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be confirmed');
    }

    reservation.status = ReservationStatus.CONFIRMED;
    reservation.confirmedAt = new Date();

    const confirmedReservation = await this.reservationRepository.save(reservation);

    // Emit WebSocket event
    this.eventsGateway.emitReservationConfirmed(reservation.restaurantId, confirmedReservation);

    return confirmedReservation;
  }

  async seat(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed reservations can be seated');
    }

    reservation.status = ReservationStatus.SEATED;
    reservation.seatedAt = new Date();

    const seatedReservation = await this.reservationRepository.save(reservation);

    // Emit WebSocket event
    this.eventsGateway.emitReservationSeated(reservation.restaurantId, seatedReservation);

    return seatedReservation;
  }

  async complete(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.SEATED) {
      throw new BadRequestException('Only seated reservations can be completed');
    }

    reservation.status = ReservationStatus.COMPLETED;
    reservation.completedAt = new Date();

    const completedReservation = await this.reservationRepository.save(reservation);

    // Emit WebSocket event
    this.eventsGateway.emitReservationCompleted(reservation.restaurantId, completedReservation);

    return completedReservation;
  }

  async markNoShow(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    reservation.status = ReservationStatus.NO_SHOW;

    const noShowReservation = await this.reservationRepository.save(reservation);

    // Emit WebSocket event
    this.eventsGateway.emitReservationNoShow(reservation.restaurantId, noShowReservation);

    return noShowReservation;
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

  async getAvailability(
    restaurantId: string,
    date: Date,
    partySize: number
  ): Promise<{
    date: Date;
    availableSlots: {
      time: string;
      available: boolean;
      tablesAvailable: number;
      reason?: string;
    }[];
  }> {
    // Get restaurant
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
    const { maxPartySize, minAdvanceBooking, maxAdvanceBooking } = restaurant.settings;
    if (partySize > maxPartySize) {
      throw new BadRequestException(`Party size cannot exceed ${maxPartySize} guests`);
    }

    // Validate date range
    const now = new Date();
    const maxDate = addMinutes(now, maxAdvanceBooking * 24 * 60);

    // For availability check, only validate that we're not checking a past day
    // Individual time slots will be marked as unavailable if they're in the past
    // or don't meet minAdvanceBooking requirement
    const todayStart = startOfDay(now);
    const requestedDayStart = startOfDay(date);

    if (requestedDayStart < todayStart) {
      throw new BadRequestException('Cannot check availability for past dates');
    }

    if (date > maxDate) {
      throw new BadRequestException(
        `Reservations cannot be made more than ${maxAdvanceBooking} days in advance`
      );
    }

    // Get day of week
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = dayNames[getDay(date)];

    // Get time slots for this day
    const timeSlots = await this.timeSlotRepository.find({
      where: {
        restaurantId,
        dayOfWeek: dayOfWeek as any,
        isActive: true,
      },
    });

    if (timeSlots.length === 0) {
      return {
        date,
        availableSlots: [],
      };
    }

    // Get all active tables
    const tables = await this.tableRepository.find({
      where: { restaurantId, isActive: true },
    });

    // Get all reservations for this day
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    const reservations = await this.reservationRepository.find({
      where: {
        restaurantId,
        reservationDate: Between(dayStart, dayEnd),
        status: Between(ReservationStatus.CONFIRMED, ReservationStatus.SEATED),
      },
    });

    // Generate time slots (every 30 minutes)
    const availableSlots = [];
    for (const timeSlot of timeSlots) {
      const [openHour, openMinute] = timeSlot.openTime.split(':').map(Number);
      const [closeHour, closeMinute] = timeSlot.closeTime.split(':').map(Number);

      let currentTime = new Date(date);
      currentTime.setHours(openHour, openMinute, 0, 0);

      const closeTime = new Date(date);
      closeTime.setHours(closeHour, closeMinute, 0, 0);

      // If close time is before open time, it means it closes next day
      if (closeTime < currentTime) {
        closeTime.setDate(closeTime.getDate() + 1);
      }

      while (currentTime < closeTime) {
        const timeString = format(currentTime, 'HH:mm');

        // Check if this time is in the past
        if (currentTime < now) {
          availableSlots.push({
            time: timeString,
            available: false,
            tablesAvailable: 0,
            reason: 'Time has passed',
          });
          currentTime = addMinutes(currentTime, 30);
          continue;
        }

        // Check if meets minimum advance booking requirement
        const minDate = addMinutes(now, minAdvanceBooking * 60);
        if (currentTime < minDate) {
          availableSlots.push({
            time: timeString,
            available: false,
            tablesAvailable: 0,
            reason: `Reservations must be made at least ${minAdvanceBooking} hours in advance`,
          });
          currentTime = addMinutes(currentTime, 30);
          continue;
        }

        // Count available tables for this time slot
        let availableTables = 0;
        for (const table of tables) {
          if (table.capacity >= partySize) {
            const isTableAvailable = await this.checkTableAvailability(
              table.id,
              currentTime,
              90 // default duration
            );
            if (isTableAvailable) {
              availableTables++;
            }
          }
        }

        availableSlots.push({
          time: timeString,
          available: availableTables > 0,
          tablesAvailable: availableTables,
          reason: availableTables === 0 ? 'No tables available' : undefined,
        });

        currentTime = addMinutes(currentTime, 30);
      }
    }

    return {
      date,
      availableSlots,
    };
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
