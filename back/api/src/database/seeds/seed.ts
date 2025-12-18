import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { UserSeeder } from './user.seeder';
import { RestaurantSeeder } from './restaurant.seeder';

config({ path: join(__dirname, '../../../.env') });

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'yumyum'),
  password: configService.get('DB_PASSWORD', 'yumyum123'),
  database: configService.get('DB_DATABASE', 'yumyum_db'),
  entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
  synchronize: false,
});

async function runSeeders() {
  console.log('🌱 Starting database seeding...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    // Run seeders in order
    const userSeeder = new UserSeeder();
    await userSeeder.run(AppDataSource);

    const restaurantSeeder = new RestaurantSeeder();
    await restaurantSeeder.run(AppDataSource);

    console.log('\n✅ All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
    console.log('\n🔌 Database connection closed');
  }
}

runSeeders()
  .then(() => {
    console.log('\n🎉 Seeding process finished');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
