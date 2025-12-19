import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'your-secret-key'),
    });
  }

  async validate(payload: JwtPayload): Promise<User & { restaurantId?: string }> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
      relations: ['restaurants'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Add restaurantId from first restaurant if user has restaurants
    const userWithRestaurantId: User & { restaurantId?: string } = user;
    if (user.restaurants && user.restaurants.length > 0) {
      userWithRestaurantId.restaurantId = user.restaurants[0].id;
    }

    return userWithRestaurantId;
  }
}
