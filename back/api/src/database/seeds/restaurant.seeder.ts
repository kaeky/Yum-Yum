import { DataSource } from 'typeorm';

export class RestaurantSeeder {
  async run(dataSource: DataSource): Promise<void> {
    console.log('\n🏪 Seeding restaurants...');

    const restaurantRepository = dataSource.getRepository('Restaurant');
    const userRepository = dataSource.getRepository('User');

    // Check if demo restaurant already exists
    const existingRestaurant = await restaurantRepository.findOne({
      where: { slug: 'la-bella-italia' },
    });

    if (existingRestaurant) {
      console.log('  ⏭️  Demo restaurant already exists, skipping...');
      return;
    }

    // Get the restaurant owner
    const owner = await userRepository.findOne({
      where: { email: 'owner@demo-restaurant.com' },
    });

    if (!owner) {
      console.log('  ⚠️  Restaurant owner not found, skipping restaurant seed...');
      return;
    }

    // Create demo restaurant
    const restaurant = restaurantRepository.create({
      name: 'La Bella Italia',
      slug: 'la-bella-italia',
      description:
        'Auténtica cocina italiana con ingredientes frescos y recetas tradicionales. Ambiente acogedor perfecto para disfrutar en familia.',
      cuisine: 'Italiana',
      phone: '+34 915 123 456',
      email: 'info@labellaitalia.com',
      address: 'Calle Gran Vía, 25',
      city: 'Madrid',
      state: 'Madrid',
      country: 'España',
      postalCode: '28013',
      latitude: 40.4168,
      longitude: -3.7038,
      priceRange: '€€',
      rating: 4.7,
      reviewCount: 234,
      capacity: 80,
      openingHours: {
        monday: { open: '13:00', close: '23:30', closed: false },
        tuesday: { open: '13:00', close: '23:30', closed: false },
        wednesday: { open: '13:00', close: '23:30', closed: false },
        thursday: { open: '13:00', close: '23:30', closed: false },
        friday: { open: '13:00', close: '00:30', closed: false },
        saturday: { open: '13:00', close: '00:30', closed: false },
        sunday: { open: '13:00', close: '23:00', closed: false },
      },
      settings: {
        acceptReservations: true,
        requireDeposit: false,
        cancellationPolicy: '24h',
        maxPartySize: 12,
        minAdvanceBooking: 1,
        maxAdvanceBooking: 60,
      },
      ownerId: owner.id,
      isActive: true,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await restaurantRepository.save(restaurant);
    console.log('  ✅ Restaurant created: La Bella Italia');

    // Seed tables for the restaurant
    const tableRepository = dataSource.getRepository('Table');

    const tables = [
      { number: 1, capacity: 2, section: 'Terraza', isActive: true },
      { number: 2, capacity: 2, section: 'Terraza', isActive: true },
      { number: 3, capacity: 4, section: 'Terraza', isActive: true },
      { number: 4, capacity: 4, section: 'Terraza', isActive: true },
      { number: 5, capacity: 2, section: 'Interior', isActive: true },
      { number: 6, capacity: 2, section: 'Interior', isActive: true },
      { number: 7, capacity: 4, section: 'Interior', isActive: true },
      { number: 8, capacity: 4, section: 'Interior', isActive: true },
      { number: 9, capacity: 6, section: 'Interior', isActive: true },
      { number: 10, capacity: 6, section: 'Sala VIP', isActive: true },
      { number: 11, capacity: 8, section: 'Sala VIP', isActive: true },
      { number: 12, capacity: 10, section: 'Sala VIP', isActive: true },
    ];

    for (const tableData of tables) {
      const table = tableRepository.create({
        ...tableData,
        restaurantId: restaurant.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await tableRepository.save(table);
    }

    console.log('  ✅ Created 12 tables for the restaurant');

    // Seed menu categories and items
    const menuCategoryRepository = dataSource.getRepository('MenuCategory');

    const antipastiCategory = menuCategoryRepository.create({
      name: 'Antipasti',
      description: 'Entrantes tradicionales italianos',
      displayOrder: 1,
      isActive: true,
      restaurantId: restaurant.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await menuCategoryRepository.save(antipastiCategory);

    const pastaCategory = menuCategoryRepository.create({
      name: 'Pasta',
      description: 'Pasta fresca hecha en casa',
      displayOrder: 2,
      isActive: true,
      restaurantId: restaurant.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await menuCategoryRepository.save(pastaCategory);

    const pizzaCategory = menuCategoryRepository.create({
      name: 'Pizza',
      description: 'Pizzas artesanales al horno de leña',
      displayOrder: 3,
      isActive: true,
      restaurantId: restaurant.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await menuCategoryRepository.save(pizzaCategory);

    console.log('  ✅ Created menu categories');

    // Seed menu items
    const menuItemRepository = dataSource.getRepository('MenuItem');

    const menuItems = [
      {
        categoryId: antipastiCategory.id,
        name: 'Bruschetta al Pomodoro',
        description: 'Pan tostado con tomate fresco, albahaca y aceite de oliva',
        price: 8.5,
        displayOrder: 1,
      },
      {
        categoryId: antipastiCategory.id,
        name: 'Caprese',
        description: 'Tomate, mozzarella di bufala, albahaca fresca y aceite de oliva',
        price: 12.0,
        displayOrder: 2,
      },
      {
        categoryId: pastaCategory.id,
        name: 'Spaghetti Carbonara',
        description: 'Pasta con huevo, queso pecorino, guanciale y pimienta negra',
        price: 14.5,
        displayOrder: 1,
      },
      {
        categoryId: pastaCategory.id,
        name: 'Ravioli Ricotta e Spinaci',
        description: 'Raviolis rellenos de ricotta y espinacas con salsa de mantequilla y salvia',
        price: 16.0,
        displayOrder: 2,
      },
      {
        categoryId: pastaCategory.id,
        name: 'Lasagna Bolognese',
        description: 'Lasaña tradicional con ragú de carne y bechamel',
        price: 15.5,
        displayOrder: 3,
      },
      {
        categoryId: pizzaCategory.id,
        name: 'Pizza Margherita',
        description: 'Salsa de tomate, mozzarella, albahaca fresca',
        price: 11.0,
        displayOrder: 1,
      },
      {
        categoryId: pizzaCategory.id,
        name: 'Pizza Quattro Formaggi',
        description: 'Mozzarella, gorgonzola, parmesano y provolone',
        price: 14.0,
        displayOrder: 2,
      },
      {
        categoryId: pizzaCategory.id,
        name: 'Pizza Diavola',
        description: 'Salsa de tomate, mozzarella, salami picante',
        price: 13.5,
        displayOrder: 3,
      },
    ];

    for (const itemData of menuItems) {
      const menuItem = menuItemRepository.create({
        ...itemData,
        restaurantId: restaurant.id,
        isAvailable: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await menuItemRepository.save(menuItem);
    }

    console.log('  ✅ Created 8 menu items');
  }
}
