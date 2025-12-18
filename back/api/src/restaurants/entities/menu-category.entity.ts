import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Restaurant } from './restaurant.entity';
import { MenuItem } from './menu-item.entity';

@Entity('menu_categories')
@Index(['restaurantId', 'displayOrder'])
export class MenuCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'integer', default: 0 })
  displayOrder: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  // Foreign keys
  @Column({ type: 'uuid' })
  restaurantId: string;

  // Relations
  @ManyToOne(() => Restaurant, restaurant => restaurant.menuCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @OneToMany(() => MenuItem, item => item.category)
  items: MenuItem[];
}
