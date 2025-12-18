import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RestaurantsController (e2e)', () => {
  let app: INestApplication;
  let ownerToken: string;
  let restaurantId: string;

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
      email: 'owner@restaurant.com',
      password: 'Owner123!',
      firstName: 'Restaurant',
      lastName: 'Owner',
      role: 'restaurant_owner',
    });

    ownerToken = registerRes.body.data.tokens.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/restaurants (POST)', () => {
    it('should create a new restaurant', () => {
      return request(app.getHttpServer())
        .post('/api/restaurants')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          name: 'Test Restaurant',
          cuisine: 'Italian',
          phone: '+34 915 123 456',
          email: 'info@testrestaurant.com',
          address: 'Calle Test, 123',
          city: 'Madrid',
          state: 'Madrid',
          country: 'Spain',
          postalCode: '28001',
          capacity: 50,
        })
        .expect(201)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.restaurant).toHaveProperty('id');
          expect(res.body.data.restaurant.name).toBe('Test Restaurant');
          expect(res.body.data.restaurant.slug).toBe('test-restaurant');
          restaurantId = res.body.data.restaurant.id;
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/api/restaurants')
        .send({
          name: 'Unauthorized Restaurant',
          cuisine: 'Italian',
          phone: '+34 915 123 456',
          email: 'info@unauthorized.com',
          address: 'Test Street',
          city: 'Madrid',
          state: 'Madrid',
          country: 'Spain',
          postalCode: '28001',
        })
        .expect(401);
    });

    it('should fail with missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/restaurants')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          name: 'Incomplete Restaurant',
        })
        .expect(400);
    });
  });

  describe('/api/restaurants (GET)', () => {
    it('should get all restaurants', () => {
      return request(app.getHttpServer())
        .get('/api/restaurants')
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data.restaurants)).toBe(true);
          expect(res.body.data.restaurants.length).toBeGreaterThan(0);
        });
    });

    it('should filter restaurants by city', () => {
      return request(app.getHttpServer())
        .get('/api/restaurants?city=Madrid')
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data.restaurants)).toBe(true);
        });
    });

    it('should filter restaurants by cuisine', () => {
      return request(app.getHttpServer())
        .get('/api/restaurants?cuisine=Italian')
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data.restaurants)).toBe(true);
        });
    });

    it('should search restaurants', () => {
      return request(app.getHttpServer())
        .get('/api/restaurants?search=Test')
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data.restaurants)).toBe(true);
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/api/restaurants?page=1&limit=5')
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('page', 1);
          expect(res.body.data).toHaveProperty('totalPages');
          expect(res.body.data).toHaveProperty('total');
        });
    });
  });

  describe('/api/restaurants/:id (GET)', () => {
    it('should get restaurant by ID', () => {
      return request(app.getHttpServer())
        .get(`/api/restaurants/${restaurantId}`)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.restaurant.id).toBe(restaurantId);
          expect(res.body.data.restaurant.name).toBe('Test Restaurant');
        });
    });

    it('should return 404 for non-existent restaurant', () => {
      return request(app.getHttpServer())
        .get('/api/restaurants/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('/api/restaurants/:id (PATCH)', () => {
    it('should update restaurant', () => {
      return request(app.getHttpServer())
        .patch(`/api/restaurants/${restaurantId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          capacity: 100,
          priceRange: '€€€',
        })
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.restaurant.capacity).toBe(100);
          expect(res.body.data.restaurant.priceRange).toBe('€€€');
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .patch(`/api/restaurants/${restaurantId}`)
        .send({
          capacity: 100,
        })
        .expect(401);
    });
  });

  describe('/api/restaurants/:restaurantId/tables (POST)', () => {
    it('should create a table for restaurant', () => {
      return request(app.getHttpServer())
        .post(`/api/restaurants/${restaurantId}/tables`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          number: 1,
          capacity: 4,
          section: 'Main Dining',
        })
        .expect(201)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.table.number).toBe(1);
          expect(res.body.data.table.capacity).toBe(4);
        });
    });

    it('should fail to create duplicate table number', () => {
      return request(app.getHttpServer())
        .post(`/api/restaurants/${restaurantId}/tables`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          number: 1,
          capacity: 4,
        })
        .expect(409);
    });
  });

  describe('/api/restaurants/:restaurantId/tables (GET)', () => {
    it('should get all tables for restaurant', () => {
      return request(app.getHttpServer())
        .get(`/api/restaurants/${restaurantId}/tables`)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data.tables)).toBe(true);
          expect(res.body.data.tables.length).toBeGreaterThan(0);
        });
    });
  });
});
