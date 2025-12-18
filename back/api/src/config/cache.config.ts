import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default registerAs('cache', () => ({
  ttl: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hour default
  max: parseInt(process.env.CACHE_MAX_ITEMS || '100', 10),
}));
