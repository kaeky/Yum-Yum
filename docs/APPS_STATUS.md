# Estado de las Aplicaciones Frontend

## 📊 Resumen General

| App           | Puerto | Estado        | Completitud |
| ------------- | ------ | ------------- | ----------- |
| **Admin**     | 3000   | ⚠️ Incompleto | ~30%        |
| **Booking**   | 3001   | ⚠️ Incompleto | ~40%        |
| **Dashboard** | 3002   | ✅ Completo   | ~90%        |

---

## 🔴 Admin Panel (puerto 3000)

**Propósito:** Panel para super administradores que gestionan todo el sistema YumYum

### ✅ Lo que existe:

- [x] Login page básico
- [x] Register page básico
- [x] Dashboard layout con sidebar
- [x] Dashboard home (solo vista estática con datos dummy)

### ❌ Lo que falta (Sprint 1-2-3-4):

#### Autenticación

- [ ] AuthContext funcional
- [ ] Protección de rutas
- [ ] Integración con API de auth
- [ ] Login/Register funcionales con validación

#### CRUD de Restaurantes

- [ ] `/dashboard/restaurants` - Lista de todos los restaurantes del sistema
  - [ ] Tabla con paginación
  - [ ] Filtros: ciudad, tipo de cocina, activo/inactivo, verificado
  - [ ] Búsqueda por nombre
  - [ ] Botón "Nuevo Restaurante"

- [ ] `/dashboard/restaurants/new` - Crear restaurante
  - [ ] Formulario completo de creación
  - [ ] Validación de campos
  - [ ] Asignación de owner

- [ ] `/dashboard/restaurants/[id]` - Ver detalle de restaurante
  - [ ] Información completa
  - [ ] Estadísticas
  - [ ] Botón "Editar"

- [ ] `/dashboard/restaurants/[id]/edit` - Editar restaurante
  - [ ] Formulario de edición
  - [ ] Cambiar estado (activo/inactivo, verificado)
  - [ ] Eliminar restaurante (soft delete)

#### Gestión de Usuarios (Opcional para Sprint 1-4)

- [ ] `/dashboard/users` - Lista de usuarios
- [ ] Ver/editar usuarios
- [ ] Cambiar roles

### Componentes necesarios:

```
fronts/apps/admin/src/
├── contexts/
│   └── auth-context.tsx                    ❌
├── components/
│   ├── restaurants/
│   │   ├── restaurant-list.tsx            ❌
│   │   ├── restaurant-card.tsx            ❌
│   │   ├── restaurant-form.tsx            ❌
│   │   └── restaurant-filters.tsx         ❌
│   └── users/
│       ├── user-list.tsx                   ❌
│       └── user-card.tsx                   ❌
└── app/
    └── (dashboard)/
        └── dashboard/
            └── restaurants/
                ├── page.tsx                ❌
                ├── new/page.tsx            ❌
                └── [id]/
                    ├── page.tsx            ❌
                    └── edit/page.tsx       ❌
```

---

## 🟡 Booking App (puerto 3001)

**Propósito:** Aplicación pública para que clientes busquen restaurantes y hagan reservas

### ✅ Lo que existe:

- [x] Layout básico
- [x] Home page con búsqueda de restaurantes
- [x] Filtros por ciudad y tipo de cocina
- [x] Diseño UI/UX completo

### ❌ Problemas actuales:

- [x] **Error 404 en GET /restaurants** (el endpoint SÍ existe pero puede fallar si no hay datos)
- [ ] No hay datos seed para mostrar restaurantes

### ❌ Lo que falta (Sprint 1-2-3-4):

#### Exploración de Restaurantes

- [ ] Verificar que el endpoint `/restaurants` devuelve datos
- [ ] Manejo correcto de estados vacíos
- [ ] Paginación funcional
- [ ] Cargar imágenes reales o placeholders

#### Detalle de Restaurante

- [ ] `/[slug]` - Página de detalle de restaurante
  - [ ] Información completa
  - [ ] Galería de fotos
  - [ ] Menú del restaurante
  - [ ] Horarios de apertura
  - [ ] Ubicación (mapa)
  - [ ] Reviews y rating
  - [ ] Botón "Reservar"

#### Sistema de Reservas

- [ ] `/[slug]/reserve` - Página de reserva
  - [ ] Selector de fecha y hora
  - [ ] Número de personas
  - [ ] Verificación de disponibilidad
  - [ ] Formulario de datos del cliente
  - [ ] Resumen de reserva
  - [ ] Confirmación

#### Pre-orden (si el restaurante lo permite)

- [ ] `/[slug]/reserve/menu` - Pre-ordenar platillos
  - [ ] Mostrar menú del restaurante
  - [ ] Carrito de pre-orden
  - [ ] Resumen de orden

### Componentes necesarios:

