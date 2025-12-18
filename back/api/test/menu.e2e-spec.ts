import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Menu (e2e)', () => {
  let app: INestApplication;
  let ownerToken: string;
  let restaurantId: string;
  let categoryId: string;
  let itemId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      })
    );
    await app.init();

    // Create a restaurant owner for testing
    const registerRes = await request(app.getHttpServer()).post('/api/auth/register').send({
      email: 'menuowner@restaurant.com',
      password: 'Owner123!',
      firstName: 'Menu',
      lastName: 'Owner',
      role: 'restaurant_owner',
    });

    ownerToken = registerRes.body.data.tokens.accessToken;

    // Create a restaurant for menu testing
    const restaurantRes = await request(app.getHttpServer())
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'Menu Test Restaurant',
        cuisine: 'Italian',
        phone: '+34 915 123 999',
        email: 'menu@testrestaurant.com',
        address: 'Calle Menu, 123',
        city: 'Madrid',
        state: 'Madrid',
        country: 'Spain',
        postalCode: '28001',
        capacity: 50,
      });

    restaurantId = restaurantRes.body.data.restaurant.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Menu Categories', () => {
    describe('/api/restaurants/:restaurantId/menu-categories (POST)', () => {
      it('should create a new menu category', () => {
        return request(app.getHttpServer())
          .post(`/api/restaurants/${restaurantId}/menu-categories`)
          .set('Authorization', `Bearer ${ownerToken}`)
          .send({
            name: 'Appetizers',
            description: 'Delicious starters',
            displayOrder: 0,
          })
          .expect(201)
          .expect(res => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.category).toHaveProperty('id');
            expect(res.body.data.category.name).toBe('Appetizers');
            expect(res.body.data.category.displayOrder).toBe(0);
            categoryId = res.body.data.category.id;
          });
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .post(`/api/restaurants/${restaurantId}/menu-categories`)
          .send({
            name: 'Unauthorized Category',
            description: 'Should fail',
          })
          .expect(401);
      });

      it('should fail with missing required fields', () => {
        return request(app.getHttpServer())
          .post(`/api/restaurants/${restaurantId}/menu-categories`)
          .set('Authorization', `Bearer ${ownerToken}`)
          .send({
            description: 'Missing name',
          })
          .expect(400);
      });
    });

    describe('/api/restaurants/:restaurantId/menu-categories (GET)', () => {
      it('should get all menu categories', () => {
        return request(app.getHttpServer())
          .get(`/api/restaurants/${restaurantId}/menu-categories`)
          .expect(200)
          .expect(res => {
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data.categories)).toBe(true);
            expect(res.body.data.categories.length).toBeGreaterThan(0);
          });
      });
    });

    describe('/api/restaurants/:restaurantId/menu-categories/:id (GET)', () => {
      it('should get a specific menu category', () => {
        return request(app.getHttpServer())
          .get(`/api/restaurants/${restaurantId}/menu-categories/${categoryId}`)
          .expect(200)
          .expect(res => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.category.id).toBe(categoryId);
            expect(res.body.data.category.name).toBe('Appetizers');
          });
      });

      it('should return 404 for non-existent category', () => {
        return request(app.getHttpServer())
          .get(
            `/api/restaurants/${restaurantId}/menu-categories/00000000-0000-0000-0000-000000000000`
          )
          .expect(404);
      });
    });

    describe('/api/restaurants/:restaurantId/menu-categories/:id (PATCH)', () => {
      it('should update a menu category', () => {
        return request(app.getHttpServer())
          .patch(`/api/restaurants/${restaurantId}/menu-categories/${categoryId}`)
          .set('Authorization', `Bearer ${ownerToken}`)
          .send({
            name: 'Updated Appetizers',
            description: 'Updated description',
          })
          .expect(200)
          .expect(res => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.category.name).toBe('Updated Appetizers');
            expect(res.body.data.category.description).toBe('Updated description');
          });
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .patch(`/api/restaurants/${restaurantId}/menu-categories/${categoryId}`)
          .send({
            name: 'Should Fail',
          })
          .expect(401);
      });
    });

    describe('/api/restaurants/:restaurantId/menu-categories/:id/toggle-active (POST)', () => {
      it('should toggle category active status', () => {
        return request(app.getHttpServer())
          .post(`/api/restaurants/${restaurantId}/menu-categories/${categoryId}/toggle-active`)
          .set('Authorization', `Bearer ${ownerToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.category).toHaveProperty('isActive');
          });
      });
    });
  });

  describe('Menu Items', () => {
    describe('/api/restaurants/:restaurantId/menu-items (POST)', () => {
      it('should create a new menu item', () => {
        return request(app.getHttpServer())
          .post(`/api/restaurants/${restaurantId}/menu-items`)
          .set('Authorization', `Bearer ${ownerToken}`)
          .send({
            categoryId: categoryId,
            name: 'Bruschetta',
            description: 'Toasted bread with tomatoes',
            price: 8.5,
            calories: 200,
            preparationTime: 10,
            allergens: ['gluten'],
            dietaryInfo: ['vegetarian'],
            isAvailable: true,
            isSpecial: false,
          })
          .expect(201)
          .expect(res => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.item).toHaveProperty('id');
            expect(res.body.data.item.name).toBe('Bruschetta');
            expect(res.body.data.item.price).toBe(8.5);
            expect(res.body.data.item.categoryId).toBe(categoryId);
            itemId = res.body.data.item.id;
          });
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .post(`/api/restaurants/${restaurantId}/menu-items`)
          .send({
            categoryId: categoryId,
            name: 'Unauthorized Item',
            price: 10,
          })
          .expect(401);
      });

      it('should fail with missing required fields', () => {
        return request(app.getHttpServer())
          .post(`/api/restaurants/${restaurantId}/menu-items`)
          .set('Authorization', `Bearer ${ownerToken}`)
          .send({
            name: 'Incomplete Item',
            // Missing categoryId and price
          })
          .expect(400);
      });

      it('should fail with non-existent category', () => {
        return request(app.getHttpServer())
          .post(`/api/restaurants/${restaurantId}/menu-items`)
          .set('Authorization', `Bearer ${ownerToken}`)
          .send({
            categoryId: '00000000-0000-0000-0000-000000000000',
            name: 'Invalid Category Item',
            price: 10,
          })
          .expect(404);
      });
    });

    describe('/api/restaurants/:restaurantId/menu-items (GET)', () => {
      it('should get all menu items', () => {
        return request(app.getHttpServer())
          .get(`/api/restaurants/${restaurantId}/menu-items`)
          .expect(200)
          .expect(res => {
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data.items)).toBe(true);
            expect(res.body.data.items.length).toBeGreaterThan(0);
          });
      });

      it('should filter items by category', () => {
        return request(app.getHttpServer())
          .get(`/api/restaurants/${restaurantId}/menu-items?categoryId=${categoryId}`)
          .expect(200)
          .expect(res => {
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data.items)).toBe(true);
            res.body.data.items.forEach((item: any) => {
              expect(item.categoryId).toBe(categoryId);
            });
          });
      });
    });

    describe('/api/restaurants/:restaurantId/menu-items/public-menu (GET)', () => {
      it('should get public menu with categories and items', () => {
        return request(app.getHttpServer())
          .get(`/api/restaurants/${restaurantId}/menu-items/public-menu`)
          .expect(200)
          .expect(res => {
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data.menu)).toBe(true);
            // Public menu should only include active categories with active items
          });
      });
    });

    describe('/api/restaurants/:restaurantId/menu-items/:id (GET)', () => {
      it('should get a specific menu item', () => {
        return request(app.getHttpServer())
          .get(`/api/restaurants/${restaurantId}/menu-items/${itemId}`)
          .expect(200)
          .expect(res => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.item.id).toBe(itemId);
            expect(res.body.data.item.name).toBe('Bruschetta');
          });
      });

      it('should return 404 for non-existent item', () => {
        return request(app.getHttpServer())
          .get(`/api/restaurants/${restaurantId}/menu-items/00000000-0000-0000-0000-000000000000`)
          .expect(404);
      });
    });

    describe('/api/restaurants/:restaurantId/menu-items/:id (PATCH)', () => {
      it('should update a menu item', () => {
        return request(app.getHttpServer())
          .patch(`/api/restaurants/${restaurantId}/menu-items/${itemId}`)
          .set('Authorization', `Bearer ${ownerToken}`)
          .send({
            name: 'Updated Bruschetta',
            price: 9.5,
          })
          .expect(200)
          .expect(res => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.item.name).toBe('Updated Bruschetta');
            expect(res.body.data.item.price).toBe(9.5);
          });
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .patch(`/api/restaurants/${restaurantId}/menu-items/${itemId}`)
          .send({
            name: 'Should Fail',
          })
          .expect(401);
      });
    });

    describe('/api/restaurants/:restaurantId/menu-items/:id/toggle-availability (POST)', () => {
      it('should toggle item availability', () => {
        return request(app.getHttpServer())
          .post(`/api/restaurants/${restaurantId}/menu-items/${itemId}/toggle-availability`)
          .set('Authorization', `Bearer ${ownerToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.item).toHaveProperty('isAvailable');
          });
      });
    });

    describe('/api/restaurants/:restaurantId/menu-items/:id/toggle-active (POST)', () => {
      it('should toggle item active status', () => {
        return request(app.getHttpServer())
          .post(`/api/restaurants/${restaurantId}/menu-items/${itemId}/toggle-active`)
          .set('Authorization', `Bearer ${ownerToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.item).toHaveProperty('isActive');
          });
      });
    });

    describe('/api/restaurants/:restaurantId/menu-items/:id (DELETE)', () => {
      it('should delete a menu item', () => {
        return request(app.getHttpServer())
          .delete(`/api/restaurants/${restaurantId}/menu-items/${itemId}`)
          .set('Authorization', `Bearer ${ownerToken}`)
          .expect(204);
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .delete(`/api/restaurants/${restaurantId}/menu-items/${itemId}`)
          .expect(401);
      });
    });
  });

  describe('Menu Categories - Delete', () => {
    describe('/api/restaurants/:restaurantId/menu-categories/:id (DELETE)', () => {
      it('should delete a menu category', () => {
        return request(app.getHttpServer())
          .delete(`/api/restaurants/${restaurantId}/menu-categories/${categoryId}`)
          .set('Authorization', `Bearer ${ownerToken}`)
          .expect(204);
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .delete(`/api/restaurants/${restaurantId}/menu-categories/${categoryId}`)
          .expect(401);
      });
    });
  });
});
