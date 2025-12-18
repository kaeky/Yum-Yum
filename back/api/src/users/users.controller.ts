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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { RequestWithUser } from '../common/types/request-with-user.type';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      data: { user },
    };
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('role') role?: UserRole,
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const result = await this.usersService.findAll({
      role,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    // Users can only view their own profile unless they're an admin
    if (req.user.id !== id && req.user.role !== UserRole.SUPER_ADMIN) {
      throw new Error('Unauthorized');
    }

    const user = await this.usersService.findOne(id);
    return {
      success: true,
      data: { user },
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser
  ) {
    // Users can only update their own profile unless they're an admin
    if (req.user.id !== id && req.user.role !== UserRole.SUPER_ADMIN) {
      throw new Error('Unauthorized');
    }

    const user = await this.usersService.update(id, updateUserDto);
    return {
      success: true,
      data: { user },
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 204, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }

  @Post(':id/activate')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Activate user (Admin only)' })
  async activate(@Param('id') id: string) {
    const user = await this.usersService.activate(id);
    return {
      success: true,
      data: { user },
    };
  }

  @Post(':id/deactivate')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Deactivate user (Admin only)' })
  async deactivate(@Param('id') id: string) {
    const user = await this.usersService.deactivate(id);
    return {
      success: true,
      data: { user },
    };
  }
}
