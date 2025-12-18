import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Restaurant } from './restaurant.entity';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Entity('time_slots')
@Index(['restaurantId', 'dayOfWeek'])
export class TimeSlot extends BaseEntity {
  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek: DayOfWeek;

  @Column({ type: 'time' })
  openTime: string; // Format: "HH:MM" (e.g., "09:00")

  @Column({ type: 'time' })
  closeTime: string; // Format: "HH:MM" (e.g., "22:00")

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string; // Optional notes (e.g., "Happy hour 17:00-19:00")

  // Foreign keys
  @Column({ type: 'uuid' })
  restaurantId: string;

  // Relations
  @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;
}
