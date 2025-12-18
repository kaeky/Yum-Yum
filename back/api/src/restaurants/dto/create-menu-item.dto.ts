import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @ApiProperty({
    description: 'Menu category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'Item name',
    example: 'Margherita Pizza',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Item description',
    example: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Item price',
    example: 12.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Item image URL',
    example: 'https://example.com/images/pizza.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    description: 'Allergens list',
    example: ['gluten', 'dairy'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergens?: string[];

  @ApiPropertyOptional({
    description: 'Dietary information tags',
    example: ['vegetarian', 'gluten-free', 'spicy'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dietaryInfo?: string[];

  @ApiPropertyOptional({
    description: 'Calories count',
    example: 800,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  calories?: number;

  @ApiPropertyOptional({
    description: 'Preparation time in minutes',
    example: 15,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  preparationTime?: number;

  @ApiPropertyOptional({
    description: 'Is item available',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    description: 'Is featured item',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isSpecial?: boolean;

  @ApiPropertyOptional({
    description: 'Display order for sorting items',
    example: 1,
    default: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;
}
