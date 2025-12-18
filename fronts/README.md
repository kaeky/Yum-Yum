# 🎨 YumYum - Frontend Monorepo

Monorepo de todos los frontends de YumYum usando Turborepo + Next.js 14.

**IMPORTANTE:** Antes de escribir código, lee [CODING_STANDARDS.md](../docs/CODING_STANDARDS.md)

## 📦 Aplicaciones

### 1. Admin (`apps/admin`)

**URL:** admin.yumyum.com
**Puerto dev:** 3000
**Propósito:** Panel de super-administración de YumYum

**Features:**

- Gestión de restaurantes
- Gestión de usuarios
- Métricas globales
- Configuración de planes
- Facturación
- Soporte

### 2. Booking (`apps/booking`)

**URL:** {restaurante-slug}.yumyum.com o yumyum.com/r/{slug}
**Puerto dev:** 3001
**Propósito:** Página pública donde clientes hacen reservas

**Features:**

- Ver menú digital
- Hacer reservas
- Pre-ordenar entradas/bebidas
- Pagar anticipo
- Ordenar desde mesa (QR)
- Ver reseñas
- Personalización de marca por restaurante

### 3. Dashboard (`apps/dashboard`)

**URL:** dashboard.yumyum.com
**Puerto dev:** 3002
**Propósito:** Dashboard del restaurante para gestionar operaciones

**Features:**

- Ver reservas en tiempo real
- Gestionar mesas
- Ver órdenes desde mesa
- CRM de clientes
- Campañas de marketing
- Reportes y analytics
- Configuración del restaurante

## 📦 Packages Compartidos

### `@yumyum/ui`

Componentes React compartidos (basados en shadcn/ui)

### `@yumyum/types`

TypeScript types, interfaces, enums compartidos

### `@yumyum/utils`

Utilidades compartidas (formatters, validators, helpers)

### `@yumyum/config`

Configuraciones compartidas (ESLint, Tailwind, TypeScript)

## 🚀 Desarrollo

### Iniciar todas las apps

```bash
cd fronts
pnpm dev
```

### Iniciar una app específica

```bash
# Admin
cd apps/admin
pnpm dev

# Booking
cd apps/booking
pnpm dev

# Dashboard
cd apps/dashboard
pnpm dev
```

### Build

```bash
# Todas las apps
pnpm build

# Una app específica
pnpm build --filter=@yumyum/admin
```

### Lint

```bash
pnpm lint
```

## 🎨 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Real-time:** Socket.IO client
- **Charts:** Recharts
- **Tables:** TanStack Table
- **Date handling:** date-fns
- **Notifications:** Sonner

## 📁 Estructura de una App

```
apps/[app-name]/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── [routes]/
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes base
│   │   └── [features]/  # Componentes por feature
│   ├── lib/             # Utilidades
│   │   ├── api.ts       # Cliente API
│   │   └── utils.ts
│   ├── hooks/           # Custom hooks
│   └── store/           # Zustand stores
├── public/              # Assets estáticos
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.ts
```

## 🔧 Configuración

### Variables de Entorno

Cada app tiene su `.env.example`. Copiar a `.env.local`:

```bash
cp apps/admin/.env.example apps/admin/.env.local
```

### Personalización de Tema (Booking app)

El booking app soporta personalización por restaurante:

```typescript
// Tema se carga desde el backend
interface RestaurantTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: 'modern' | 'elegant' | 'casual';
  logo: string;
  heroImage: string;
  backgroundColor: string;
}
```

## 🔗 Comunicación con Backend

Todas las apps se comunican con el backend en `http://localhost:4000`:

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para auth
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 📡 Real-time (WebSockets)

Booking y Dashboard usan Socket.IO para updates en tiempo real:

```typescript
// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000');
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return socket;
}
```

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests (opcional, con Playwright)
pnpm test:e2e

# Coverage
pnpm test:cov
```

## 🚢 Deploy

Cada app se deploya independientemente en Vercel:

1. Conectar repo a Vercel
2. Crear 3 proyectos separados:
   - `yumyum-admin` → fronts/apps/admin
   - `yumyum-booking` → fronts/apps/booking
   - `yumyum-dashboard` → fronts/apps/dashboard
3. Configurar environment variables
4. Deploy automático en push a main

## 📝 Convenciones de Código

- Usar TypeScript strict mode
- Componentes funcionales con hooks
- Nombrar archivos en kebab-case
- Componentes en PascalCase
- Props interfaces con sufijo `Props`
- Custom hooks con prefijo `use`

## 🎯 Próximos Pasos

Ver [Sprint 0 Checklist](../docs/SPRINT0_CHECKLIST.md) para tareas pendientes.
