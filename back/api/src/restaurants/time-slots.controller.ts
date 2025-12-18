import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TimeSlotsService } from './time-slots.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';
import { DayOfWeek } from './entities/time-slot.entity';

@ApiTags('Time Slots')
@Controller('restaurants/:restaurantId/time-slots')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Post()
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new time slot' })
  @ApiResponse({ status: 201, description: 'Time slot successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid time format or overlap detected' })
  async create(
    @Param('restaurantId') restaurantId: string,
    @Body() createTimeSlotDto: CreateTimeSlotDto
  ) {
    const timeSlot = await this.timeSlotsService.create(restaurantId, createTimeSlotDto);
    return {
      success: true,
      data: { timeSlot },
    };
  }

  @Post('defaults')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create default time slots (Mon-Sun 9:00-22:00)' })
  @ApiResponse({ status: 201, description: 'Default time slots created' })
  async createDefaults(@Param('restaurantId') restaurantId: string) {
    const timeSlots = await this.timeSlotsService.createDefaults(restaurantId);
    return {
      success: true,
      data: { timeSlots },
    };
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all time slots for a restaurant' })
  @ApiQuery({ name: 'dayOfWeek', required: false, enum: DayOfWeek })
  @ApiResponse({ status: 200, description: 'Returns all time slots' })
  async findAll(
    @Param('restaurantId') restaurantId: string,
    @Query('dayOfWeek') dayOfWeek?: DayOfWeek
  ) {
    const timeSlots = dayOfWeek
      ? await this.timeSlotsService.findByDay(restaurantId, dayOfWeek)
      : await this.timeSlotsService.findAll(restaurantId);

    return {
      success: true,
      data: { timeSlots },
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get time slot by ID' })
  @ApiResponse({ status: 200, description: 'Returns time slot' })
  @ApiResponse({ status: 404, description: 'Time slot not found' })
  async findOne(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    const timeSlot = await this.timeSlotsService.findOne(id, restaurantId);
    return {
      success: true,
      data: { timeSlot },
    };
  }

  @Patch(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update time slot' })
  @ApiResponse({ status: 200, description: 'Time slot updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid time format or overlap detected' })
  async update(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() updateTimeSlotDto: UpdateTimeSlotDto
  ) {
    const timeSlot = await this.timeSlotsService.update(id, restaurantId, updateTimeSlotDto);
    return {
      success: true,
      data: { timeSlot },
    };
  }

  @Delete(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete time slot' })
  @ApiResponse({ status: 204, description: 'Time slot deleted successfully' })
  async remove(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    await this.timeSlotsService.remove(id, restaurantId);
  }

  @Post(':id/toggle-active')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Toggle active status for time slot' })
  @ApiResponse({ status: 200, description: 'Time slot status toggled' })
  async toggleActive(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    const timeSlot = await this.timeSlotsService.toggleActive(id, restaurantId);
    return {
      success: true,
      data: { timeSlot },
    };
  }
}
