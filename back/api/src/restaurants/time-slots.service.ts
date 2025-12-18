import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot, DayOfWeek } from './entities/time-slot.entity';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>
  ) {}

  /**
   * Validate that openTime is before closeTime
   */
  private validateTimes(openTime: string, closeTime: string): void {
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;

    if (openMinutes >= closeMinutes) {
      throw new BadRequestException('Opening time must be before closing time');
    }
  }

  /**
   * Check if a new time slot overlaps with existing ones for the same day
   */
  private async checkOverlap(
    restaurantId: string,
    dayOfWeek: DayOfWeek,
    openTime: string,
    closeTime: string,
    excludeId?: string
  ): Promise<void> {
    const existingSlots = await this.timeSlotRepository.find({
      where: { restaurantId, dayOfWeek, isActive: true },
    });

    const [newOpenHour, newOpenMinute] = openTime.split(':').map(Number);
    const [newCloseHour, newCloseMinute] = closeTime.split(':').map(Number);
    const newOpenMinutes = newOpenHour * 60 + newOpenMinute;
    const newCloseMinutes = newCloseHour * 60 + newCloseMinute;

    for (const slot of existingSlots) {
      // Skip if checking the same slot (for updates)
      if (excludeId && slot.id === excludeId) continue;

      const [existingOpenHour, existingOpenMinute] = slot.openTime.split(':').map(Number);
      const [existingCloseHour, existingCloseMinute] = slot.closeTime.split(':').map(Number);
      const existingOpenMinutes = existingOpenHour * 60 + existingOpenMinute;
      const existingCloseMinutes = existingCloseHour * 60 + existingCloseMinute;

      // Check for overlap
      const hasOverlap =
        (newOpenMinutes >= existingOpenMinutes && newOpenMinutes < existingCloseMinutes) ||
        (newCloseMinutes > existingOpenMinutes && newCloseMinutes <= existingCloseMinutes) ||
        (newOpenMinutes <= existingOpenMinutes && newCloseMinutes >= existingCloseMinutes);

      if (hasOverlap) {
        throw new ConflictException(
          `Time slot overlaps with existing slot for ${dayOfWeek}: ${slot.openTime} - ${slot.closeTime}`
        );
      }
    }
  }

  async create(restaurantId: string, createTimeSlotDto: CreateTimeSlotDto): Promise<TimeSlot> {
    // Validate times
    this.validateTimes(createTimeSlotDto.openTime, createTimeSlotDto.closeTime);

    // Check for overlaps
    await this.checkOverlap(
      restaurantId,
      createTimeSlotDto.dayOfWeek,
      createTimeSlotDto.openTime,
      createTimeSlotDto.closeTime
    );

    const timeSlot = this.timeSlotRepository.create({
      ...createTimeSlotDto,
      restaurantId,
    });

    return await this.timeSlotRepository.save(timeSlot);
  }

  async findAll(restaurantId: string): Promise<TimeSlot[]> {
    return await this.timeSlotRepository.find({
      where: { restaurantId },
      order: {
        dayOfWeek: 'ASC',
        openTime: 'ASC',
      },
    });
  }

  async findByDay(restaurantId: string, dayOfWeek: DayOfWeek): Promise<TimeSlot[]> {
    return await this.timeSlotRepository.find({
      where: { restaurantId, dayOfWeek },
      order: { openTime: 'ASC' },
    });
  }

  async findOne(id: string, restaurantId: string): Promise<TimeSlot> {
    const timeSlot = await this.timeSlotRepository.findOne({
      where: { id, restaurantId },
    });

    if (!timeSlot) {
      throw new NotFoundException(`Time slot with ID ${id} not found`);
    }

    return timeSlot;
  }

  async update(
    id: string,
    restaurantId: string,
    updateTimeSlotDto: UpdateTimeSlotDto
  ): Promise<TimeSlot> {
    const timeSlot = await this.findOne(id, restaurantId);

    const openTime = updateTimeSlotDto.openTime || timeSlot.openTime;
    const closeTime = updateTimeSlotDto.closeTime || timeSlot.closeTime;
    const dayOfWeek = updateTimeSlotDto.dayOfWeek || timeSlot.dayOfWeek;

    // Validate times
    this.validateTimes(openTime, closeTime);

    // Check for overlaps (excluding current slot)
    await this.checkOverlap(restaurantId, dayOfWeek, openTime, closeTime, id);

    Object.assign(timeSlot, updateTimeSlotDto);

    return await this.timeSlotRepository.save(timeSlot);
  }

  async remove(id: string, restaurantId: string): Promise<void> {
    const timeSlot = await this.findOne(id, restaurantId);
    await this.timeSlotRepository.softDelete(id);
  }

  async toggleActive(id: string, restaurantId: string): Promise<TimeSlot> {
    const timeSlot = await this.findOne(id, restaurantId);
    timeSlot.isActive = !timeSlot.isActive;
    return await this.timeSlotRepository.save(timeSlot);
  }

  /**
   * Create default time slots for a restaurant (Mon-Sun 9:00-22:00)
   */
  async createDefaults(restaurantId: string): Promise<TimeSlot[]> {
    const days = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ];

    const timeSlots: TimeSlot[] = [];

    for (const day of days) {
      const timeSlot = this.timeSlotRepository.create({
        restaurantId,
        dayOfWeek: day,
        openTime: '09:00',
        closeTime: '22:00',
        isActive: true,
      });
      timeSlots.push(await this.timeSlotRepository.save(timeSlot));
    }

    return timeSlots;
  }
}
