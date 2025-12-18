# E2E Tests

Tests de extremo a extremo (end-to-end) para la API de YumYum.

## Ejecutar Tests

```bash
# Ejecutar todos los tests E2E
pnpm test:e2e

# Ejecutar un archivo específico
pnpm test:e2e -- auth.e2e-spec.ts

# Ejecutar tests en modo watch
pnpm test:e2e -- --watch

# Ejecutar tests con cobertura
pnpm test:e2e -- --coverage
```

## Estructura de Tests

Los tests están organizados por módulo:

- `auth.e2e-spec.ts` - Tests de autenticación (registro, login, logout)
- `restaurants.e2e-spec.ts` - Tests de restaurantes y mesas
- `app.e2e-spec.ts` - Tests generales de la aplicación

## Requisitos Previos

Antes de ejecutar los tests:

1. **Base de datos de prueba**: Asegúrate de tener una base de datos PostgreSQL para tests

   ```bash
   createdb yumyum_test
   ```

2. **Variables de entorno**: Crea un archivo `.env.test` con:

   ```env
   DB_DATABASE=yumyum_test
   NODE_ENV=test
   ```

3. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

## Escribir Nuevos Tests

### Estructura básica

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ModuleController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/endpoint (METHOD)', () => {
    it('should do something', () => {
      return request(app.getHttpServer())
        .get('/api/endpoint')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('success', true);
        });
    });
  });
});
```

### Tests con autenticación

```typescript
let accessToken: string;

beforeAll(async () => {
  // ... setup app

  // Login to get token
  const loginRes = await request(app.getHttpServer()).post('/api/auth/login').send({
    email: 'test@example.com',
    password: 'Test123!',
  });

  accessToken = loginRes.body.data.tokens.accessToken;
});

it('should access protected route', () => {
  return request(app.getHttpServer())
    .get('/api/protected-route')
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);
});
```

### Tests de validación

```typescript
it('should validate required fields', () => {
  return request(app.getHttpServer())
    .post('/api/endpoint')
    .send({
      // Missing required fields
    })
    .expect(400)
    .expect(res => {
      expect(res.body.message).toContain('validation');
    });
});
```

### Tests de autorización

```typescript
it('should deny access without proper role', () => {
  return request(app.getHttpServer())
    .post('/api/admin-only-endpoint')
    .set('Authorization', `Bearer ${customerToken}`)
    .expect(403);
});
```

## Buenas Prácticas

1. **Limpieza entre tests**: Usa `beforeEach` y `afterEach` para limpiar datos

   ```typescript
   afterEach(async () => {
     // Clean up test data
     await repository.clear();
   });
   ```

2. **Tests independientes**: Cada test debe poder ejecutarse independientemente

3. **Nombres descriptivos**: Usa nombres claros para los tests

   ```typescript
   it('should return 409 when email already exists', () => {
     // ...
   });
   ```

4. **Arrange-Act-Assert**: Estructura tus tests claramente

   ```typescript
   it('should create user', async () => {
     // Arrange
     const userData = { email: 'test@example.com', password: 'Test123!' };

     // Act
     const res = await request(app.getHttpServer()).post('/api/users').send(userData);

     // Assert
     expect(res.status).toBe(201);
     expect(res.body.data.user.email).toBe(userData.email);
   });
   ```

5. **Evita hardcoded IDs**: Usa IDs creados dinámicamente

   ```typescript
   // ❌ Malo
   const userId = '123';

   // ✅ Bueno
   const createRes = await request(app.getHttpServer()).post('/api/users').send(userData);
   const userId = createRes.body.data.user.id;
   ```

## Coverage

Para generar un reporte de cobertura:

```bash
pnpm test:e2e -- --coverage
```

El reporte se generará en `coverage/`.

## CI/CD

Los tests E2E se ejecutan automáticamente en CI/CD antes de cada deployment.

## Debugging

Para debuggear tests:

```bash
# Modo debug de Node.js
node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand test/auth.e2e-spec.ts

# O usa el debugger de tu IDE (VS Code, WebStorm, etc.)
```

## Referencias

- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
