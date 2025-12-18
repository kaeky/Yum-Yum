import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

export interface RequestWithOptionalUser extends Request {
  user?: User;
}
