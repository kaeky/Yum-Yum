# 📚 YumYum - Estándares de Programación

Este documento establece las reglas y mejores prácticas para el desarrollo de YumYum. **Lectura obligatoria** para todos los desarrolladores del equipo.

---

## 📁 MONOREPO - ESTRUCTURA Y REGLAS

### Estructura Ideal

```
yumyum/
├── fronts/
│   ├── apps/
│   │   ├── admin/       → Next.js Admin Panel
│   │   ├── booking/     → Next.js Public Booking
│   │   └── dashboard/   → Next.js Restaurant Dashboard
│   └── packages/
│       ├── ui/          → Componentes compartidos
│       ├── config/      → ESLint, TS, Tailwind
│       ├── utils/       → helpers puros
│       └── types/       → DTOs / contratos
├── back/
│   └── api/             → NestJS API
└── docs/                → Documentación
```

### ✅ Reglas del Monorepo

#### ✅ PERMITIDO:

- Compartir **tipos** entre frontends y backend
- Compartir **componentes UI** entre frontends
- Compartir **helpers puros** (formatters, validators)
- Importar de `/packages` a `/apps`

#### ❌ PROHIBIDO:

- **NO compartir lógica de negocio** entre frontends
- **NO importar código de `/apps` a `/packages`**
- **NO crear dependencias circulares** entre apps
- **NO duplicar tipos** (usar `@yumyum/types`)

### Ejemplo Correcto:

```typescript
// ✅ CORRECTO
// fronts/apps/admin/src/components/UserList.tsx
import { Button } from '@yumyum/ui';
import { User } from '@yumyum/types';
import { formatDate } from '@yumyum/utils';

// ❌ INCORRECTO
// fronts/apps/admin/src/components/UserList.tsx
import { getUsers } from '../../booking/services/users'; // NO!
```

---

## ⚛️ NEXT.JS - APP ROUTER

### Arquitectura Recomendada

```
fronts/apps/[app-name]/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Route group - Auth pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/         # Route group - Dashboard
│   │   │   ├── reservations/
│   │   │   ├── menu/
│   │   │   └── settings/
│   │   ├── api/                 # API Routes
│   │   │   └── webhook/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Componentes base (local)
│   │   └── features/            # Componentes por feature
│   ├── lib/                     # Utilidades
│   │   ├── api.ts               # Cliente API
│   │   ├── auth.ts              # Auth helpers
│   │   └── utils.ts
│   ├── services/                # Data fetching centralizado
│   │   ├── users.ts
│   │   └── restaurants.ts
│   ├── hooks/                   # Custom hooks
│   │   └── useAuth.ts
│   └── store/                   # Zustand stores (solo si necesario)
│       └── authStore.ts
```

### ✅ Buenas Prácticas

#### 1. Server Components por Defecto

```typescript
// ✅ CORRECTO - Server Component
// app/reservations/page.tsx
import { getReservations } from '@/services/reservations';

export default async function ReservationsPage() {
  const reservations = await getReservations();

  return <ReservationList data={reservations} />;
}
```

#### 2. Client Components Solo Cuando Sea Necesario

```typescript
// ✅ Client Component solo cuando necesites:
// - useState
// - useEffect
// - event handlers
// - browser APIs

'use client';

import { useState } from 'react';

export function ReservationForm() {
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    // ...
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### 3. ❌ No Hacer Fetch en Client Si Puede Ser Server

```typescript
// ❌ INCORRECTO
'use client';

import { useEffect, useState } from 'react';

export function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);

  return <div>{users.map(...)}</div>;
}

// ✅ CORRECTO
// Server Component
import { getUsers } from '@/services/users';

export default async function UserList() {
  const users = await getUsers();

  return <div>{users.map(...)}</div>;
}
```

---

## 🌐 DATA FETCHING

### ✅ Reglas

#### 1. Usar `fetch()` Nativo

```typescript
// services/users.ts
export async function getUsers() {
  const res = await fetch('http://localhost:4000/api/users', {
    cache: 'no-store', // no cache
    // o
    next: { revalidate: 3600 }, // cache por 1 hora
  });

  if (!res.ok) throw new Error('Failed to fetch users');

  return res.json();
}
```

#### 2. Centralizar Fetch en `/services`

```typescript
// ✅ CORRECTO - Centralizado
// services/restaurants.ts
export async function getRestaurant(id: string) {
  return fetch(`${API_URL}/restaurants/${id}`, {
    next: { revalidate: 60 }
  }).then(r => r.json());
}

