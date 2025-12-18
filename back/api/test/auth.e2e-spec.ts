import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(201)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.user).toHaveProperty('id');
          expect(res.body.data.user.email).toBe('test@example.com');
          expect(res.body.data.tokens).toHaveProperty('accessToken');
          expect(res.body.data.tokens).toHaveProperty('refreshToken');
          accessToken = res.body.data.tokens.accessToken;
        });
    });

    it('should fail with duplicate email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(409);
    });

    it('should fail with weak password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'weak',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(400);
    });

    it('should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test123!',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(400);
    });
  });

  describe('/api/auth/login (POST)', () => {
    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
        })
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.user.email).toBe('test@example.com');
          expect(res.body.data.tokens).toHaveProperty('accessToken');
          expect(res.body.data.tokens).toHaveProperty('refreshToken');
        });
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);
    });

    it('should fail with non-existent user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!',
        })
        .expect(401);
    });
  });

  describe('/api/auth/me (GET)', () => {
    it('should get current user profile', () => {
      return request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.user.email).toBe('test@example.com');
        });
    });

    it('should fail without token', () => {
      return request(app.getHttpServer()).get('/api/auth/me').expect(401);
    });

    it('should fail with invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('/api/auth/logout (POST)', () => {
    it('should logout successfully', () => {
      return request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Successfully logged out');
        });
    });
  });
});
