# 🍽️ YumYum - Sistema Integral de Gestión de Restaurantes

Sistema todo-en-uno para restaurantes: reservas inteligentes, menú digital, pre-orden, órdenes desde mesa, CRM, marketing automatizado e Intelligence Engine con ML.

## 📦 Arquitectura del Monorepo

```
yumyum/
├── fronts/                 # Frontend Monorepo
│   ├── apps/
│   │   ├── admin/          # Panel super-admin (admin.yumyum.com)
│   │   ├── booking/        # Página pública ({slug}.yumyum.com)
│   │   └── dashboard/      # Dashboard restaurante (dashboard.yumyum.com)
│   └── packages/
│       ├── ui/             # Componentes React compartidos
│       ├── types/          # TypeScript types
│       ├── utils/          # Utilidades
│       └── config/         # Configs compartidas
│
├── back/                   # Backend Monorepo
│   └── api/                # NestJS API (api.yumyum.com)
│
├── docs/                   # Documentación
│   ├── PLAN_YUMYUM.md      # Plan maestro completo
│   ├── GETTING_STARTED.md  # Guía de inicio
│   └── architecture.md     # Arquitectura técnica
│
├── docker-compose.yml      # PostgreSQL + Redis
├── turbo.json              # Turborepo config
├── pnpm-workspace.yaml     # Workspace config
└── package.json            # Root package
```

## 🚀 Tech Stack

### Frontend (Next.js 14)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React + Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.IO client
- **Deploy**: Vercel

### Backend (NestJS)

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL 15 + TypeORM
- **Cache**: Redis 7
- **Queue**: BullMQ
- **Real-time**: Socket.IO
- **WhatsApp**: Baileys → Meta Business API
- **Payments**: Wompi
- **Deploy**: Railway / AWS ECS

## 🛠️ Prerequisitos

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

## 📥 Quick Start

### 1. Clonar e instalar

```bash
git clone https://github.com/your-org/yumyum.git
cd yumyum
pnpm install
```

### 2. Configurar variables de entorno

```bash
# Frontend apps
cp fronts/apps/admin/.env.example fronts/apps/admin/.env.local
cp fronts/apps/booking/.env.example fronts/apps/booking/.env.local
cp fronts/apps/dashboard/.env.example fronts/apps/dashboard/.env.local

# Backend
cp back/api/.env.example back/api/.env
```

### 3. Iniciar servicios

```bash
# Iniciar PostgreSQL + Redis
docker-compose up -d

# Ejecutar migraciones (cuando estén disponibles)
cd back/api
pnpm run migration:run
cd ../..

# Iniciar modo desarrollo
pnpm dev
```

Aplicaciones disponibles:

- **Admin**: http://localhost:3000
- **Booking**: http://localhost:3001
- **Dashboard**: http://localhost:3002
- **API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/docs

## 📝 Scripts Disponibles

```bash
# Desarrollo (todas las apps)
pnpm dev

# Build (todas las apps)
pnpm build

# Lint
pnpm lint

# Tests
pnpm test

# Formatear código
pnpm format

# Limpiar
pnpm clean

# Docker
pnpm docker:up        # Iniciar servicios
pnpm docker:down      # Detener servicios
pnpm docker:logs      # Ver logs
```

## 🏗️ Desarrollo por Sección

### Frontend

```bash
# Solo frontends
cd fronts

# Admin app
cd apps/admin
pnpm dev

# Booking app
cd apps/booking
pnpm dev

# Dashboard app
cd apps/dashboard
pnpm dev
```

### Backend

```bash
cd back/api
pnpm dev
```

## 🗄️ Base de Datos

```bash
cd back/api

# Crear migración
pnpm run migration:create --name=AddNewTable

# Ejecutar migraciones
pnpm run migration:run

# Revertir última migración
pnpm run migration:revert

# Generar migración desde entities
pnpm run migration:generate --name=UpdateSchema
```

## 🧪 Testing

```bash
# Todos los tests
pnpm test

# Tests con coverage
pnpm test:cov

# E2E tests (backend)
cd back/api
pnpm test:e2e
```

## 🚢 Deploy

### Frontend (Vercel)

Cada app se deploya independientemente:

