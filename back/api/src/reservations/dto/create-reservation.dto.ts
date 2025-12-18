import {
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsDate,
  IsEnum,
  IsUUID,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../entities/reservation.entity';

export class CreateReservationDto {
  @ApiProperty({ example: '2024-12-25T19:00:00Z' })
  @Type(() => Date)
  @IsDate()
  reservationDate: Date;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  @Max(20)
  partySize: number;

  @ApiProperty({ example: 'María García' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  customerName: string;

  @ApiProperty({ example: 'maria@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '+34 612 345 678' })
  @IsString()
  customerPhone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  tableId?: string;

  @ApiProperty({ enum: ReservationStatus, required: false })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiProperty({ example: 90, required: false })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(240)
  estimatedDuration?: number;
}
