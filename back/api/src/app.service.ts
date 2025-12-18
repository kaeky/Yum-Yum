import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'YumYum API',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  getVersion() {
    return {
      version: '1.0.0',
      name: 'YumYum API',
      description: 'Sistema integral de gestión de restaurantes',
    };
  }
}
