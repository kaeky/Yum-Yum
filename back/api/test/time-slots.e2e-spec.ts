import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DayOfWeek } from '../src/restaurants/entities/time-slot.entity';

describe('TimeSlots (e2e)', () => {
  let app: INestApplication;
  let ownerToken: string;
  let restaurantId: string;
  let timeSlotId: string;

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
      email: 'timeslotowner@restaurant.com',
      password: 'Owner123!',
      firstName: 'TimeSlot',
      lastName: 'Owner',
      role: 'restaurant_owner',
    });

    ownerToken = registerRes.body.data.tokens.accessToken;

    // Create a restaurant for time slot testing
    const restaurantRes = await request(app.getHttpServer())
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'TimeSlot Test Restaurant',
        cuisine: 'Italian',
        phone: '+34 915 123 888',
        email: 'timeslot@testrestaurant.com',
        address: 'Calle TimeSlot, 123',
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

  describe('/api/restaurants/:restaurantId/time-slots (POST)', () => {
    it('should create a new time slot', () => {
      return request(app.getHttpServer())
        .post(`/api/restaurants/${restaurantId}/time-slots`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          dayOfWeek: DayOfWeek.MONDAY,
          openTime: '09:00',
          closeTime: '17:00',
          isActive: true,
        })
        .expect(201)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.timeSlot).toHaveProperty('id');
          expect(res.body.data.timeSlot.dayOfWeek).toBe(DayOfWeek.MONDAY);
          expect(res.body.data.timeSlot.openTime).toBe('09:00');
          expect(res.body.data.timeSlot.closeTime).toBe('17:00');
          timeSlotId = res.body.data.timeSlot.id;
        });
    });

    it('should fail with invalid time format', () => {
      return request(app.getHttpServer())
        .post(`/api/restaurants/${restaurantId}/time-slots`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          dayOfWeek: DayOfWeek.TUESDAY,
          openTime: '9:00', // Invalid format (should be 09:00)
          closeTime: '17:00',
        })
        .expect(400);
    });

    it('should fail when openTime is after closeTime', () => {
      return request(app.getHttpServer())
        .post(`/api/restaurants/${restaurantId}/time-slots`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          dayOfWeek: DayOfWeek.TUESDAY,
          openTime: '18:00',
          closeTime: '17:00', // Before openTime
        })
        .expect(400);
    });

    it('should fail with overlapping time slot', () => {
      return request(app.getHttpServer())
        .post(`/api/restaurants/${restaurantId}/time-slots`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          dayOfWeek: DayOfWeek.MONDAY, // Same day as first slot
          openTime: '10:00', // Overlaps with 09:00-17:00
          closeTime: '18:00',
        })
        .expect(409); // Conflict
    });

    it('should create non-overlapping slot on same day', () => {
      return request(app.getHttpServer())
        .post(`/api/restaurants/${restaurantId}/time-slots`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          dayOfWeek: DayOfWeek.MONDAY,
          openTime: '18:00', // After first slot (09:00-17:00)
          closeTime: '23:00',
        })
        .expect(201);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post(`/api/restaurants/${restaurantId}/time-slots`)
        .send({
          dayOfWeek: DayOfWeek.TUESDAY,
          openTime: '09:00',
          closeTime: '17:00',
        })
        .expect(401);
    });
  });

  describe('/api/restaurants/:restaurantId/time-slots/defaults (POST)', () => {
    it('should create default time slots for all days', async () => {
      // Create a new restaurant for default slots test
      const restaurantRes = await request(app.getHttpServer())
        .post('/api/restaurants')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          name: 'Default Slots Test',
          cuisine: 'Italian',
          phone: '+34 915 123 777',
          email: 'defaults@test.com',
          address: 'Test Street',
          city: 'Madrid',
          state: 'Madrid',
          country: 'Spain',
          postalCode: '28001',
          capacity: 50,
        });

      const newRestaurantId = restaurantRes.body.data.restaurant.id;

      return request(app.getHttpServer())
        .post(`/api/restaurants/${newRestaurantId}/time-slots/defaults`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(201)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.timeSlots).toHaveLength(7); // 7 days
          res.body.data.timeSlots.forEach((slot: any) => {
            expect(slot.openTime).toBe('09:00');
            expect(slot.closeTime).toBe('22:00');
            expect(slot.isActive).toBe(true);
          });
        });
    });
  });

  describe('/api/restaurants/:restaurantId/time-slots (GET)', () => {
    it('should get all time slots', () => {
      return request(app.getHttpServer())
        .get(`/api/restaurants/${restaurantId}/time-slots`)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data.timeSlots)).toBe(true);
          expect(res.body.data.timeSlots.length).toBeGreaterThan(0);
        });
    });

    it('should filter by day of week', () => {
      return request(app.getHttpServer())
        .get(`/api/restaurants/${restaurantId}/time-slots?dayOfWeek=${DayOfWeek.MONDAY}`)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data.timeSlots)).toBe(true);
          res.body.data.timeSlots.forEach((slot: any) => {
            expect(slot.dayOfWeek).toBe(DayOfWeek.MONDAY);
          });
        });
    });
  });

  describe('/api/restaurants/:restaurantId/time-slots/:id (GET)', () => {
    it('should get a specific time slot', () => {
      return request(app.getHttpServer())
        .get(`/api/restaurants/${restaurantId}/time-slots/${timeSlotId}`)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.timeSlot.id).toBe(timeSlotId);
        });
    });

    it('should return 404 for non-existent time slot', () => {
      return request(app.getHttpServer())
        .get(`/api/restaurants/${restaurantId}/time-slots/00000000-0000-0000-0000-000000000000`)
        .expect(404);
    });
  });

  describe('/api/restaurants/:restaurantId/time-slots/:id (PATCH)', () => {
    it('should update a time slot', () => {
      return request(app.getHttpServer())
        .patch(`/api/restaurants/${restaurantId}/time-slots/${timeSlotId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          openTime: '08:00',
          closeTime: '16:00',
        })
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.timeSlot.openTime).toBe('08:00');
          expect(res.body.data.timeSlot.closeTime).toBe('16:00');
        });
    });

    it('should fail to update with overlapping time', () => {
      return request(app.getHttpServer())
        .patch(`/api/restaurants/${restaurantId}/time-slots/${timeSlotId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          openTime: '19:00', // Would overlap with 18:00-23:00 slot
          closeTime: '22:00',
        })
        .expect(409);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .patch(`/api/restaurants/${restaurantId}/time-slots/${timeSlotId}`)
        .send({
          openTime: '10:00',
        })
        .expect(401);
    });
  });

  describe('/api/restaurants/:restaurantId/time-slots/:id/toggle-active (POST)', () => {
    it('should toggle time slot active status', () => {
      return request(app.getHttpServer())
        .post(`/api/restaurants/${restaurantId}/time-slots/${timeSlotId}/toggle-active`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.timeSlot).toHaveProperty('isActive');
        });
    });
  });

  describe('/api/restaurants/:restaurantId/time-slots/:id (DELETE)', () => {
    it('should delete a time slot', () => {
      return request(app.getHttpServer())
        .delete(`/api/restaurants/${restaurantId}/time-slots/${timeSlotId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(204);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .delete(`/api/restaurants/${restaurantId}/time-slots/${timeSlotId}`)
        .expect(401);
    });
  });
});
