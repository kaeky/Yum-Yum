import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ReservationStatus } from './entities/reservation.entity';
import { RequestWithUser } from '../common/types/request-with-user.type';
import { RequestWithOptionalUser } from '../common/types/request-with-optional-user.type';

@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('restaurants/:restaurantId')
  @Public()
  @ApiOperation({ summary: 'Create a new reservation' })
  async create(
    @Param('restaurantId') restaurantId: string,
    @Body() createReservationDto: CreateReservationDto,
    @Request() req: RequestWithOptionalUser
  ) {
    const customerId = req.user?.id;
    const reservation = await this.reservationsService.create(
      restaurantId,
      createReservationDto,
      customerId
    );
    return {
      success: true,
      data: { reservation },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all reservations' })
  @ApiQuery({ name: 'restaurantId', required: false })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ReservationStatus })
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('restaurantId') restaurantId?: string,
    @Query('customerId') customerId?: string,
    @Query('status') status?: ReservationStatus,
    @Query('date') date?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const result = await this.reservationsService.findAll({
      restaurantId,
      customerId,
      status,
      date: date ? new Date(date) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return {
      success: true,
      data: result,
    };
  }

  @Get('my-reservations')
  @ApiOperation({ summary: 'Get current user reservations' })
  async getMyReservations(@Request() req: RequestWithUser) {
    const result = await this.reservationsService.findAll({
      customerId: req.user.id,
    });

    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation by ID' })
  async findOne(@Param('id') id: string) {
    const reservation = await this.reservationsService.findOne(id);
    return {
      success: true,
      data: { reservation },
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update reservation' })
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @Request() req: RequestWithUser
  ) {
    const reservation = await this.reservationsService.update(
      id,
      updateReservationDto,
      req.user.id,
      req.user.role
    );
    return {
      success: true,
      data: { reservation },
    };
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel reservation' })
  async cancel(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Request() req: RequestWithUser
  ) {
    const reservation = await this.reservationsService.cancel(
      id,
      reason,
      req.user.id,
      req.user.role
    );
    return {
      success: true,
      data: { reservation },
    };
  }

  @Post(':id/confirm')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Confirm reservation' })
  async confirm(@Param('id') id: string) {
    const reservation = await this.reservationsService.confirm(id);
    return {
      success: true,
      data: { reservation },
    };
  }

  @Post(':id/seat')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Seat reservation' })
  async seat(@Param('id') id: string) {
    const reservation = await this.reservationsService.seat(id);
    return {
      success: true,
      data: { reservation },
    };
  }

  @Post(':id/complete')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Complete reservation' })
  async complete(@Param('id') id: string) {
    const reservation = await this.reservationsService.complete(id);
    return {
      success: true,
      data: { reservation },
    };
  }

  @Post(':id/no-show')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mark reservation as no-show' })
  async noShow(@Param('id') id: string) {
    const reservation = await this.reservationsService.markNoShow(id);
    return {
      success: true,
      data: { reservation },
    };
  }
}
