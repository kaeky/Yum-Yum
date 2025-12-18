import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same pipes as main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/ (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('service', 'YumYum API');
        });
    });
  });

  describe('/version (GET)', () => {
    it('should return API version', () => {
      return request(app.getHttpServer())
        .get('/api/version')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('version');
          expect(res.body).toHaveProperty('name', 'YumYum API');
        });
    });
  });
});
