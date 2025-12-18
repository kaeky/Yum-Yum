# 🚀 Getting Started - YumYum

Guía paso a paso para comenzar a trabajar en YumYum.

## ⚡ Quick Start (5 minutos)

```bash
# 1. Instalar dependencias
pnpm install

# 2. Copiar variables de entorno
cp apps/admin/.env.example apps/admin/.env.local
cp apps/booking/.env.example apps/booking/.env.local
cp apps/dashboard/.env.example apps/dashboard/.env.local
cp apps/api/.env.example apps/api/.env

# 3. Iniciar Docker (PostgreSQL + Redis)
docker-compose up -d

# 4. Ejecutar migraciones (cuando estén disponibles)
cd apps/api
pnpm run migration:run
cd ../..

# 5. Iniciar modo desarrollo
pnpm dev
```

Ahora visita:

- **Admin:** http://localhost:3000
- **Booking:** http://localhost:3001
- **Dashboard:** http://localhost:3002
- **API:** http://localhost:4000

## 📋 Prerequisitos

### Software Requerido

| Software       | Versión Mínima | Verificar                  |
| -------------- | -------------- | -------------------------- |
| Node.js        | 20.0.0         | `node --version`           |
| pnpm           | 8.0.0          | `pnpm --version`           |
| Docker         | 20.10.0        | `docker --version`         |
| Docker Compose | 2.0.0          | `docker-compose --version` |
| Git            | 2.30.0         | `git --version`            |

### Instalación de Prerequisitos

#### Windows

```powershell
# Node.js (con nvm-windows)
nvm install 20
nvm use 20

# pnpm
npm install -g pnpm@8

# Docker Desktop
# Descargar de: https://www.docker.com/products/docker-desktop
```

#### macOS

```bash
# Node.js (con nvm)
brew install nvm
nvm install 20
nvm use 20

# pnpm
npm install -g pnpm@8

# Docker Desktop
brew install --cask docker
```

#### Linux (Ubuntu/Debian)

```bash
# Node.js (con nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# pnpm
npm install -g pnpm@8

# Docker
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo systemctl start docker
sudo usermod -aG docker $USER
```

## 🏗️ Estructura del Proyecto

```
yumyum/
├── apps/
│   ├── admin/          👥 Panel de super-admin
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router
│   │   │   ├── components/    # Componentes de React
│   │   │   ├── lib/           # Utilidades
│   │   │   ├── hooks/         # Custom hooks
│   │   │   └── store/         # Zustand stores
│   │   └── package.json
│   │
│   ├── booking/        📱 Página pública de reservas
│   │   └── src/
│   │
│   ├── dashboard/      📊 Dashboard del restaurante
│   │   └── src/
│   │
│   └── api/            ⚙️ Backend NestJS
│       ├── src/
│       │   ├── modules/       # Módulos de negocio
│       │   ├── common/        # Código compartido
│       │   ├── config/        # Configuración
│       │   └── database/      # Migraciones y seeds
│       └── package.json
│
├── packages/           📦 Código compartido
│   ├── ui/                    # Componentes React compartidos
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utilidades
│   └── config/                # Configs (ESLint, Tailwind)
│
├── infrastructure/     🐳 Infraestructura
│   └── docker/
│
├── docs/               📚 Documentación
│
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## 🔧 Configuración del Entorno

### Variables de Entorno

#### Admin App (`apps/admin/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

#### Booking App (`apps/booking/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

#### Dashboard App (`apps/dashboard/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

#### API (`apps/api/.env`)

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/yumyum

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# App
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3001

# WhatsApp (opcional en desarrollo)
# WHATSAPP_API_URL=
# WHATSAPP_API_KEY=

# Wompi (opcional en desarrollo)
# WOMPI_PUBLIC_KEY=
# WOMPI_PRIVATE_KEY=
# WOMPI_EVENTS_SECRET=

# AWS S3 (opcional)
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# S3_BUCKET_NAME=

# Sentry (opcional)
# SENTRY_DSN=
```

## 💻 Comandos Útiles

### Desarrollo

```bash
# Iniciar todos los servicios en modo desarrollo
pnpm dev

# Iniciar solo una app específica
cd apps/admin
pnpm dev

# Iniciar solo el backend
cd apps/api
pnpm dev

# Limpiar y reinstalar dependencias
pnpm clean
pnpm install
```

### Testing

```bash
# Ejecutar todos los tests
pnpm test

# Tests con coverage
pnpm test:cov

# Tests en modo watch
pnpm test:watch
```

### Build

```bash
# Build de todas las apps
pnpm build

# Build de una app específica
pnpm build --filter=@yumyum/admin
```

### Database

```bash
cd apps/api

# Crear una migración
pnpm run migration:create --name=AddNewTable

# Ejecutar migraciones
pnpm run migration:run

# Revertir última migración
pnpm run migration:revert

# Generar migración desde entities
pnpm run migration:generate --name=UpdateSchema
```

### Docker

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f postgres

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reiniciar un servicio
docker-compose restart postgres
```

## 🐛 Troubleshooting

### Puerto ya en uso

```bash
# Ver qué proceso usa el puerto 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Matar el proceso
kill -9 PID  # macOS/Linux
taskkill /PID PID /F  # Windows
```

### PostgreSQL no arranca

```bash
# Ver logs
docker-compose logs postgres

# Reiniciar
docker-compose restart postgres

# Si persiste, eliminar volumen y recrear
docker-compose down -v
docker-compose up -d
```

### Problemas con pnpm

```bash
# Limpiar cache
pnpm store prune

# Reinstalar dependencias
rm -rf node_modules
pnpm install
```

### Problemas con Turbo cache

```bash
# Limpiar cache de Turbo
rm -rf .turbo
pnpm build
```

## 🎯 Próximos Pasos

1. **Leer el plan completo:**
   - [PLAN_YUMYUM.md](./PLAN_YUMYUM.md)

2. **Revisar el checklist:**
   - [SPRINT0_CHECKLIST.md](./SPRINT0_CHECKLIST.md)

3. **Configurar tu editor:**
   - Instalar extensiones recomendadas (ESLint, Prettier, Tailwind)
   - Configurar format on save

4. **Familiarizarte con el código:**
   - Explorar estructura de carpetas
   - Revisar componentes de ejemplo
   - Leer documentación de arquitectura

5. **Hacer tu primer commit:**
   ```bash
   git checkout -b feature/my-first-feature
   # Hacer cambios
   git add .
   git commit -m "feat: add my first feature"
   git push origin feature/my-first-feature
   ```

## 📚 Recursos

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [TypeORM Documentation](https://typeorm.io)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Equipo y Colaboración

- **Daily Standups:** Async en Slack
- **Code Reviews:** Obligatorios en todos los PRs
- **Convenciones:** Ver [CONTRIBUTING.md](./CONTRIBUTING.md) (próximamente)

## ❓ Ayuda

¿Tienes problemas?

1. Revisa esta guía
2. Busca en la documentación del proyecto
3. Pregunta en Slack (canal #dev)
4. Abre un issue en GitHub

---

¡Bienvenido al equipo de YumYum! 🍽️✨
