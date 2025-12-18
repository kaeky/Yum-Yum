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
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Menu Items')
@Controller('restaurants/:restaurantId/menu-items')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({ status: 201, description: 'Menu item successfully created' })
  async create(
    @Param('restaurantId') restaurantId: string,
    @Body() createMenuItemDto: CreateMenuItemDto
  ) {
    const item = await this.menuItemsService.create(restaurantId, createMenuItemDto);
    return {
      success: true,
      data: { item },
    };
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all menu items for a restaurant' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiResponse({ status: 200, description: 'Returns all menu items' })
  async findAll(
    @Param('restaurantId') restaurantId: string,
    @Query('categoryId') categoryId?: string
  ) {
    const items = await this.menuItemsService.findAll(restaurantId, categoryId);
    return {
      success: true,
      data: { items },
    };
  }

  @Get('public-menu')
  @Public()
  @ApiOperation({ summary: 'Get public menu (active and available items only)' })
  @ApiResponse({ status: 200, description: 'Returns public menu with categories and items' })
  async getPublicMenu(@Param('restaurantId') restaurantId: string) {
    const menu = await this.menuItemsService.getPublicMenu(restaurantId);
    return {
      success: true,
      data: { menu },
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get menu item by ID' })
  @ApiResponse({ status: 200, description: 'Returns menu item' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async findOne(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    const item = await this.menuItemsService.findOne(id, restaurantId);
    return {
      success: true,
      data: { item },
    };
  }

  @Patch(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update menu item' })
  @ApiResponse({ status: 200, description: 'Menu item updated successfully' })
  async update(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto
  ) {
    const item = await this.menuItemsService.update(id, restaurantId, updateMenuItemDto);
    return {
      success: true,
      data: { item },
    };
  }

  @Delete(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete menu item' })
  @ApiResponse({ status: 204, description: 'Menu item deleted successfully' })
  async remove(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    await this.menuItemsService.remove(id, restaurantId);
  }

  @Post('categories/:categoryId/reorder')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Reorder menu items within a category' })
  @ApiResponse({ status: 200, description: 'Items reordered successfully' })
  async reorder(
    @Param('restaurantId') restaurantId: string,
    @Param('categoryId') categoryId: string,
    @Body('itemIds') itemIds: string[]
  ) {
    const items = await this.menuItemsService.reorder(restaurantId, categoryId, itemIds);
    return {
      success: true,
      data: { items },
    };
  }

  @Post(':id/toggle-availability')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Toggle availability for menu item' })
  @ApiResponse({ status: 200, description: 'Item availability toggled' })
  async toggleAvailability(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    const item = await this.menuItemsService.toggleAvailability(id, restaurantId);
    return {
      success: true,
      data: { item },
    };
  }

  @Post(':id/toggle-active')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.RESTAURANT_STAFF, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Toggle active status for menu item' })
  @ApiResponse({ status: 200, description: 'Item active status toggled' })
  async toggleActive(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    const item = await this.menuItemsService.toggleActive(id, restaurantId);
    return {
      success: true,
      data: { item },
    };
  }
}
