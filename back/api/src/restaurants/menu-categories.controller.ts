import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MenuCategoriesService } from './menu-categories.service';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Menu Categories')
@Controller('restaurants/:restaurantId/menu-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MenuCategoriesController {
  constructor(private readonly menuCategoriesService: MenuCategoriesService) {}

  @Post()
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new menu category' })
  @ApiResponse({ status: 201, description: 'Menu category successfully created' })
  async create(
    @Param('restaurantId') restaurantId: string,
    @Body() createMenuCategoryDto: CreateMenuCategoryDto
  ) {
    const category = await this.menuCategoriesService.create(restaurantId, createMenuCategoryDto);
    return {
      success: true,
      data: { category },
    };
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all menu categories for a restaurant' })
  @ApiResponse({ status: 200, description: 'Returns all menu categories' })
  async findAll(@Param('restaurantId') restaurantId: string) {
    const categories = await this.menuCategoriesService.findAll(restaurantId);
    return {
      success: true,
      data: { categories },
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get menu category by ID' })
  @ApiResponse({ status: 200, description: 'Returns menu category' })
  @ApiResponse({ status: 404, description: 'Menu category not found' })
  async findOne(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    const category = await this.menuCategoriesService.findOne(id, restaurantId);
    return {
      success: true,
      data: { category },
    };
  }

  @Patch(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update menu category' })
  @ApiResponse({ status: 200, description: 'Menu category updated successfully' })
  async update(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() updateMenuCategoryDto: UpdateMenuCategoryDto
  ) {
    const category = await this.menuCategoriesService.update(
      id,
      restaurantId,
      updateMenuCategoryDto
    );
    return {
      success: true,
      data: { category },
    };
  }

  @Delete(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete menu category' })
  @ApiResponse({ status: 204, description: 'Menu category deleted successfully' })
  async remove(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    await this.menuCategoriesService.remove(id, restaurantId);
  }

  @Post('reorder')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Reorder menu categories' })
  @ApiResponse({ status: 200, description: 'Categories reordered successfully' })
  async reorder(
    @Param('restaurantId') restaurantId: string,
    @Body('categoryIds') categoryIds: string[]
  ) {
    const categories = await this.menuCategoriesService.reorder(restaurantId, categoryIds);
    return {
      success: true,
      data: { categories },
    };
  }

  @Post(':id/toggle-active')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Toggle active status for menu category' })
  @ApiResponse({ status: 200, description: 'Category active status toggled' })
  async toggleActive(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    const category = await this.menuCategoriesService.toggleActive(id, restaurantId);
    return {
      success: true,
      data: { category },
    };
  }
}
