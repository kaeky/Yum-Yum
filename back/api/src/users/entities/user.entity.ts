import { Entity, Column, OneToMany, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../common/entities/base.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

export const UserRole = {
  SUPER_ADMIN: 'super_admin',
  RESTAURANT_OWNER: 'restaurant_owner',
  RESTAURANT_STAFF: 'restaurant_staff',
  CUSTOMER: 'customer',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

@Entity('users')
@Index(['email'], { unique: true })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude()
  refreshToken?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude()
  emailVerificationToken?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude()
  passwordResetToken?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  passwordResetExpires?: Date;

  // Relations
  @OneToMany(() => Restaurant, restaurant => restaurant.owner)
  restaurants: Restaurant[];

  @OneToMany(() => Reservation, reservation => reservation.customer)
  reservations: Reservation[];

  // Virtual fields
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
