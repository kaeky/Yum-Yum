import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from './entities/table.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>
  ) {}

  async create(
    restaurantId: string,
    createTableDto: CreateTableDto,
    userId: string,
    userRole: string
  ): Promise<Table> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Check authorization
    if (restaurant.ownerId !== userId && userRole !== 'super_admin') {
      throw new ForbiddenException('You do not have permission to add tables to this restaurant');
    }

    // Check if table number already exists in this restaurant
    const existingTable = await this.tableRepository.findOne({
      where: { restaurantId, number: createTableDto.number },
    });

    if (existingTable) {
      throw new ConflictException(
        `Table number ${createTableDto.number} already exists in this restaurant`
      );
    }

    const table = this.tableRepository.create({
      ...createTableDto,
      restaurantId,
    });

    return await this.tableRepository.save(table);
  }

  async findByRestaurant(restaurantId: string): Promise<Table[]> {
    return await this.tableRepository.find({
      where: { restaurantId },
      order: { number: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Table> {
    const table = await this.tableRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    return table;
  }

  async update(
    id: string,
    updateTableDto: UpdateTableDto,
    userId: string,
    userRole: string
  ): Promise<Table> {
    const table = await this.findOne(id);

    // Check authorization
    if (table.restaurant.ownerId !== userId && userRole !== 'super_admin') {
      throw new ForbiddenException('You do not have permission to update this table');
    }

    Object.assign(table, updateTableDto);

    return await this.tableRepository.save(table);
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const table = await this.findOne(id);

    // Check authorization
    if (table.restaurant.ownerId !== userId && userRole !== 'super_admin') {
      throw new ForbiddenException('You do not have permission to delete this table');
    }

    await this.tableRepository.softDelete(id);
  }
}
