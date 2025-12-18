import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

// DataSource para TypeORM CLI (migraciones)
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: String(process.env.DB_HOST || 'localhost'),
  port: Number(process.env.DB_PORT || 5432),
  username: String(process.env.DB_USERNAME || 'postgres'),
  password: String(process.env.DB_PASSWORD || 'postgres'),
  database: String(process.env.DB_DATABASE || 'yumyum'),
  entities: [__dirname + '/../**/entities/*{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
  synchronize: false,
  dropSchema: false,
  logging: 'all',
  migrationsTableName: 'migrations',
  ssl,
} as any;

export default registerAs('database', () => ({
  ...dataSourceOptions,
  logging: process.env.NODE_ENV === 'development',
  ssl,
  extra: {
    max: 20,
    connectionTimeoutMillis: 10000,
  },
}));
