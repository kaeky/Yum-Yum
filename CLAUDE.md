# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YumYum is a comprehensive SaaS restaurant management system built as a monorepo using Turborepo. The system includes reservation management, digital menus, pre-ordering, table ordering, CRM, and marketing automation.

**Stack:**

- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand
- Backend: NestJS, TypeScript, PostgreSQL 15, Redis 7, TypeORM
- Infrastructure: Docker Compose, pnpm workspaces, Turborepo

## Essential Commands

### Development

```bash
# Start all services (requires Docker running)
pnpm dev

# Start specific app
pnpm dev:admin      # Admin panel (port 3000)
pnpm dev:booking    # Public booking site (port 3001)
pnpm dev:dashboard  # Restaurant dashboard (port 3002)
pnpm dev:api        # Backend API (port 4000)

# Start infrastructure
pnpm docker:up      # Start PostgreSQL + Redis
pnpm docker:down    # Stop services
pnpm docker:logs    # View logs
```

### Building & Testing

```bash
# Build all packages
pnpm build

# Build specific targets
pnpm build:fronts   # All frontend apps
pnpm build:api      # Backend only

# Linting & formatting
pnpm lint           # Lint all packages
pnpm format         # Format with Prettier

# Testing
pnpm test           # Run all tests
pnpm test:cov       # With coverage

# Backend-specific tests (run from back/api/)
cd back/api
pnpm test:e2e       # E2E tests
pnpm test:watch     # Watch mode
```

### Database Operations

```bash
cd back/api

# Run migrations
pnpm migration:run

# Create new migration
pnpm migration:create src/database/migrations/DescriptiveName

# Generate migration from entity changes
pnpm migration:generate src/database/migrations/DescriptiveName

# Revert last migration
pnpm migration:revert

# Seed database
pnpm seed
```

### Single Test Execution

```bash
# Frontend (from app directory, e.g., fronts/apps/admin/)
pnpm test ComponentName.test.tsx

# Backend (from back/api/)
pnpm test -- users.service.spec.ts         # Unit test
pnpm test:e2e -- auth.e2e-spec.ts          # E2E test
```

## Architecture

### Monorepo Structure

The repository follows a clear separation between frontend and backend:

```
fronts/               # Frontend monorepo
├── apps/
│   ├── admin/        # Super-admin panel (admin.yumyum.com)
│   ├── booking/      # Public booking site ({slug}.yumyum.com)
│   └── dashboard/    # Restaurant dashboard (dashboard.yumyum.com)
└── packages/
    ├── ui/           # Shared React components (shadcn/ui)
    ├── types/        # Shared TypeScript types
    ├── utils/        # Pure utility functions
    └── config/       # Shared configs (ESLint, Tailwind)

back/
└── api/              # NestJS backend
    ├── src/
    │   ├── auth/              # Authentication module
    │   ├── users/             # User management
    │   ├── restaurants/       # Restaurant management
    │   ├── reservations/      # Reservation system
    │   ├── common/            # Shared code (guards, filters, decorators)
    │   ├── config/            # Configuration (DB, Redis, etc.)
    │   ├── database/          # Migrations and seeds
    │   └── gateways/          # WebSocket gateways
    └── test/                  # E2E tests
```

### Monorepo Rules

**Allowed:**

- Share types between frontend and backend via `@yumyum/types`
- Share UI components between frontend apps via `@yumyum/ui`
- Share pure utility functions via `@yumyum/utils`
- Import from `/packages` to `/apps`

**Prohibited:**

- Do NOT share business logic between frontend apps
- Do NOT import from `/apps` to `/packages`
- Do NOT create circular dependencies between apps
- Do NOT duplicate types (use shared package)

### Next.js Architecture Pattern

Each frontend app uses Next.js 14 App Router with this structure:

```
src/
├── app/              # App Router pages
│   ├── (auth)/       # Route group - authentication pages
│   ├── (dashboard)/  # Route group - authenticated pages
│   ├── api/          # API routes (for webhooks, etc.)
│   ├── layout.tsx
│   └── page.tsx
├── components/       # React components
│   ├── ui/           # Local UI components
│   └── features/     # Feature-specific components
├── lib/              # Utilities and API client
├── services/         # Centralized data fetching (Server Components)
├── hooks/            # Custom React hooks
└── store/            # Client state (Zustand) - use sparingly
```

**Key Patterns:**

- Server Components by default for data fetching
- Client Components only when needed (useState, event handlers, browser APIs)
- Data fetching centralized in `/services` directory
- URL as source of truth for state (searchParams, route params)
- Avoid client-side data fetching if server-side is possible

### Backend Architecture Pattern

NestJS backend follows layered architecture:

```
Controller → Service → Repository → Database
```

Each module contains:

```
module-name/
├── module-name.controller.ts  # HTTP endpoints, validation
├── module-name.service.ts     # Business logic
├── module-name.module.ts      # Dependency injection
├── dto/                       # Data Transfer Objects
├── entities/                  # TypeORM entities
└── guards/                    # Authorization logic
```

**Key Patterns:**

- One module = one responsibility
- Controllers only handle HTTP concerns
- Services contain all business logic
- Use dependency injection for all dependencies
- Always validate with DTOs using class-validator
- Multi-tenant isolation enforced at service layer

### Database Design

**TypeORM with PostgreSQL:**

- All changes via migrations (NEVER sync in production)
- Indexes on frequently queried fields (restaurantId, date, status)
- Soft deletes for important entities
- Transactions for multi-step operations
- Connection pooling configured in typeorm.config.ts

**Key Entities:**

