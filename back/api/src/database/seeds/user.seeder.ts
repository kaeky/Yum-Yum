import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class UserSeeder {
  async run(dataSource: DataSource): Promise<void> {
    console.log('👤 Seeding users...');

    const userRepository = dataSource.getRepository('User');

    // Check if super admin already exists
    const existingSuperAdmin = await userRepository.findOne({
      where: { email: 'admin@yumyum.com' },
    });

    if (existingSuperAdmin) {
      console.log('  ⏭️  Super admin already exists, skipping...');
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    // Create super admin
    const superAdmin = userRepository.create({
      email: 'admin@yumyum.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin',
      isActive: true,
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await userRepository.save(superAdmin);
    console.log('  ✅ Super admin created: admin@yumyum.com / Admin123!');

    // Create demo restaurant owner
    const restaurantOwner = userRepository.create({
      email: 'owner@demo-restaurant.com',
      password: hashedPassword,
      firstName: 'Carlos',
      lastName: 'Restaurante',
      role: 'restaurant_owner',
      isActive: true,
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await userRepository.save(restaurantOwner);
    console.log('  ✅ Restaurant owner created: owner@demo-restaurant.com / Admin123!');

    // Create demo customer
    const customer = userRepository.create({
      email: 'customer@example.com',
      password: hashedPassword,
      firstName: 'María',
      lastName: 'López',
      role: 'customer',
      isActive: true,
      isEmailVerified: true,
      phone: '+34 612 345 678',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await userRepository.save(customer);
    console.log('  ✅ Customer created: customer@example.com / Admin123!');
  }
}
