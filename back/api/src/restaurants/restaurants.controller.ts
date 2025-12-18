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
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';
import { RequestWithUser } from '../common/types/request-with-user.type';

@ApiTags('Restaurants')
@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Restaurant successfully created' })
  async create(@Body() createRestaurantDto: CreateRestaurantDto, @Request() req: RequestWithUser) {
    const restaurant = await this.restaurantsService.create(createRestaurantDto, req.user.id);
    return {
      success: true,
      data: { restaurant },
    };
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'cuisine', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('city') city?: string,
    @Query('cuisine') cuisine?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const result = await this.restaurantsService.findAll({
      city,
      cuisine,
      search,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return {
      success: true,
      data: result,
    };
  }

  @Get('my-restaurants')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get restaurants owned by current user' })
  async getMyRestaurants(@Request() req: RequestWithUser) {
    const restaurants = await this.restaurantsService.findByOwner(req.user.id);
    return {
      success: true,
      data: { restaurants },
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get restaurant by ID' })
  @ApiResponse({ status: 200, description: 'Restaurant found' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async findOne(@Param('id') id: string) {
    const restaurant = await this.restaurantsService.findOne(id);
    return {
      success: true,
      data: { restaurant },
    };
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get restaurant by slug' })
  async findBySlug(@Param('slug') slug: string) {
    const restaurant = await this.restaurantsService.findBySlug(slug);
    return {
      success: true,
      data: { restaurant },
    };
  }

  @Patch(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update restaurant' })
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @Request() req: RequestWithUser
  ) {
    const restaurant = await this.restaurantsService.update(
      id,
      updateRestaurantDto,
      req.user.id,
      req.user.role
    );
    return {
      success: true,
      data: { restaurant },
    };
  }

  @Delete(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete restaurant' })
  async remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    await this.restaurantsService.remove(id, req.user.id, req.user.role);
  }

  @Post(':id/verify')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Verify restaurant (Admin only)' })
  async verify(@Param('id') id: string) {
    const restaurant = await this.restaurantsService.verifyRestaurant(id);
    return {
      success: true,
      data: { restaurant },
    };
  }

  @Post(':id/feature')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Feature restaurant (Admin only)' })
  async feature(@Param('id') id: string, @Body('featured') featured: boolean) {
    const restaurant = await this.restaurantsService.featureRestaurant(id, featured);
    return {
      success: true,
      data: { restaurant },
    };
  }
}
