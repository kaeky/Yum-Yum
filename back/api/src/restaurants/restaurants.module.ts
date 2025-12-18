import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { Restaurant } from './entities/restaurant.entity';
import { Table } from './entities/table.entity';
import { MenuCategory } from './entities/menu-category.entity';
import { MenuItem } from './entities/menu-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Table, MenuCategory, MenuItem])],
  controllers: [RestaurantsController, TablesController],
  providers: [RestaurantsService, TablesService],
  exports: [RestaurantsService, TablesService],
})
export class RestaurantsModule {}
