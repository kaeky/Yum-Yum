import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...rest } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      ...rest,
    });

    return await this.userRepository.save(user);
  }

  async findAll(filters?: {
    role?: UserRole;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
    const { role, isActive, page = 1, limit = 10 } = filters || {};

    const where: FindOptionsWhere<User> = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;

    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['restaurants', 'reservations'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);

    await this.userRepository.softDelete(id);
  }

  async restore(id: string): Promise<User> {
    await this.userRepository.restore(id);
    return await this.findOne(id);
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.findOne(id);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    return await this.userRepository.save(user);
  }

  async activate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = true;
    return await this.userRepository.save(user);
  }

  async verifyEmail(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isEmailVerified = true;
    user.emailVerificationToken = null as any;
    return await this.userRepository.save(user);
  }
}
