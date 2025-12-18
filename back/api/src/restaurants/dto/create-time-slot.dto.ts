import { IsEnum, IsString, IsOptional, IsBoolean, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DayOfWeek } from '../entities/time-slot.entity';

export class CreateTimeSlotDto {
  @ApiProperty({
    description: 'Day of the week',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty({
    description: 'Opening time in HH:MM format (24-hour)',
    example: '09:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'openTime must be in HH:MM format (24-hour)',
  })
  openTime: string;

  @ApiProperty({
    description: 'Closing time in HH:MM format (24-hour)',
    example: '22:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'closeTime must be in HH:MM format (24-hour)',
  })
  closeTime: string;

  @ApiPropertyOptional({
    description: 'Whether this time slot is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Optional notes about this time slot',
    example: 'Happy hour from 17:00 to 19:00',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
