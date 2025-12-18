import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Table } from '../../restaurants/entities/table.entity';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SEATED = 'seated',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

@Entity('reservations')
@Index(['restaurantId', 'reservationDate'])
@Index(['customerId'])
@Index(['status', 'reservationDate'])
export class Reservation extends BaseEntity {
  @Column({ type: 'timestamp with time zone' })
  reservationDate: Date;

  @Column({ type: 'integer' })
  partySize: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ type: 'varchar', length: 100 })
  customerName: string;

  @Column({ type: 'varchar', length: 255 })
  customerEmail: string;

  @Column({ type: 'varchar', length: 20 })
  customerPhone: string;

  @Column({ type: 'text', nullable: true })
  specialRequests?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  seatedAt?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  completedAt?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cancellationReason?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  depositAmount?: number;

  @Column({ type: 'boolean', default: false })
  depositPaid: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  confirmationCode?: string;

  @Column({ type: 'boolean', default: false })
  reminderSent: boolean;

  @Column({ type: 'integer', default: 90 })
  estimatedDuration: number; // in minutes

  // Foreign keys
  @Column({ type: 'uuid' })
  restaurantId: string;

  @Column({ type: 'uuid', nullable: true })
  customerId?: string;

  @Column({ type: 'uuid', nullable: true })
  tableId?: string;

  // Relations
  @ManyToOne(() => Restaurant, restaurant => restaurant.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @ManyToOne(() => User, user => user.reservations, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'customerId' })
  customer?: User;

  @ManyToOne(() => Table, table => table.reservations, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'tableId' })
  table?: Table;
}
