import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';
import { RequestWithUser } from '../common/types/request-with-user.type';

@ApiTags('Tables')
@Controller('restaurants/:restaurantId/tables')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new table' })
  async create(
    @Param('restaurantId') restaurantId: string,
    @Body() createTableDto: CreateTableDto,
    @Request() req: RequestWithUser
  ) {
    const table = await this.tablesService.create(
      restaurantId,
      createTableDto,
      req.user.id,
      req.user.role
    );
    return {
      success: true,
      data: { table },
    };
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all tables for a restaurant' })
  async findByRestaurant(@Param('restaurantId') restaurantId: string) {
    const tables = await this.tablesService.findByRestaurant(restaurantId);
    return {
      success: true,
      data: { tables },
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get table by ID' })
  async findOne(@Param('id') id: string) {
    const table = await this.tablesService.findOne(id);
    return {
      success: true,
      data: { table },
    };
  }

  @Patch(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update table' })
  async update(
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
    @Request() req: RequestWithUser
  ) {
    const table = await this.tablesService.update(id, updateTableDto, req.user.id, req.user.role);
    return {
      success: true,
      data: { table },
    };
  }

  @Delete(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete table' })
  async remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    await this.tablesService.remove(id, req.user.id, req.user.role);
  }
}
