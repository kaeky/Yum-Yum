import { IsNumber, IsString, IsBoolean, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TableStatus } from '../entities/table.entity';

export class CreateTableDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  number: number;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 'Terraza', required: false })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  floor?: number;

  @ApiProperty({ enum: TableStatus, required: false })
  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  positionX?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  positionY?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