// app/restaurants/[id]/page.tsx
import { getRestaurant } from '@/services/restaurants';

export default async function RestaurantPage({ params }) {
  const restaurant = await getRestaurant(params.id);
  return <RestaurantDetail data={restaurant} />;
}
```

#### ❌ Evitar

```typescript
// ❌ NO: Fetch directo en componentes
export default async function Page() {
  const data = await fetch('http://...'); // NO!
  // ...
}

// ❌ NO: Axios en Server Components
import axios from 'axios'; // NO en Server Components!
```

---

## 🔄 ESTADO (STATE MANAGEMENT)

### ✅ Prioridades

1. **URL como fuente de verdad** (search params, route params)
2. **Server State > Client State**
3. **React Query solo cuando sea estrictamente necesario**

### Ejemplos:

```typescript
// ✅ CORRECTO - URL como estado
// app/reservations/page.tsx
export default function ReservationsPage({ searchParams }) {
  const status = searchParams.status || 'all';
  const date = searchParams.date || new Date();

  return <ReservationList status={status} date={date} />;
}

// ✅ CORRECTO - Server State
export default async function RestaurantsPage() {
  const restaurants = await getRestaurants(); // Server
  return <RestaurantList data={restaurants} />;
}
```

### ❌ Evitar

```typescript
// ❌ NO: Redux global sin razón
// ❌ NO: Estados duplicados (URL + useState)
// ❌ NO: Client state para data que viene del server
```

---

## 🎨 UI & DISEÑO

### Separación de Responsabilidades

#### 1. Componentes Presentacionales

```typescript
// ✅ CORRECTO - Componente presentacional puro
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant, children, onClick }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant }))}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

#### 2. Componentes Contenedores

```typescript
// ✅ CORRECTO - Componente contenedor con lógica
export function ReservationForm() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async () => {
    // lógica de negocio
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input value={date} onChange={setDate} />
      <Input value={time} onChange={setTime} />
      <Button type="submit">Reservar</Button>
    </form>
  );
}
```

### ✅ UI Desacoplada del Negocio

```typescript
// ✅ CORRECTO
<Button variant="primary" size="lg">Guardar</Button>

// ❌ INCORRECTO
<SaveButton restaurantId={123} onSuccess={...} /> // Muy acoplado
```

---

## 🔒 SEGURIDAD EN NEXT.JS

### ✅ Reglas Obligatorias

#### 1. Nunca Exponer Secrets

```typescript
// ❌ INCORRECTO
const API_KEY = 'sk_live_xxxxx'; // NO!

// ✅ CORRECTO
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
API_SECRET_KEY=sk_live_xxxxx  // Solo backend

// next.config.js
env: {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  // NO expongas API_SECRET_KEY
}
```

#### 2. Validar Inputs (Zod)

```typescript
import { z } from 'zod';

const reservationSchema = z.object({
  date: z.string().datetime(),
  partySize: z.number().min(1).max(20),
  email: z.string().email(),
});

export async function createReservation(data: unknown) {
  const validated = reservationSchema.parse(data);
  // usar validated
}
```

#### 3. Proteger Routes con Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: '/dashboard/:path*',
};
```

#### 4. Rate Limit en API Routes

```typescript
// app/api/reservations/route.ts
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minuto
  uniqueTokenPerInterval: 500,
});

export async function POST(req: Request) {
  try {
    await limiter.check(req, 10); // 10 requests por minuto
    // ...
  } catch {
    return new Response('Rate limit exceeded', { status: 429 });
  }
}
```

---

## ⚡ PERFORMANCE

### ✅ Optimizaciones Obligatorias

#### 1. Dynamic Imports

```typescript
// ✅ CORRECTO
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false, // si no se necesita SSR
});
```

#### 2. Image Optimization

```typescript
import Image from 'next/image';

// ✅ CORRECTO
<Image
  src="/hero.jpg"
  alt="Restaurant"
  width={800}
  height={600}
  priority // si es above the fold
