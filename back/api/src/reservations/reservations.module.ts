import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { Table } from '../restaurants/entities/table.entity';
import { TimeSlot } from '../restaurants/entities/time-slot.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { EventsGateway } from '../gateways/events.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Restaurant, Table, TimeSlot, User]),
    UsersModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, EventsGateway],
  exports: [ReservationsService],
})
export class ReservationsModule {}