- User (super_admin, owner, staff, customer roles)
- Restaurant (multi-tenant root entity)
- Reservation (with status tracking, pre-orders)
- Table (availability, capacity)
- MenuItem (menu categories, allergens)
- Order (from reservations or walk-ins)

### Real-Time Communication

**WebSockets (Socket.IO):**

- Reservation updates broadcast to restaurant dashboard
- Table availability changes
- Order status updates
- Room-based isolation per restaurant

**Queues (BullMQ with Redis):**

- Email/WhatsApp notifications
- Report generation
- Data exports
- Asynchronous processing

## Critical Patterns

### Authentication Flow

Backend uses JWT with refresh tokens:

- Access tokens: 15-minute expiration
- Refresh tokens: 7-day expiration
- Passwords hashed with bcrypt (salt rounds: 10)
- Guards: `JwtAuthGuard` for all protected routes
- Roles checked with `@Roles()` decorator and `RolesGuard`

Frontend stores tokens in httpOnly cookies (configured in API).

### Multi-Tenancy

All restaurant-specific data filtered by `restaurantId`:

```typescript
// Service layer automatically filters
findAll(@CurrentUser() user: User) {
  return this.repository.find({
    where: { restaurantId: user.restaurantId }
  });
}
```

### Error Handling

**Backend:**

- Custom exceptions extend NestJS exception classes
- Global exception filter formats all errors consistently
- Validation errors from class-validator DTOs

**Frontend:**

- Error boundaries for React component errors
- API errors handled in service layer
- User-friendly error messages, technical details logged

### Data Fetching Strategy

**Frontend (Next.js):**

1. Use Server Components and `fetch()` with revalidation
2. Centralize fetching in `/services` directory
3. Avoid useEffect + fetch patterns
4. Cache with `next: { revalidate: seconds }`

**Example:**

```typescript
// services/restaurants.ts
export async function getRestaurant(id: string) {
  return fetch(`${API_URL}/restaurants/${id}`, {
    next: { revalidate: 60 } // Cache 1 minute
  }).then(r => r.json());
}

// app/restaurants/[id]/page.tsx
export default async function RestaurantPage({ params }) {
  const restaurant = await getRestaurant(params.id);
  return <RestaurantDetail data={restaurant} />;
}
```

### Performance Considerations

**Frontend:**

- Dynamic imports for heavy components
- Image optimization with next/image
- Font optimization with next/font
- Route prefetching enabled by default

**Backend:**

- Redis caching for frequently accessed data
- Pagination required for all list endpoints (max 100 items)
- Lazy loading for TypeORM relations
- Connection pooling for database
- Background jobs for heavy processing

## Development Workflow

### Environment Setup

1. Copy environment files:

```bash
cp fronts/apps/admin/.env.example fronts/apps/admin/.env.local
cp fronts/apps/booking/.env.example fronts/apps/booking/.env.local
cp fronts/apps/dashboard/.env.example fronts/apps/dashboard/.env.local
cp back/api/.env.example back/api/.env
```

2. Start infrastructure: `pnpm docker:up`
3. Run migrations: `cd back/api && pnpm migration:run`
4. Start dev servers: `pnpm dev`

### Code Standards

**Commits:**

- Follow Conventional Commits (feat:, fix:, docs:, etc.)
- Keep commits focused and atomic
- Use descriptive messages

**TypeScript:**

- Strict mode enabled
- No `any` types (use `unknown` with type guards)
- Explicit return types on functions
- Interface for data shapes, type for unions/intersections

**Validation:**

- Backend: class-validator on all DTOs
- Frontend: Zod schemas for forms
- Never trust client input

### Testing Requirements

**Backend:**

- Unit tests for services (mock repositories)
- E2E tests for critical flows (auth, reservations, orders)
- Test coverage expected for new features

**Frontend:**

- Component tests with Testing Library
- Focus on user interactions, not implementation
- Test accessibility

## Important Conventions

### Imports Ordering

```typescript
// 1. React/Next imports
import { useState } from 'react';
import Image from 'next/image';

// 2. External libraries
import { z } from 'zod';

// 3. Internal absolute imports
import { Button } from '@yumyum/ui';
import { User } from '@yumyum/types';

// 4. Relative imports
import { UserService } from './user.service';
```

### Component Patterns

**Presentational vs Container:**

- Presentational: Pure, receive props, no state/logic
- Container: Handle state, side effects, pass data down

**Server vs Client Components:**

- Default to Server Components
- Use `'use client'` only when needed
- Props between server and client must be serializable

### API Response Format

```typescript
// Success
{
  data: T,
  message?: string
}

// Error
{
  statusCode: number,
  message: string,
  error?: string
}

// Paginated
{
  data: T[],
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}
```

## Common Gotchas

1. **pnpm workspace:** Always run `pnpm install` from root, not individual packages
2. **Turbo caching:** Clear cache with `rm -rf .turbo` if builds are stale
3. **TypeORM migrations:** Always use CLI commands, never hand-edit migration files
4. **Port conflicts:** Check docker-compose.yml for port mappings (5432, 6379, 4000)
5. **Next.js caching:** During dev, aggressive caching can cause stale data - refresh route when needed
6. **Multi-tenant isolation:** Always include restaurantId filters in queries
7. **Windows paths:** Use forward slashes in code even on Windows (Node.js handles it)

## References

- Project documentation: `/docs` directory
- Architecture decisions: `/docs/ARCHITECTURE.md`
- Coding standards: `/docs/CODING_STANDARDS.md`
- API documentation: http://localhost:4000/api/docs (Swagger)
- Full project plan: `/docs/PLAN_YUMYUM.md`
