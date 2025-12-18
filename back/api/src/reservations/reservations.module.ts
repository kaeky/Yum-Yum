import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { Table } from '../restaurants/entities/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Restaurant, Table])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