```
fronts/apps/booking/src/
├── app/
│   ├── [slug]/
│   │   ├── page.tsx                       ❌ (detalle)
│   │   └── reserve/
│   │       ├── page.tsx                   ❌ (reserva)
│   │       └── menu/page.tsx              ❌ (pre-orden)
│   └── page.tsx                           ✅ (needs fix)
└── components/
    ├── restaurant/
    │   ├── restaurant-detail.tsx          ❌
    │   ├── restaurant-gallery.tsx         ❌
    │   ├── restaurant-menu.tsx            ❌
    │   └── restaurant-reviews.tsx         ❌
    └── reservation/
        ├── date-time-selector.tsx         ❌
        ├── party-size-selector.tsx        ❌
        ├── reservation-form.tsx           ❌
        └── reservation-summary.tsx        ❌
```

---

## 🟢 Dashboard (puerto 3002)

**Propósito:** Panel para restaurant owners que gestionan su(s) restaurante(s)

### ✅ Lo que existe (Sprint 3-4 completo):

- [x] AuthContext funcional
- [x] Login/Register funcionales
- [x] Protección de rutas
- [x] Dashboard home
- [x] **Gestión de Menú (Sprint 3)**
  - [x] CRUD de categorías con drag & drop
  - [x] CRUD de items de menú
  - [x] Reordenamiento
- [x] **Configuración (Sprint 3-4)**
  - [x] Información general del restaurante
  - [x] Horarios de apertura (Time Slots)
  - [x] Personalización de tema
  - [x] Configuración de pagos y funcionalidades
- [x] Lista de restaurantes (básica)
- [x] Crear nuevo restaurante

### ❌ Lo que falta (Sprints futuros):

- [ ] Gestión de Mesas (Sprint 5)
- [ ] Gestión de Reservas (Sprint 5-6)
- [ ] Sistema de órdenes (Sprint 6-7)
- [ ] CRM y Marketing (Sprint 7)

---

## 🎯 Prioridades Recomendadas

### Opción A: Completar Admin primero

**Ventaja:** Los super admins pueden gestionar restaurantes desde el admin

1. ✅ Crear AuthContext para Admin
2. ✅ Implementar Login/Register funcionales
3. ✅ CRUD completo de restaurantes
4. ✅ Lista, crear, editar, eliminar
5. ✅ Filtros y búsqueda

**Tiempo estimado:** 4-6 horas

### Opción B: Arreglar Booking primero

**Ventaja:** Los clientes pueden ver restaurantes y hacer reservas

1. ✅ Verificar que el backend devuelve restaurantes
2. ✅ Arreglar el error 404 en booking
3. ✅ Implementar página de detalle de restaurante
4. ✅ Implementar sistema de reservas básico

**Tiempo estimado:** 6-8 horas

### Opción C: Híbrido (Recomendado)

**Ventaja:** Balance entre funcionalidad admin y pública

1. ✅ Arreglar error en Booking (verificar endpoint)
2. ✅ Implementar AuthContext en Admin
3. ✅ CRUD de restaurantes en Admin
4. ✅ Página de detalle en Booking
5. ✅ Sistema de reservas básico en Booking

**Tiempo estimado:** 8-10 horas

---

## 🔧 Diagnóstico del Error en Booking

### Error actual:

```
AxiosError: Request failed with status code 404
GET /restaurants
```

### Posibles causas:

1. **Backend no está corriendo**

   ```bash
   # Verificar
   curl http://localhost:4000/api/restaurants

   # Si falla, iniciar
   pnpm dev:api
   ```

2. **No hay datos en la base de datos**

   ```bash
   cd back/api
   pnpm seed  # Cargar datos de prueba
   ```

3. **CORS no configurado correctamente**
   - Verificar en `back/api/src/main.ts` que CORS permite puerto 3001

4. **URL incorrecta en el frontend**
   - Verificar `.env.local` en `fronts/apps/booking/`
   - Debe tener: `NEXT_PUBLIC_API_URL=http://localhost:4000/api`

### Solución rápida:

```bash
# Terminal 1: Backend
cd back/api
pnpm dev:api

# Terminal 2: Verificar que funciona
curl http://localhost:4000/api/restaurants

# Terminal 3: Booking
cd fronts/apps/booking
pnpm dev

# Abrir: http://localhost:3001
```

---

## 📋 Checklist de Implementación

### Admin Panel

- [ ] Crear `AuthContext` (copiar y adaptar del dashboard)
- [ ] Proteger rutas del dashboard
- [ ] Crear página de lista de restaurantes
- [ ] Crear página de nuevo restaurante
- [ ] Crear página de editar restaurante
- [ ] Crear página de detalle de restaurante
- [ ] Implementar filtros y búsqueda
- [ ] Conectar con API del backend

### Booking App

- [ ] Diagnosticar error 404
- [ ] Verificar que hay datos en la BD
- [ ] Implementar página de detalle `/[slug]/page.tsx`
- [ ] Implementar página de reserva `/[slug]/reserve/page.tsx`
- [ ] Crear componentes de reserva
- [ ] Integrar con API de disponibilidad
- [ ] Implementar confirmación de reserva

---

## 🚀 Siguiente Paso

**¿Qué prefieres que implemente primero?**

1. **Admin completo** - Para que puedas gestionar restaurantes desde el panel de admin
2. **Arreglar Booking** - Para que los clientes puedan ver y reservar
3. **Ambos en paralelo** - Un poco de cada uno

**Dime qué prefieres y empiezo inmediatamente.** 👇
