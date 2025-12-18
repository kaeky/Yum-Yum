import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Restaurant } from './restaurant.entity';
import { MenuCategory } from './menu-category.entity';

@Entity('menu_items')
@Index(['restaurantId', 'categoryId'])
@Index(['restaurantId', 'isAvailable'])
export class MenuItem extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  @Column({ type: 'text', array: true, default: '{}' })
  allergens: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  dietaryInfo: string[]; // vegetarian, vegan, gluten-free, etc.

  @Column({ type: 'integer', nullable: true })
  calories?: number;

  @Column({ type: 'integer', nullable: true })
  preparationTime?: number; // in minutes

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isSpecial: boolean;

  @Column({ type: 'integer', default: 0 })
  displayOrder: number;

  // Foreign keys
  @Column({ type: 'uuid' })
  restaurantId: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  // Relations
  @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @ManyToOne(() => MenuCategory, category => category.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: MenuCategory;
}
