import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto, ownerId: string): Promise<Restaurant> {
    // Generate slug from name
    const slug = this.generateSlug(createRestaurantDto.name);

    // Check if slug already exists
    const existingRestaurant = await this.restaurantRepository.findOne({
      where: { slug },
    });

    if (existingRestaurant) {
      throw new ConflictException('Restaurant with this name already exists');
    }

    const restaurant = this.restaurantRepository.create({
      ...createRestaurantDto,
      slug,
      ownerId,
    });

    return await this.restaurantRepository.save(restaurant);
  }

  async findAll(filters?: {
    city?: string;
    cuisine?: string;
    search?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    restaurants: Restaurant[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { city, cuisine, search, isActive, isFeatured, page = 1, limit = 10 } = filters || {};

    const where: FindOptionsWhere<Restaurant> = {};
    if (city) where.city = ILike(`%${city}%`);
    if (cuisine) where.cuisine = ILike(`%${cuisine}%`);
    if (isActive !== undefined) where.isActive = isActive;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;

    const queryBuilder = this.restaurantRepository.createQueryBuilder('restaurant');

    if (city) queryBuilder.andWhere('restaurant.city ILIKE :city', { city: `%${city}%` });
    if (cuisine)
      queryBuilder.andWhere('restaurant.cuisine ILIKE :cuisine', { cuisine: `%${cuisine}%` });
    if (search) {
      queryBuilder.andWhere(
        '(restaurant.name ILIKE :search OR restaurant.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    if (isActive !== undefined)
      queryBuilder.andWhere('restaurant.isActive = :isActive', { isActive });
    if (isFeatured !== undefined)
      queryBuilder.andWhere('restaurant.isFeatured = :isFeatured', { isFeatured });

    queryBuilder
      .leftJoinAndSelect('restaurant.owner', 'owner')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('restaurant.rating', 'DESC')
      .addOrderBy('restaurant.reviewCount', 'DESC');

    const [restaurants, total] = await queryBuilder.getManyAndCount();

    return {
      restaurants,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['owner', 'tables', 'menuCategories'],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return restaurant;
  }

  async findBySlug(slug: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { slug },
      relations: ['owner', 'tables', 'menuCategories'],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with slug ${slug} not found`);
    }

    return restaurant;
  }

  async findByOwner(ownerId: string): Promise<Restaurant[]> {
    return await this.restaurantRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
    userId: string,
    userRole: string
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    // Check authorization
    if (restaurant.ownerId !== userId && userRole !== 'super_admin') {
      throw new ForbiddenException('You do not have permission to update this restaurant');
    }

    // If name is being updated, regenerate slug
    if (updateRestaurantDto.name && updateRestaurantDto.name !== restaurant.name) {
      const newSlug = this.generateSlug(updateRestaurantDto.name);
      const existingRestaurant = await this.restaurantRepository.findOne({
        where: { slug: newSlug },
      });

      if (existingRestaurant && existingRestaurant.id !== id) {
        throw new ConflictException('Restaurant with this name already exists');
      }

      restaurant.slug = newSlug;
    }

    Object.assign(restaurant, updateRestaurantDto);

    return await this.restaurantRepository.save(restaurant);
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const restaurant = await this.findOne(id);

    // Check authorization
    if (restaurant.ownerId !== userId && userRole !== 'super_admin') {
      throw new ForbiddenException('You do not have permission to delete this restaurant');
    }

    await this.restaurantRepository.softDelete(id);
  }

  async verifyRestaurant(id: string): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    restaurant.isVerified = true;
    return await this.restaurantRepository.save(restaurant);
  }

  async featureRestaurant(id: string, featured: boolean): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    restaurant.isFeatured = featured;
    return await this.restaurantRepository.save(restaurant);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }
}
