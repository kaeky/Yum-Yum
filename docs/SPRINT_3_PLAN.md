# Sprint 3 - Menu Management & Configuration

## 🎯 Objetivos

Completar el sistema de menús y configuración de restaurantes para habilitar:

- Pre-órdenes desde Booking
- Órdenes desde mesa (QR)
- Personalización completa del restaurante
- Gestión visual de mesas

---

## 📊 Estado Actual

### ✅ Ya Completado (Sprints 0-2)

- Backend: Auth, Users, Restaurants, Tables, Reservations (35+ endpoints)
- Frontend Admin: Login, Register, Auth completo
- Frontend Dashboard: Login, Register, CRUD Restaurantes básico
- Frontend Booking: Marketplace + Vista individual de restaurante
- Infraestructura: Docker, CI/CD, Deploy configs
- Branding: Logos, colores, guías

### 🎯 Sprint 3 - Lo que Vamos a Hacer

---

## 🍽️ 1. MENU MANAGEMENT (Backend + Dashboard)

### Backend - Menu Module

#### Endpoints a Crear:

**Menu Categories:**

```
POST   /api/restaurants/:id/menu/categories          - Crear categoría
GET    /api/restaurants/:id/menu/categories          - Listar categorías
GET    /api/restaurants/:id/menu/categories/:catId   - Obtener categoría
PATCH  /api/restaurants/:id/menu/categories/:catId   - Actualizar
DELETE /api/restaurants/:id/menu/categories/:catId   - Eliminar
PATCH  /api/restaurants/:id/menu/categories/:catId/reorder  - Cambiar orden
```

**Menu Items:**

```
POST   /api/menu/categories/:catId/items             - Crear item
GET    /api/menu/categories/:catId/items             - Listar items
GET    /api/menu/items/:id                           - Obtener item
PATCH  /api/menu/items/:id                           - Actualizar item
DELETE /api/menu/items/:id                           - Eliminar item
PATCH  /api/menu/items/:id/availability              - Toggle disponibilidad
PATCH  /api/menu/items/:id/featured                  - Toggle destacado
```

**Public Endpoints:**

```
GET    /api/restaurants/:slug/menu                   - Menú público completo
```

#### Entidades (Ya Existen):

- ✅ `MenuCategory` - Categorías del menú
- ✅ `MenuItem` - Items del menú

#### Características:

- Drag & drop ordering (displayOrder field)
- Toggle availability en tiempo real
- Featured items
- Alérgenos y dietary info
- Imágenes de platos
- Precios y descripciones
- Tiempo de preparación estimado

---

## ⚙️ 2. RESTAURANT CONFIGURATION (Dashboard)

### Settings Page Completo

#### Secciones:

**1. General Information**

- Nombre, descripción
- Dirección completa
- Teléfono, email, website
- Tipo de cocina, rango de precios

**2. White-Label Branding**

- Upload logo
- Colores primario y secundario (color picker)
- Upload hero image
- Upload galería de fotos

**3. Opening Hours**

- Editor de horarios por día
- Horarios especiales
- Días festivos cerrados

**4. Reservation Settings**

- ✅ Acepta reservas (toggle)
- Max party size
- Duración promedio de comida
- Tiempo de buffer entre reservas
- Política de cancelación

**5. Pre-Order Settings**

- ✅ Acepta pre-órdenes (toggle)
- Tiempo mínimo de anticipación
- Items disponibles para pre-order

**6. Table Order Settings**

- ✅ Acepta órdenes desde mesa (toggle)
- QR codes por mesa (auto-generados)

**7. Payment Settings**

- ✅ Requiere depósito (toggle)
- Monto del depósito
- Métodos de pago aceptados

---

## 📱 3. QR CODE GENERATION

### Backend:

```typescript
GET /api/restaurants/:id/tables/:tableId/qr   - Generar QR code
```

**QR Code contiene:**

```
https://yumyum.com/order?r=demo-restaurant&t=1
```

**Genera:**

- QR code en formato PNG/SVG
- Código único por mesa
- Link a página de order desde mesa

### Dashboard:

- Vista de QR codes
- Download individual
- Download todos (ZIP)
- Print-ready format

---

## 🎨 4. DASHBOARD IMPROVEMENTS

### Tables Management Page

**Features:**

- ✅ Lista de mesas con estados
- ✅ Crear/Editar/Eliminar mesa
- ⭐ **NUEVO:** Visual floor plan (drag & drop)
- ⭐ **NUEVO:** Estados en tiempo real
- ⭐ **NUEVO:** Asignación rápida de reservas

**Floor Plan Editor:**

- Grid canvas para posicionar mesas
- Drag & drop de mesas
- Zoom in/out
- Guardar layout (positionX, positionY)
- Diferentes shapes (cuadrada, redonda, rectangular)