/>
```

#### 3. Font Optimization

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.className}>
      {children}
    </html>
  );
}
```

#### 4. Bundle Analyzer

```bash
# package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

---

## 🏗️ NESTJS - BUENAS PRÁCTICAS

### Arquitectura Base

```
back/api/src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   ├── users/
│   ├── restaurants/
│   └── ...
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── typeorm.config.ts
└── main.ts
```

### ✅ Reglas Obligatorias

#### 1. Un Módulo = Una Responsabilidad

```typescript
// ✅ CORRECTO
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

// ❌ INCORRECTO
@Module({
  imports: [UsersModule, RestaurantsModule, ReservationsModule], // Demasiado!
  // ...
})
```

#### 2. Nada de Imports Circulares

```typescript
// ❌ INCORRECTO
// users.module.ts imports restaurants.module.ts
// restaurants.module.ts imports users.module.ts

// ✅ CORRECTO - Usar forwardRef si es inevitable
@Module({
  imports: [forwardRef(() => RestaurantsModule)],
})
```

#### 3. Common Solo Para Código Realmente Compartido

```typescript
// ✅ common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
```

---

## 🏛️ CAPAS CORRECTAS

### Controller → Service → Repository

```typescript
// ✅ CORRECTO

// users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll(); // Solo delega
  }
}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async findAll() {
    return this.usersRepository.find({
      where: { status: 'active' }, // Lógica de negocio aquí
    });
  }
}
```

### ❌ Prohibido

```typescript
// ❌ NO: Controller con lógica
@Get()
async findAll() {
  const users = await this.usersRepository.find(); // NO!
  return users.filter(u => u.active); // NO!
}

// ❌ NO: Repository con lógica de negocio
// ❌ NO: Service accediendo a req/res directamente
```

---

## 📋 DTOs Y VALIDACIÓN

### ✅ Siempre Usar class-validator

```typescript
// dto/create-reservation.dto.ts
import { IsString, IsEmail, IsInt, Min, Max, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: '2024-12-25T19:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 20 })
  @IsInt()
  @Min(1)
  @Max(20)
  partySize: number;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  specialRequests?: string;
}

// controller
@Post()
async create(@Body() createReservationDto: CreateReservationDto) {
  return this.reservationsService.create(createReservationDto);
}
```

### ❌ Evitar

```typescript
// ❌ NO: Validar manualmente
// ❌ NO: Usar any
// ❌ NO: Recibir Request body sin DTO
```

---

## 🗄️ BASE DE DATOS

### ✅ TypeORM / Prisma Bien Tipado

```typescript
// entities/reservation.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { User } from './user.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'int' })
  partySize: number;

  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'cancelled'] })
  status: string;

  @ManyToOne(() => Restaurant, restaurant => restaurant.reservations)
  restaurant: Restaurant;

  @ManyToOne(() => User, user => user.reservations)
  customer: User;

  @CreateDateColumn()
  createdAt: Date;
}
```

### ✅ Transacciones Explícitas

```typescript
async createReservationWithDeposit(data: CreateReservationDto) {
  return this.dataSource.transaction(async (manager) => {
    const reservation = await manager.save(Reservation, data);
    const payment = await manager.save(Payment, {
      reservationId: reservation.id,
      amount: data.depositAmount,
    });
    return { reservation, payment };
  });
}
```

### ✅ Índices en Campos de Búsqueda

```typescript
@Entity('reservations')
@Index(['restaurantId', 'date'])
@Index(['customerId'])
export class Reservation {
  // ...
}
```

### ❌ Evitar

```typescript
// ❌ NO: Queries en controller
// ❌ NO: .save() sin saber qué actualiza
// ❌ NO: N+1 queries (usar eager loading)
```

---

## ⚠️ ERRORES & EXCEPCIONES

### ✅ Custom Exceptions

```typescript
// common/exceptions/user-not-found.exception.ts
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`);
  }
}

// service
async findOne(id: string) {
  const user = await this.usersRepository.findOne({ where: { id } });
  if (!user) {
    throw new UserNotFoundException(id);
  }
  return user;
}
```

### ✅ HttpExceptionFilter Global

