import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '.env') });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'yumyum',
  password: process.env.DB_PASSWORD || 'yumyum123',
  database: process.env.DB_DATABASE || 'yumyum_db',
  entities: [path.join(__dirname, 'src/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'src/database/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

export default AppDataSource;