### Menu Management Page (NUEVO)

**Features:**

- CRUD de categorías
- CRUD de items por categoría
- Drag & drop para reordenar
- Toggle availability
- Toggle featured
- Upload de imágenes
- Preview del menú público

---

## 🍴 5. BOOKING APP - MENU DISPLAY

### Restaurant Page Enhancement

**Agregar sección de Menú:**

- Tabs por categoría
- Cards de items con:
  - Imagen
  - Nombre y descripción
  - Precio
  - Badges (vegetariano, picante, etc.)
  - Alérgenos
  - Botón "Agregar a Pre-Orden" (si está habilitado)

**Pre-Order Flow (Básico):**

- Shopping cart
- Selección de items
- Notas especiales
- Integrar con reserva

---

## 🧪 6. TESTING

### Backend Tests

```
- Menu Categories CRUD
- Menu Items CRUD
- Ordering logic
- Availability toggle
- Public menu endpoint
- QR code generation
```

### Frontend Tests

```
- Menu management page
- Settings page
- QR code download
- Floor plan interactions
```

---

## 📦 ENTREGABLES

### Backend (API):

1. ✅ Menu Categories Module (Controller + Service)
2. ✅ Menu Items endpoints
3. ✅ QR Code generation endpoint
4. ✅ Public menu endpoint
5. ✅ Tests E2E

### Frontend Dashboard:

1. ✅ Menu Management page completa
2. ✅ Settings page completa (7 secciones)
3. ✅ QR Codes page
4. ✅ Floor Plan editor (básico)
5. ✅ Mejoras a Tables page

### Frontend Booking:

1. ✅ Display de menú en restaurant page
2. ✅ Pre-order flow básico

### Documentation:

1. ✅ API docs actualizados
2. ✅ Dashboard user guide
3. ✅ QR codes usage guide

---

## 🗓️ TIMELINE

### Semana 1: Backend + Menu Management

**Días 1-2: Menu Backend**

- [ ] Menu Categories module
- [ ] Menu Items endpoints
- [ ] Ordering logic
- [ ] Tests

**Días 3-4: Dashboard Menu**

- [ ] Menu page UI
- [ ] CRUD forms
- [ ] Drag & drop ordering
- [ ] Image upload

**Día 5: QR Codes**

- [ ] QR generation endpoint
- [ ] QR page in Dashboard
- [ ] Download functionality

### Semana 2: Configuration + Display

**Días 6-8: Settings Page**

- [ ] General info section
- [ ] White-label section (logo, colors)
- [ ] Opening hours editor
- [ ] Reservation settings
- [ ] Pre-order settings
- [ ] Table order settings
- [ ] Payment settings

**Días 9-10: Menu Display + Polish**

- [ ] Menu tabs in Booking
- [ ] Item cards
- [ ] Pre-order cart (básico)
- [ ] Floor plan editor (if time)
- [ ] Tests E2E
- [ ] Documentation

---

## 🎯 SUCCESS CRITERIA

Al final del Sprint 3:

1. ✅ **Restaurant owner puede:**
   - Crear y gestionar menú completo
   - Configurar todos los settings de su restaurante
   - Personalizar branding (logo, colores)
   - Generar QR codes para mesas
   - Ver floor plan de mesas

2. ✅ **Customers pueden:**
   - Ver menú completo del restaurante
   - Pre-ordenar items (básico)
   - Ver branding personalizado

3. ✅ **Sistema tiene:**
   - 15+ nuevos endpoints
   - Menu management completo
   - QR generation
   - Settings avanzados

---

## 📊 METRICS

- **Backend:** +15 endpoints
- **Frontend:** +4 páginas nuevas
- **Tests:** +20 test cases
- **Documentación:** +3 guías

---

## 🚀 NEXT STEPS (Sprint 4)

Después de Sprint 3:

- WebSockets para updates en tiempo real
- Orders module (pre-orders + table orders)
- CRM y customer preferences
- Analytics dashboard
- Notifications (Email + WhatsApp)

---

## 📝 NOTES

### Decisiones Técnicas:

**QR Codes:**

- Usar librería `qrcode` (npm)
- Formato PNG para print
- SVG para web display

**Image Upload:**

- AWS S3 (producción)
- Local storage (desarrollo)
- Max 5MB por imagen
- Resize automático

**Floor Plan:**

- Canvas HTML5 o react-grid-layout
- Guardar solo coordinates (x, y)
- No drag en móvil (solo desktop)

**Menu Ordering:**

- Campo `displayOrder` (integer)
- Re-calcular al drag & drop
- Gaps de 10 para facilitar inserts

---

**Autor:** YumYum Team
**Fecha:** Diciembre 2025
**Duración Estimada:** 2 semanas
**Prioridad:** Alta