```typescript
// common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}

// main.ts
app.useGlobalFilters(new HttpExceptionFilter());
```

---

## ⚙️ CONFIGURACIÓN

### ✅ Usar @nestjs/config

```typescript
// config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}));

// app.module.ts
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
  ],
})
```

### ❌ Nunca Usar process.env Directo

```typescript
// ❌ INCORRECTO
const dbHost = process.env.DB_HOST; // NO!

// ✅ CORRECTO
constructor(private configService: ConfigService) {
  const dbHost = this.configService.get<string>('database.host');
}
```

---

## 🔒 SEGURIDAD

### ✅ JWT con Refresh Tokens

```typescript
// auth/auth.service.ts
async login(user: User) {
  const payload = { sub: user.id, email: user.email };

  return {
    accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
    refreshToken: this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'
    }),
  };
}
```

### ✅ Hash con Bcrypt

```typescript
import * as bcrypt from 'bcrypt';

async hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### ✅ Rate Limit

```typescript
// main.ts
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
```

### ✅ CORS Explícito

```typescript
// main.ts
app.enableCors({
  origin: ['http://localhost:3000', 'https://yumyum.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});
```

### ✅ Helmet

```typescript
import helmet from 'helmet';

app.use(helmet());
```

---

## 📊 LOGGING

### ✅ Logs Estructurados

```typescript
// common/logger/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }
}
```

---

## 🚀 PERFORMANCE

### ✅ Cache (Redis)

```typescript
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RestaurantsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async findOne(id: string) {
    const cacheKey = `restaurant:${id}`;
    let restaurant = await this.cacheManager.get<Restaurant>(cacheKey);

    if (!restaurant) {
      restaurant = await this.restaurantsRepository.findOne({ where: { id } });
      await this.cacheManager.set(cacheKey, restaurant, 3600); // 1 hora
    }

    return restaurant;
  }
}
```

### ✅ Pagination Siempre

```typescript
// dto/pagination.dto.ts
export class PaginationDto {
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 20;
}

// service
async findAll(paginationDto: PaginationDto) {
  const { page, pageSize } = paginationDto;
  const skip = (page - 1) * pageSize;

  const [data, total] = await this.usersRepository.findAndCount({
    skip,
    take: pageSize,
  });

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
```

### ❌ Nunca Devolver Listas Completas

```typescript
// ❌ INCORRECTO
@Get()
findAll() {
  return this.usersRepository.find(); // Puede ser 100,000 registros!
}

// ✅ CORRECTO
@Get()
findAll(@Query() paginationDto: PaginationDto) {
  return this.usersService.findAll(paginationDto);
}
```

---

## 🧠 CLEAN CODE

### ✅ Funciones Pequeñas

```typescript
// ✅ CORRECTO
async createReservation(data: CreateReservationDto) {
  this.validateAvailability(data);
  const reservation = await this.saveReservation(data);
  await this.sendConfirmation(reservation);
  return reservation;
}

// ❌ INCORRECTO - Función de 200 líneas
async createReservation(data: CreateReservationDto) {
  // 200 líneas de código...
}
```

### ✅ Nombres Claros

```typescript
// ✅ CORRECTO
const isReservationAvailable = await this.checkAvailability(date, restaurantId);

// ❌ INCORRECTO
const x = await this.check(d, r);
```

### ✅ Una Responsabilidad por Función

```typescript
// ✅ CORRECTO
function calculateTotal(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateTax(total: number) {
  return total * 0.19;
}

// ❌ INCORRECTO
function processOrder(items: OrderItem[]) {
  // calcula total
  // calcula impuestos
  // procesa pago
  // envía email
  // actualiza inventario
  // ... demasiado!
}
```

---

## 🎯 SOLID

### S - Single Responsibility

```typescript
// ✅ CORRECTO
class UserService {
  createUser() {}
  updateUser() {}
  deleteUser() {}
}

class EmailService {
  sendWelcomeEmail() {}
}

// ❌ INCORRECTO
class UserService {
  createUser() {}
  sendEmail() {} // NO es responsabilidad de UserService
}
```

### O - Open/Closed

```typescript
// ✅ CORRECTO - Abierto a extensión
interface PaymentStrategy {
  processPayment(amount: number): Promise<void>;
}

class WompiPayment implements PaymentStrategy {
  async processPayment(amount: number) {}
}

class StripePayment implements PaymentStrategy {
  async processPayment(amount: number) {}
}
```

### D - Dependency Inversion

```typescript
// ✅ CORRECTO - Depender de abstracciones
class ReservationsService {
  constructor(
    private readonly notificationService: INotificationService // Interface
  ) {}
}

// ❌ INCORRECTO - Depender de implementaciones concretas
class ReservationsService {
  constructor(
    private readonly whatsappService: WhatsAppService // Implementación concreta
  ) {}
}
```

---

## 🧪 TESTING

### Backend - Unit Tests

```typescript
// users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a user', async () => {
    const createUserDto = { email: 'test@test.com', name: 'Test' };
    jest.spyOn(repository, 'save').mockResolvedValue(createUserDto as User);

    const result = await service.create(createUserDto);

    expect(result).toEqual(createUserDto);
    expect(repository.save).toHaveBeenCalledWith(createUserDto);
  });
});
```

### Frontend - Component Tests

```typescript
// ReservationForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ReservationForm } from './ReservationForm';

