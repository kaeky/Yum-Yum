import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Table } from './table.entity';
import { MenuCategory } from './menu-category.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

export interface OpeningHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

export interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export interface RestaurantSettings {
  // Reservation settings
  acceptReservations: boolean;
  requireDeposit: boolean;
  depositAmount?: number;
  depositThreshold?: number; // Party size threshold for deposit
  cancellationPolicy: string;
  maxPartySize: number;
  minAdvanceBooking: number; // hours
  maxAdvanceBooking: number; // days
  autoConfirmReservations?: boolean;
  allowWaitlist?: boolean;

  // Feature flags
  enablePreOrder?: boolean;
  enableTableOrdering?: boolean;

  // White-label theme
  theme?: ThemeSettings;
}

@Entity('restaurants')
@Index(['slug'], { unique: true })
@Index(['ownerId'])
@Index(['city', 'cuisine'])
export class Restaurant extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100 })
  cuisine: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 20 })
  postalCode: string;

  @Column({ type: 'varchar', length: 50, default: 'UTC' })
  timezone: string; // IANA timezone (e.g., 'America/Bogota', 'Europe/Madrid')

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column({ type: 'varchar', length: 20, default: '€€' })
  priceRange: string; // €, €€, €€€, €€€€

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'integer', default: 0 })
  reviewCount: number;

  @Column({ type: 'integer', default: 0 })
  capacity: number;

  @Column({ type: 'jsonb', nullable: true })
  openingHours?: OpeningHours;

  @Column({ type: 'jsonb', nullable: true })
  settings?: RestaurantSettings;

  @Column({ type: 'text', array: true, default: '{}' })
  images: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  coverImage?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;

  @Column({ type: 'text', array: true, default: '{}' })
  amenities: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  // Foreign keys
  @Column({ type: 'uuid' })
  ownerId: string;

  // Relations
  @ManyToOne(() => User, user => user.restaurants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Table, table => table.restaurant)
  tables: Table[];

  @OneToMany(() => MenuCategory, category => category.restaurant)
  menuCategories: MenuCategory[];

  @OneToMany(() => Reservation, reservation => reservation.restaurant)
  reservations: Reservation[];
}
