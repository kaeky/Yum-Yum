import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api';

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // CORS
  const corsOrigins = configService.get<string>('CORS_ORIGINS')?.split(',') || [
    'http://localhost:3000',
  ];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Exception Filters
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Swagger
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('YumYum API')
      .setDescription('Sistema integral de gestión de restaurantes')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Auth', 'Autenticación y autorización')
      .addTag('Users', 'Gestión de usuarios')
      .addTag('Restaurants', 'Gestión de restaurantes')
      .addTag('Reservations', 'Sistema de reservas')
      .addTag('Menu', 'Menú digital')
      .addTag('Orders', 'Órdenes y pedidos')
      .addTag('Tables', 'Gestión de mesas')
      .addTag('Customers', 'CRM de clientes')
      .addTag('Marketing', 'Campañas de marketing')
      .addTag('Analytics', 'Reportes y analytics')
      .addTag('Intelligence', 'Intelligence Engine (ML)')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
  }

  await app.listen(port);
  console.log(`\n🚀 YumYum API running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 API Docs: http://localhost:${port}/${apiPrefix}/docs\n`);
}

bootstrap();
