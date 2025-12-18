import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsArray,
  IsObject,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OpeningHours, RestaurantSettings } from '../entities/restaurant.entity';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'La Bella Italia' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Auténtica cocina italiana', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Italiana' })
  @IsString()
  cuisine: string;

  @ApiProperty({ example: '+34 915 123 456' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'info@labellaitalia.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Calle Gran Vía, 25' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Madrid' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Madrid' })
  @IsString()
  state: string;

  @ApiProperty({ example: 'España' })
  @IsString()
  country: string;

  @ApiProperty({ example: '28013' })
  @IsString()
  postalCode: string;

  @ApiProperty({ example: 40.4168, required: false })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({ example: -3.7038, required: false })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({ example: '€€', required: false })
  @IsOptional()
  @IsString()
  priceRange?: string;

  @ApiProperty({ example: 80, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  openingHours?: OpeningHours;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  settings?: RestaurantSettings;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];
}
