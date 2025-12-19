import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { addDays, addHours, setHours, setMinutes } from 'date-fns';
import { io, Socket } from 'socket.io-client';

describe('ReservationsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let ownerToken: string;
  let restaurantId: string;
  let tableId: string;
  let customerId: string;
  let socketClient: Socket;

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
    await app.listen(4001); // Use different port for testing

    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Setup test data
    await setupTestData();
  });

  afterAll(async () => {
    if (socketClient && socketClient.connected) {
      socketClient.disconnect();
    }
    await app.close();
  });

  const setupTestData = async () => {
    // Create restaurant owner
    const ownerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `owner-${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Restaurant',
        lastName: 'Owner',
        role: 'restaurant_owner',
      });

    ownerToken = ownerRes.body.data.tokens.accessToken;

    // Create restaurant
    const restaurantRes = await request(app.getHttpServer())
      .post('/restaurants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'Test Restaurant',
        slug: `test-restaurant-${Date.now()}`,
        description: 'A test restaurant',
        cuisine: 'Italian',
        phone: '+1234567890',
        email: 'restaurant@test.com',
        address: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        postalCode: '12345',
        capacity: 50,
        priceRange: '$$',
      });

    restaurantId = restaurantRes.body.data.restaurant.id;

    // Create time slots
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for (const day of days) {
      await request(app.getHttpServer())
        .post('/restaurants/tables/time-slots')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          restaurantId,
          dayOfWeek: day,
          openTime: '10:00',
          closeTime: '22:00',
          isActive: true,
        });
    }

    // Create table
    const tableRes = await request(app.getHttpServer())
      .post('/restaurants/tables')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        restaurantId,
        number: 1,
        section: 'Main',
        capacity: 4,
        isActive: true,
      });

    tableId = tableRes.body.data.table.id;

    // Create customer
    const customerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `customer-${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'Customer',
        role: 'customer',
      });

    customerId = customerRes.body.data.user.id;
  };

  describe('Availability Check', () => {
    it('should get available time slots', async () => {
      const tomorrow = addDays(new Date(), 1);
      const date = tomorrow.toISOString();

      const response = await request(app.getHttpServer())
        .get(`/reservations/restaurants/${restaurantId}/availability`)
        .query({
          date,
          partySize: 2,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.availableSlots).toBeDefined();
      expect(Array.isArray(response.body.data.availableSlots)).toBe(true);

      // Should have slots between 10:00 and 22:00
      const slots = response.body.data.availableSlots;
      expect(slots.length).toBeGreaterThan(0);
      expect(slots[0]).toHaveProperty('time');
      expect(slots[0]).toHaveProperty('available');
      expect(slots[0]).toHaveProperty('tablesAvailable');
    });

    it('should return no slots for party size exceeding capacity', async () => {
      const tomorrow = addDays(new Date(), 1);
      const date = tomorrow.toISOString();

      const response = await request(app.getHttpServer())
        .get(`/reservations/restaurants/${restaurantId}/availability`)
        .query({
          date,
          partySize: 100, // Exceeds restaurant capacity
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      const slots = response.body.data.availableSlots;
      const availableSlots = slots.filter((s: any) => s.available);
      expect(availableSlots.length).toBe(0);
    });
  });

  describe('Create Reservation', () => {
    it('should create a reservation for anonymous customer', async () => {
      const tomorrow = addDays(new Date(), 1);
      const reservationDate = setMinutes(setHours(tomorrow, 19), 0).toISOString();

      const response = await request(app.getHttpServer())
        .post(`/reservations/restaurants/${restaurantId}`)
        .send({
          reservationDate,
          partySize: 2,
          customerName: 'John Doe',
          customerEmail: `anon-${Date.now()}@example.com`,
          customerPhone: '+1234567890',
          specialRequests: 'Window seat please',
          estimatedDuration: 90,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reservation).toHaveProperty('id');
      expect(response.body.data.reservation.status).toBe('pending');
      expect(response.body.data.reservation.confirmationCode).toBeDefined();
      expect(response.body.data.reservation.customerName).toBe('John Doe');
    });

    it('should fail to create reservation outside operating hours', async () => {
      const tomorrow = addDays(new Date(), 1);
      const reservationDate = setMinutes(setHours(tomorrow, 23), 0).toISOString(); // 11 PM

      await request(app.getHttpServer())
        .post(`/reservations/restaurants/${restaurantId}`)
        .send({
          reservationDate,
          partySize: 2,
          customerName: 'John Doe',
          customerEmail: `late-${Date.now()}@example.com`,
          customerPhone: '+1234567890',
          estimatedDuration: 90,
        })
        .expect(400);
    });

    it('should fail with invalid party size', async () => {
      const tomorrow = addDays(new Date(), 1);
      const reservationDate = setMinutes(setHours(tomorrow, 19), 0).toISOString();

      await request(app.getHttpServer())
        .post(`/reservations/restaurants/${restaurantId}`)
        .send({
          reservationDate,
          partySize: 0, // Invalid
          customerName: 'John Doe',
          customerEmail: `invalid-${Date.now()}@example.com`,
          customerPhone: '+1234567890',
          estimatedDuration: 90,
        })
        .expect(400);
    });
  });

  describe('Concurrency Tests', () => {
    it('should handle simultaneous reservations correctly', async () => {
      const tomorrow = addDays(new Date(), 2);
      const reservationDate = setMinutes(setHours(tomorrow, 20), 0).toISOString();

      // Create multiple simultaneous reservation attempts for the same table
      const reservationPromises = Array.from({ length: 5 }, (_, i) =>
        request(app.getHttpServer())
          .post(`/reservations/restaurants/${restaurantId}`)
          .send({
            reservationDate,
            partySize: 4, // Will need the only table we have
            customerName: `Customer ${i}`,
            customerEmail: `concurrent-${i}-${Date.now()}@example.com`,
            customerPhone: `+123456789${i}`,
            estimatedDuration: 90,
          })
      );

      const results = await Promise.allSettled(reservationPromises);

      // Count successful reservations
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.status === 201);

      // With only 1 table and same time slot, only 1 should succeed
      // Others should fail due to no availability
      expect(successful.length).toBeLessThanOrEqual(1);

      // At least one should succeed
      expect(successful.length).toBeGreaterThanOrEqual(1);

      if (successful.length > 0) {
        const successfulReservation = (successful[0] as any).value.body.data.reservation;
        expect(successfulReservation.status).toBe('pending');
      }
    });

    it('should handle race condition with table locks', async () => {
      // Create another table for this test
      const table2Res = await request(app.getHttpServer())
        .post('/restaurants/tables')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          restaurantId,
          number: 2,
          section: 'Main',
          capacity: 4,
          isActive: true,
        });

      const table2Id = table2Res.body.data.table.id;

      const tomorrow = addDays(new Date(), 3);
      const reservationDate = setMinutes(setHours(tomorrow, 18), 0).toISOString();

      // Create two simultaneous reservations for the same table
      const [result1, result2] = await Promise.allSettled([
        request(app.getHttpServer())
          .post(`/reservations/restaurants/${restaurantId}`)
          .send({
            reservationDate,
            partySize: 2,
            tableId: table2Id,
            customerName: 'Race 1',
            customerEmail: `race1-${Date.now()}@example.com`,
            customerPhone: '+1111111111',
            estimatedDuration: 90,
          }),
        request(app.getHttpServer())
          .post(`/reservations/restaurants/${restaurantId}`)
          .send({
            reservationDate,
            partySize: 2,
            tableId: table2Id,
            customerName: 'Race 2',
            customerEmail: `race2-${Date.now()}@example.com`,
            customerPhone: '+2222222222',
            estimatedDuration: 90,
          }),
      ]);

      // One should succeed, one should fail
      const successCount = [result1, result2].filter(
        r => r.status === 'fulfilled' && (r.value as any).status === 201
      ).length;

      const failCount = [result1, result2].filter(
        r =>
          r.status === 'fulfilled' &&
          ((r.value as any).status === 409 || (r.value as any).status === 400)
      ).length;

      expect(successCount).toBe(1);
      expect(failCount).toBe(1);
    });
  });

  describe('Reservation State Management', () => {
    let reservationId: string;

    beforeEach(async () => {
      const tomorrow = addDays(new Date(), 4);
      const reservationDate = setMinutes(setHours(tomorrow, 19), 30).toISOString();

      const response = await request(app.getHttpServer())
        .post(`/reservations/restaurants/${restaurantId}`)
        .send({
          reservationDate,
          partySize: 2,
          customerName: 'State Test',
          customerEmail: `state-${Date.now()}@example.com`,
          customerPhone: '+9999999999',
          estimatedDuration: 90,
        });

      reservationId = response.body.data.reservation.id;
    });

    it('should confirm a pending reservation', async () => {
      const response = await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/confirm`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reservation.status).toBe('confirmed');
    });

    it('should seat a confirmed reservation', async () => {
      // First confirm
      await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/confirm`)
        .set('Authorization', `Bearer ${ownerToken}`);

      // Then seat
      const response = await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/seat`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reservation.status).toBe('seated');
    });

    it('should complete a seated reservation', async () => {
      // Confirm
      await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/confirm`)
        .set('Authorization', `Bearer ${ownerToken}`);

      // Seat
      await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/seat`)
        .set('Authorization', `Bearer ${ownerToken}`);

      // Complete
      const response = await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/complete`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reservation.status).toBe('completed');
    });

    it('should cancel a reservation', async () => {
      const response = await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/cancel`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          reason: 'Customer request',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reservation.status).toBe('cancelled');
      expect(response.body.data.reservation.cancellationReason).toBe('Customer request');
    });

    it('should mark as no-show', async () => {
      // First confirm
      await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/confirm`)
        .set('Authorization', `Bearer ${ownerToken}`);

      // Then mark as no-show
      const response = await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/no-show`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reservation.status).toBe('no_show');
    });

    it('should fail to seat a pending reservation', async () => {
      await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/seat`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(400);
    });
  });

  describe('WebSocket Events', () => {
    beforeAll(done => {
      // Connect to WebSocket
      socketClient = io('http://localhost:4001', {
        transports: ['websocket'],
        reconnection: false,
      });

      socketClient.on('connect', () => {
        socketClient.emit('join:restaurant', restaurantId);
        done();
      });

      socketClient.on('connect_error', err => {
        console.error('Socket connection error:', err);
        done(err);
      });
    });

    it('should emit reservation:created event', done => {
      const tomorrow = addDays(new Date(), 5);
      const reservationDate = setMinutes(setHours(tomorrow, 19), 0).toISOString();

      socketClient.once('reservation:created', data => {
        expect(data).toHaveProperty('reservation');
        expect(data.reservation.customerName).toBe('WebSocket Test');
        done();
      });

      // Create reservation
      request(app.getHttpServer())
        .post(`/reservations/restaurants/${restaurantId}`)
        .send({
          reservationDate,
          partySize: 2,
          customerName: 'WebSocket Test',
          customerEmail: `ws-${Date.now()}@example.com`,
          customerPhone: '+8888888888',
          estimatedDuration: 90,
        })
        .then(() => {
          // Event should be emitted
        });
    }, 10000);

    it('should emit reservation:confirmed event', done => {
      const tomorrow = addDays(new Date(), 6);
      const reservationDate = setMinutes(setHours(tomorrow, 20), 0).toISOString();

      // First create reservation
      request(app.getHttpServer())
        .post(`/reservations/restaurants/${restaurantId}`)
        .send({
          reservationDate,
          partySize: 2,
          customerName: 'Confirm Test',
          customerEmail: `confirm-${Date.now()}@example.com`,
          customerPhone: '+7777777777',
          estimatedDuration: 90,
        })
        .then(res => {
          const newReservationId = res.body.data.reservation.id;

          socketClient.once('reservation:confirmed', data => {
            expect(data).toHaveProperty('reservation');
            expect(data.reservation.id).toBe(newReservationId);
            expect(data.reservation.status).toBe('confirmed');
            done();
          });

          // Confirm the reservation
          request(app.getHttpServer())
            .post(`/reservations/${newReservationId}/confirm`)
            .set('Authorization', `Bearer ${ownerToken}`)
            .then(() => {
              // Event should be emitted
            });
        });
    }, 10000);

    it('should emit reservation:cancelled event', done => {
      const tomorrow = addDays(new Date(), 7);
      const reservationDate = setMinutes(setHours(tomorrow, 18), 30).toISOString();

      // First create reservation
      request(app.getHttpServer())
        .post(`/reservations/restaurants/${restaurantId}`)
        .send({
          reservationDate,
          partySize: 2,
          customerName: 'Cancel Test',
          customerEmail: `cancel-${Date.now()}@example.com`,
          customerPhone: '+6666666666',
          estimatedDuration: 90,
        })
        .then(res => {
          const newReservationId = res.body.data.reservation.id;

          socketClient.once('reservation:cancelled', data => {
            expect(data).toHaveProperty('reservation');
            expect(data.reservation.id).toBe(newReservationId);
            expect(data.reservation.status).toBe('cancelled');
            done();
          });

          // Cancel the reservation
          request(app.getHttpServer())
            .post(`/reservations/${newReservationId}/cancel`)
            .set('Authorization', `Bearer ${ownerToken}`)
            .send({ reason: 'Test cancellation' })
            .then(() => {
              // Event should be emitted
            });
        });
    }, 10000);
  });

  describe('E2E Complete Flow', () => {
    it('should complete full reservation lifecycle', async () => {
      const tomorrow = addDays(new Date(), 8);
      const reservationDate = setMinutes(setHours(tomorrow, 19), 0).toISOString();

      // Step 1: Check availability
      const availabilityRes = await request(app.getHttpServer())
        .get(`/reservations/restaurants/${restaurantId}/availability`)
        .query({
          date: reservationDate,
          partySize: 2,
        })
        .expect(200);

      expect(availabilityRes.body.data.availableSlots.length).toBeGreaterThan(0);
      const availableSlot = availabilityRes.body.data.availableSlots.find(
        (s: any) => s.time === '19:00' && s.available
      );
      expect(availableSlot).toBeDefined();

      // Step 2: Create reservation
      const createRes = await request(app.getHttpServer())
        .post(`/reservations/restaurants/${restaurantId}`)
        .send({
          reservationDate,
          partySize: 2,
          customerName: 'E2E Customer',
          customerEmail: `e2e-${Date.now()}@example.com`,
          customerPhone: '+5555555555',
          specialRequests: 'Quiet corner please',
          estimatedDuration: 90,
        })
        .expect(201);

      const reservationId = createRes.body.data.reservation.id;
      const confirmationCode = createRes.body.data.reservation.confirmationCode;

      expect(createRes.body.data.reservation.status).toBe('pending');
      expect(confirmationCode).toBeDefined();

      // Step 3: Get reservation details
      const detailsRes = await request(app.getHttpServer())
        .get(`/reservations/${reservationId}`)
        .expect(200);

      expect(detailsRes.body.data.reservation.confirmationCode).toBe(confirmationCode);

      // Step 4: Confirm reservation
      const confirmRes = await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/confirm`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(confirmRes.body.data.reservation.status).toBe('confirmed');

      // Step 5: Seat customer
      const seatRes = await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/seat`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(seatRes.body.data.reservation.status).toBe('seated');

      // Step 6: Complete reservation
      const completeRes = await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/complete`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(completeRes.body.data.reservation.status).toBe('completed');

      // Step 7: List all reservations for the restaurant
      const listRes = await request(app.getHttpServer())
        .get('/reservations')
        .set('Authorization', `Bearer ${ownerToken}`)
        .query({
          restaurantId,
          date: reservationDate,
        })
        .expect(200);

      expect(listRes.body.data.reservations.length).toBeGreaterThan(0);
      const ourReservation = listRes.body.data.reservations.find(
        (r: any) => r.id === reservationId
      );
      expect(ourReservation).toBeDefined();
      expect(ourReservation.status).toBe('completed');
    });

    it('should handle cancellation flow', async () => {
      const tomorrow = addDays(new Date(), 9);
      const reservationDate = setMinutes(setHours(tomorrow, 20), 30).toISOString();

      // Create reservation
      const createRes = await request(app.getHttpServer())
        .post(`/reservations/restaurants/${restaurantId}`)
        .send({
          reservationDate,
          partySize: 3,
          customerName: 'Cancel Flow',
          customerEmail: `cancel-flow-${Date.now()}@example.com`,
          customerPhone: '+4444444444',
          estimatedDuration: 90,
        })
        .expect(201);

      const reservationId = createRes.body.data.reservation.id;

      // Confirm it
      await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/confirm`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);

      // Cancel it
      const cancelRes = await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/cancel`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          reason: 'Customer called to cancel',
        })
        .expect(200);

      expect(cancelRes.body.data.reservation.status).toBe('cancelled');
      expect(cancelRes.body.data.reservation.cancellationReason).toBe('Customer called to cancel');

      // Verify can't change state after cancellation
      await request(app.getHttpServer())
        .post(`/reservations/${reservationId}/seat`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(400);
    });
  });
});
