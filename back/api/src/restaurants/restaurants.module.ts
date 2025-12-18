import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { MenuCategoriesService } from './menu-categories.service';
import { MenuCategoriesController } from './menu-categories.controller';
import { MenuItemsService } from './menu-items.service';
import { MenuItemsController } from './menu-items.controller';
import { TimeSlotsService } from './time-slots.service';
import { TimeSlotsController } from './time-slots.controller';
import { Restaurant } from './entities/restaurant.entity';
import { Table } from './entities/table.entity';
import { MenuCategory } from './entities/menu-category.entity';
import { MenuItem } from './entities/menu-item.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { QRCodeService } from '../common/services/qrcode.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, Table, MenuCategory, MenuItem, TimeSlot]),
    ConfigModule,
  ],
  controllers: [
    RestaurantsController,
    TablesController,
    MenuCategoriesController,
    MenuItemsController,
    TimeSlotsController,
  ],
  providers: [
    RestaurantsService,
    TablesService,
    MenuCategoriesService,
    MenuItemsService,
    TimeSlotsService,
    QRCodeService,
  ],
  exports: [
    RestaurantsService,
    TablesService,
    MenuCategoriesService,
    MenuItemsService,
    TimeSlotsService,
    QRCodeService,
  ],
})
export class RestaurantsModule {}
