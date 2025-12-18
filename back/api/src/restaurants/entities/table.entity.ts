import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Restaurant } from './restaurant.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  CLEANING = 'cleaning',
  OUT_OF_SERVICE = 'out_of_service',
}

@Entity('tables')
@Index(['restaurantId', 'number'], { unique: true })
export class Table extends BaseEntity {
  @Column({ type: 'integer' })
  number: number;

  @Column({ type: 'integer' })
  capacity: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  section?: string;

  @Column({ type: 'integer', default: 1 })
  floor: number;

  @Column({
    type: 'enum',
    enum: TableStatus,
    default: TableStatus.AVAILABLE,
  })
  status: TableStatus;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'integer', nullable: true })
  positionX?: number;

  @Column({ type: 'integer', nullable: true })
  positionY?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Foreign keys
  @Column({ type: 'uuid' })
  restaurantId: string;

  // Relations
  @ManyToOne(() => Restaurant, restaurant => restaurant.tables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @OneToMany(() => Reservation, reservation => reservation.table)
  reservations: Reservation[];
}