1. **Admin**: `fronts/apps/admin` → admin.yumyum.com
2. **Booking**: `fronts/apps/booking` → yumyum.com, \*.yumyum.com
3. **Dashboard**: `fronts/apps/dashboard` → dashboard.yumyum.com

### Backend (Railway / AWS ECS)

```bash
cd back/api
railway up
```

## 📚 Documentación

- [**Plan Maestro**](./docs/PLAN_YUMYUM.md) - Documento completo (150 páginas)
- [**Getting Started**](./docs/GETTING_STARTED.md) - Guía de inicio
- [**Sprint 0 Checklist**](./docs/SPRINT0_CHECKLIST.md) - Setup checklist
- [**API Docs**](http://localhost:4000/api/docs) - Swagger (dev mode)

## 📁 Estructura Detallada

### Fronts

```
fronts/
├── apps/
│   ├── admin/
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router
│   │   │   ├── components/    # Componentes
│   │   │   ├── lib/           # Utils
│   │   │   ├── hooks/         # Custom hooks
│   │   │   └── store/         # Zustand stores
│   │   ├── public/
│   │   └── package.json
│   │
│   ├── booking/               # Misma estructura
│   └── dashboard/             # Misma estructura
│
└── packages/
    ├── ui/                    # Componentes compartidos
    ├── types/                 # Types compartidos
    ├── utils/                 # Utilidades
    └── config/                # Configs (ESLint, Tailwind)
```

### Back

```
back/
└── api/
    ├── src/
    │   ├── modules/           # Módulos de negocio
    │   │   ├── auth/
    │   │   ├── users/
    │   │   ├── restaurants/
    │   │   ├── reservations/
    │   │   ├── menu/
    │   │   └── ...
    │   ├── common/            # Código compartido
    │   ├── config/            # Configuración
    │   ├── database/          # Migraciones
    │   └── gateways/          # WebSockets
    ├── test/
    └── package.json
```

### Docs

```
docs/
├── PLAN_YUMYUM.md             # Plan maestro (150 páginas)
├── GETTING_STARTED.md         # Guía de inicio
├── SPRINT0_CHECKLIST.md       # Checklist de setup
├── architecture.md            # Decisiones arquitectónicas
├── api.md                     # Documentación de API
└── deployment.md              # Guía de deploy
```

## 🤝 Equipo

- **Tech Lead / Architect** (1)
- **Frontend Developers** (2)
- **Backend Developers** (2)
- **Full-stack Developer** (1)
- **QA Engineer** (1)

## 🔗 Links Importantes

- **Producción**: https://yumyum.com
- **Staging**: https://staging.yumyum.com
- **Admin**: https://admin.yumyum.com
- **Dashboard**: https://dashboard.yumyum.com
- **API**: https://api.yumyum.com
- **Documentación**: https://docs.yumyum.com

## 📊 Estado del Proyecto

```
Sprint Actual: Sprint 0 (Setup)
Progreso: 30%
Timeline: 24 semanas total (6 meses)
Lanzamiento MVP: Semana 16
```

## 🎯 Features Principales

- ✅ **Reservas Inteligentes** con WhatsApp
- ✅ **Pre-orden** de entradas + bebidas
- ✅ **Menú Digital** con QR
- ✅ **Órdenes desde mesa**
- ✅ **CRM + Fidelización**
- ✅ **Campañas de Marketing** (WhatsApp)
- ✅ **Intelligence Engine** (ML)
- ✅ **Analytics + Reportes**
- ✅ **Overbooking Inteligente**
- ✅ **Payments** (Wompi)

## 💡 Monetización

13 revenue streams diferentes:

1. Suscripciones SaaS
2. Comisiones sobre transacciones
3. Publicidad
4. YumYum Premium (B2C)
5. Marketplace de servicios
6. **Data as a Service** 🔥
7. Programa de afiliados
8. Seguros
9. Dynamic pricing
10. White-label
11. API Access
12. Eventos premium
13. YumYum Capital

**Revenue potencial:** $2.7B COP/año (~$670k USD)

## 📄 Licencia

Proprietary - YumYum © 2025

---

**Hecho con ❤️ por el equipo de YumYum**