describe('ReservationForm', () => {
  it('should submit form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<ReservationForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2024-12-25' },
    });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        date: '2024-12-25',
      });
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
// e2e/reservations.spec.ts
import { test, expect } from '@playwright/test';

test('should create a reservation', async ({ page }) => {
  await page.goto('http://localhost:3001/reservations/new');

  await page.fill('[name="date"]', '2024-12-25');
  await page.fill('[name="partySize"]', '4');
  await page.click('button[type="submit"]');

  await expect(page.locator('.success-message')).toBeVisible();
});
```

---

## 📝 GIT

### Commits Pequeños

```bash
# ✅ CORRECTO
git commit -m "feat: add reservation validation"
git commit -m "fix: resolve date formatting issue"

# ❌ INCORRECTO
git commit -m "changes" # Demasiado genérico
git commit -m "fixed everything from yesterday plus added new features and refactored some stuff" # Demasiado
```

### Conventional Commits

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo, punto y coma faltante, etc.
refactor: refactorización de código
test: añadir tests
chore: actualizar dependencias, etc.

Ejemplos:
feat(auth): add JWT refresh token support
fix(reservations): resolve timezone issue
docs(readme): update installation instructions
```

### Code Review Obligatorio

- Mínimo 1 aprobación antes de merge
- Verificar que pasen los tests
- Verificar que pase el linter
- Sin comentarios sin resolver

---

## 🚀 CI/CD

### Pipeline Mínimo

```yaml
# .github/workflows/backend.yml
name: Backend CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

---

## 📊 OBSERVABILIDAD

### Health Checks

```typescript
// app.controller.ts
@Get('health')
async health() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };
}
```

### Logs Estructurados

```typescript
logger.log('Reservation created', {
  reservationId: reservation.id,
  restaurantId: restaurant.id,
  userId: user.id,
  timestamp: new Date().toISOString(),
});
```

---

## 📖 DOCUMENTACIÓN

### ✅ Obligatorio

1. **Swagger** - Backend API debe tener Swagger completo
2. **README** - Cada app/package debe tener README
3. **Diagramas** - Arquitectura documentada (Mermaid)
4. **Decisiones Técnicas** - ADRs (Architecture Decision Records)

### Ejemplo Swagger

```typescript
@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({ status: 201, description: 'Reservation created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }
}
```

---

## ✅ CHECKLIST ANTES DE HACER PR

- [ ] Código sigue los estándares de este documento
- [ ] Tests escritos y pasando
- [ ] Linter pasando
- [ ] Build exitoso
- [ ] Documentación actualizada (si aplica)
- [ ] Sin console.log() olvidados
- [ ] Sin TODOs sin crear issues
- [ ] Variables de entorno documentadas
- [ ] Migraciones de DB incluidas (si aplica)

---

## 📞 CONTACTO

Si tienes dudas sobre estos estándares, pregunta en el canal de Slack del equipo antes de hacer suposiciones.

**Este documento es obligatorio. Todas las PRs serán revisadas contra estos estándares.**
