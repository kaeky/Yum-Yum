# Sprint 3-4 - Guía de Pruebas Completa

## 🔧 Configuración Inicial

### 1. Levantar Servicios

```bash
# Desde la raíz del proyecto
pnpm docker:up          # PostgreSQL + Redis
pnpm dev:api            # Backend (puerto 4000)
pnpm dev:dashboard      # Dashboard (puerto 3002)
```

### 2. Verificar Base de Datos

```bash
cd back/api
pnpm migration:run      # Aplicar migraciones (incluye time_slots)
pnpm seed               # Cargar datos de prueba
```

---

## 🔐 Pruebas de Autenticación (FIX APLICADO)

### Problema Resuelto

- ❌ **Antes**: El dashboard no redirigía después del login
- ✅ **Ahora**: Middleware simplificado + protección client-side en el layout

### Credenciales de Prueba

```
Email: owner@demo-restaurant.com
Password: Admin123!
```

### Flujo de Prueba

1. Ir a: http://localhost:3002/login
2. Ingresar credenciales
3. Hacer clic en "Iniciar Sesión"
4. **Resultado esperado**: Redirección automática a `/dashboard`
5. Verificar que el Sidebar muestra el usuario logueado

---

## 📋 Módulo 1: Gestión de Menú (Sprint 3)

### Backend APIs

#### 1.1 Categorías de Menú

**Listar categorías:**

```bash
curl http://localhost:4000/api/restaurants/{restaurantId}/menu-categories
```

**Crear categoría:**

```bash
curl -X POST http://localhost:4000/api/restaurants/{restaurantId}/menu-categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "Postres",
    "description": "Dulces tradicionales",
    "displayOrder": 4,
    "isActive": true
  }'
```

**Reordenar categorías:**

```bash
curl -X POST http://localhost:4000/api/restaurants/{restaurantId}/menu-categories/reorder \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "categoryIds": ["id1", "id2", "id3"]
  }'
```

**Actualizar categoría:**

```bash
curl -X PATCH http://localhost:4000/api/restaurants/{restaurantId}/menu-categories/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "Postres Caseros",
    "isActive": false
  }'
```

**Eliminar categoría:**

```bash
curl -X DELETE http://localhost:4000/api/restaurants/{restaurantId}/menu-categories/{id} \
  -H "Authorization: Bearer {token}"
```

#### 1.2 Items de Menú

**Listar items:**

```bash
# Todos los items
curl http://localhost:4000/api/restaurants/{restaurantId}/menu-items

# Items de una categoría
curl http://localhost:4000/api/restaurants/{restaurantId}/menu-items?categoryId={categoryId}
```

**Crear item:**

```bash
curl -X POST http://localhost:4000/api/restaurants/{restaurantId}/menu-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "categoryId": "{categoryId}",
    "name": "Tiramisú",
    "description": "Postre italiano con café y mascarpone",
    "price": 7.50,
    "preparationTime": 5,
    "displayOrder": 1,
    "isAvailable": true,
    "isActive": true,
    "allergens": ["gluten", "dairy", "eggs"],
    "dietaryInfo": ["vegetarian"]
  }'
```

**Reordenar items de una categoría:**

```bash
curl -X POST http://localhost:4000/api/restaurants/{restaurantId}/menu-items/reorder \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "categoryId": "{categoryId}",
    "itemIds": ["id1", "id2", "id3"]
  }'
```

**Actualizar item:**

```bash
curl -X PATCH http://localhost:4000/api/restaurants/{restaurantId}/menu-items/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "price": 8.00,
    "isAvailable": false
  }'
```

**Eliminar item:**

```bash
curl -X DELETE http://localhost:4000/api/restaurants/{restaurantId}/menu-items/{id} \
  -H "Authorization: Bearer {token}"
```

### Frontend Dashboard - Menú

**URL:** http://localhost:3002/dashboard/menu

#### Pruebas en UI

**1. Ver Menú Existente**

- ✅ Se muestran 3 categorías: Antipasti, Pasta, Pizza
- ✅ Cada categoría muestra sus items con precio
- ✅ Items marcados como no disponibles aparecen en gris

**2. Crear Nueva Categoría**

- Clic en "+ Nueva Categoría"
- Llenar formulario:
  - Nombre: "Bebidas"
  - Descripción: "Refrescos y cócteles"
  - Activar toggle "Activa"
- Guardar
- ✅ Categoría aparece al final de la lista

**3. Reordenar Categorías**

- Arrastrar categorías usando el ícono de 6 puntos (⋮⋮)
- Soltar en nueva posición
- ✅ Orden se guarda automáticamente

**4. Editar Categoría**

- Clic en ícono de lápiz
- Modificar nombre o descripción
- Guardar
- ✅ Cambios se reflejan inmediatamente

**5. Eliminar Categoría Vacía**

- Clic en ícono de basura en categoría sin items
- Confirmar
- ✅ Categoría desaparece

**6. Crear Nuevo Item**

- Seleccionar una categoría
- Clic en "+ Nuevo Item"
- Llenar formulario completo:
  - Nombre: "Panna Cotta"
  - Descripción: "Postre cremoso con coulis de frutos rojos"
  - Precio: 6.50
  - Tiempo de preparación: 3 minutos
  - Imagen: URL opcional
  - Alérgenos: Seleccionar "Lácteos"
  - Info dietética: Seleccionar "Vegetariano"
  - Activar "Disponible" y "Activo"
- Guardar
- ✅ Item aparece en la categoría seleccionada

**7. Reordenar Items**

- Dentro de una categoría, arrastrar items
- ✅ Orden se guarda automáticamente

**8. Marcar Item como No Disponible**

- Editar un item
- Desactivar toggle "Disponible"
- Guardar
- ✅ Item aparece en gris con badge "No disponible"

**9. Eliminar Item**

- Clic en ícono de basura en un item
- Confirmar
- ✅ Item desaparece de la lista

---

## 🕐 Módulo 2: Horarios de Apertura (Sprint 3-4)

### Backend APIs

#### 2.1 Time Slots (Horarios)

**Listar horarios:**

```bash
# Todos los horarios
curl http://localhost:4000/api/restaurants/{restaurantId}/time-slots

# Horarios de un día específico
curl http://localhost:4000/api/restaurants/{restaurantId}/time-slots?dayOfWeek=monday
```

**Crear horario:**

```bash
curl -X POST http://localhost:4000/api/restaurants/{restaurantId}/time-slots \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "dayOfWeek": "monday",
    "openTime": "09:00",
    "closeTime": "17:00"
  }'
```

**Crear horarios por defecto (9:00-22:00 todos los días):**

```bash
curl -X POST http://localhost:4000/api/restaurants/{restaurantId}/time-slots/defaults \
  -H "Authorization: Bearer {token}"
```

**Actualizar horario:**

```bash
curl -X PATCH http://localhost:4000/api/restaurants/{restaurantId}/time-slots/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "openTime": "10:00",
    "closeTime": "18:00"
  }'
```

**Toggle activo/inactivo:**

```bash
curl -X POST http://localhost:4000/api/restaurants/{restaurantId}/time-slots/{id}/toggle-active \
  -H "Authorization: Bearer {token}"
```

**Eliminar horario:**

```bash
curl -X DELETE http://localhost:4000/api/restaurants/{restaurantId}/time-slots/{id} \
  -H "Authorization: Bearer {token}"
```

#### Validaciones Implementadas

**✅ Formato de tiempo:**

- Debe ser HH:MM en formato 24 horas
- Ejemplo válido: "09:00", "23:30"
- Ejemplo inválido: "9:00", "25:00"

**✅ Lógica de horarios:**

- `openTime` debe ser menor que `closeTime`
- No puede haber solapamiento de horarios en el mismo día

**Ejemplos de solapamiento:**

```
Slot existente: 09:00 - 17:00
❌ 10:00 - 18:00  (se solapa)
❌ 08:00 - 10:00  (se solapa)
❌ 16:00 - 19:00  (se solapa)
✅ 17:00 - 23:00  (no se solapa - consecutivo está permitido)
✅ 06:00 - 09:00  (no se solapa)
```

### Frontend Dashboard - Configuración de Horarios

**URL:** http://localhost:3002/dashboard/settings (Tab "Horarios")

#### Pruebas en UI

**1. Ver Horarios Existentes**

- ✅ Se muestran 7 días de la semana (Lunes a Domingo)
- ✅ Días con horarios muestran los rangos (ej: "13:00 - 23:30")
- ✅ Días sin horarios muestran "Cerrado"
- ✅ Horarios activos tienen fondo verde
- ✅ Horarios inactivos tienen fondo gris

**2. Crear Horarios por Defecto (si no existen)**

- Clic en "Crear Horarios por Defecto"
- Confirmar en el diálogo
- ✅ Se crean horarios 9:00-22:00 para todos los días
- ✅ Mensaje de éxito aparece

**3. Añadir Horario a un Día**

- Clic en "+ Añadir" junto a un día
- Modal se abre con el día seleccionado
- Ingresar horarios:
  - Apertura: 17:00
  - Cierre: 23:00
- Guardar
- ✅ Nuevo horario aparece en el día
- ✅ El día puede tener múltiples horarios (ej: 9:00-13:00 y 17:00-23:00)

**4. Probar Validación de Solapamiento**

- Añadir horario a un día que ya tiene 9:00-17:00
- Intentar crear: 10:00-18:00
- ✅ Error aparece: "Este horario se solapa con otro existente"
- Intentar crear: 17:00-23:00
- ✅ Se crea correctamente (consecutivos están permitidos)

**5. Activar/Desactivar Horario**

- Clic en el ícono ✓ (check) de un horario activo
- ✅ Horario se marca como inactivo (fondo gris)
- Clic en el ícono ○ de un horario inactivo
- ✅ Horario se marca como activo (fondo verde)

**6. Eliminar Horario**

- Clic en el ícono × (eliminar) de un horario
- Confirmar eliminación
- ✅ Horario desaparece
- ✅ Si era el único horario del día, aparece "Cerrado"

**7. Modal de Crear Horario**

- Abrir modal
- ✅ Inputs son tipo "time" (selector nativo de hora)
- ✅ Día de la semana se muestra en español
- ✅ Botón "Cancelar" cierra sin guardar
- ✅ Validación: hora de cierre debe ser mayor que hora de apertura

---

## ⚙️ Módulo 3: Configuración del Restaurante (Sprint 3-4)

### Frontend Dashboard - Configuración

**URL:** http://localhost:3002/dashboard/settings

#### Tab 1: General

**Campos disponibles:**

- Información básica:
  - Nombre del restaurante
  - Tipo de cocina
  - Teléfono
  - Email
  - Capacidad total
  - Descripción (opcional, 1000 caracteres max)

- Dirección completa:
  - Calle y número
  - Ciudad
  - Estado/Provincia
  - País
  - Código postal

**Pruebas:**

1. Modificar nombre del restaurante
2. Actualizar teléfono y email
3. Cambiar capacidad
4. Modificar dirección completa
5. Clic en "Guardar Cambios"
6. ✅ Mensaje de éxito aparece
7. ✅ Datos se actualizan en el backend
8. Clic en "Cancelar"
9. ✅ Formulario se resetea a valores originales

#### Tab 2: Horarios

(Ver sección anterior de Time Slots)

#### Tab 3: Tema

**Personalización disponible:**

- Color principal (con selector y campo de texto)
- Color secundario
- Colores preestablecidos (6 opciones): Sky Blue, Orange, Green, Purple, Red, Pink
- Logo URL (opcional, muestra preview)
- Imagen de portada URL (opcional, muestra preview)
- Fuente tipográfica (6 opciones):
  - Inter (por defecto)
  - Poppins
  - Roboto
  - Montserrat
  - Open Sans
  - Playfair Display

- Vista previa en vivo del gradiente

**Pruebas:**

1. Cambiar color principal usando el selector de color
2. ✅ Vista previa se actualiza inmediatamente
3. Seleccionar un color preestablecido
4. ✅ Color principal cambia
5. Ingresar URL de logo (usar: https://via.placeholder.com/150)
6. ✅ Preview del logo aparece
7. Ingresar URL de imagen de portada (usar: https://via.placeholder.com/800x200)
8. ✅ Preview de la imagen aparece
9. Cambiar fuente tipográfica
10. ✅ Vista previa muestra el texto con la nueva fuente
11. Guardar cambios
12. ✅ Mensaje de éxito aparece
13. ✅ Tema se guarda en el backend

#### Tab 4: Pagos

**Configuraciones disponibles:**

**1. Anticipo de Reserva:**

- Toggle: "Requiere anticipo para grupos grandes"
- Si está activado:
  - Monto de anticipo (por persona): $
  - Aplicar a partir de (número de personas)
- Ejemplo: $10 por persona para grupos de 6+ personas

**2. Pre-Orden:**

- Toggle: "Habilitar pre-orden desde reserva"
- Descripción: Los clientes podrán ordenar al hacer la reserva
- Nota informativa sobre el funcionamiento

**3. Órdenes desde Mesa:**

- Toggle: "Habilitar órdenes desde QR de mesa"
- Descripción: Los clientes escanean QR y ordenan desde su celular
- Nota sobre generación de códigos QR

**Resumen de Configuración:**

- Card visual con todas las configuraciones activas
- Checkmarks verdes para opciones habilitadas
- Círculos grises para opciones deshabilitadas

**Pruebas:**

1. Activar "Requiere anticipo"
2. ✅ Campos de monto y umbral aparecen
3. Establecer: $10, umbral 6 personas
4. Activar "Habilitar pre-orden"
5. ✅ Mensaje informativo aparece
6. Activar "Órdenes desde mesa"
7. ✅ Mensaje sobre códigos QR aparece
8. Verificar "Resumen de Configuración"
9. ✅ Todas las opciones activas muestran checkmark verde
10. ✅ Resumen muestra: "Anticipo: $10 para 6+ personas"
11. Guardar configuración
12. ✅ Mensaje de éxito aparece
13. Desactivar "Requiere anticipo"
14. ✅ Campos de monto/umbral desaparecen
15. ✅ Resumen actualiza: "Anticipo: Deshabilitado"

---

## 🧪 Pruebas E2E (Backend)

### Ejecutar Tests

```bash
cd back/api

# Todos los tests E2E
pnpm test:e2e

# Tests específicos de menú
pnpm test:e2e -- restaurants.e2e-spec.ts

# Tests de time slots (nota: hay un issue pre-existente con auth)
pnpm test:e2e -- time-slots.e2e-spec.ts
```

### Cobertura de Tests

**✅ Restaurantes:**

- CRUD completo
- Validaciones
- Multi-tenancy

**✅ Menú:**

- Categorías: crear, listar, actualizar, eliminar, reordenar
- Items: crear, listar, actualizar, eliminar, reordenar por categoría
- Validaciones de campos requeridos
- Protección por autenticación

**✅ Time Slots:**

- Tests escritos (17 casos)
- Cobertura: validación de formato, solapamiento, CRUD completo
- Nota: Hay un issue pre-existente con el formato de respuesta de auth

---

## 📊 Arquitectura Implementada

### Backend (NestJS)

```
src/restaurants/
├── entities/
│   ├── menu-category.entity.ts    ✅
│   ├── menu-item.entity.ts        ✅
│   └── time-slot.entity.ts        ✅
├── dto/
│   ├── create-menu-category.dto.ts    ✅
│   ├── create-menu-item.dto.ts        ✅
│   ├── create-time-slot.dto.ts        ✅
│   └── reorder-*.dto.ts               ✅
├── menu-categories.controller.ts  ✅
├── menu-categories.service.ts     ✅
├── menu-items.controller.ts       ✅
├── menu-items.service.ts          ✅
├── time-slots.controller.ts       ✅
└── time-slots.service.ts          ✅
```

**Características:**

- TypeORM entities con relaciones
- Validación con class-validator
- Soft deletes
- Reordenamiento optimista
- Detección de solapamiento de horarios
- Protección multi-tenant

### Frontend (Next.js 14)

```
fronts/apps/dashboard/src/
├── app/
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── menu/page.tsx          ✅
│   │       └── settings/page.tsx      ✅
│   └── login/page.tsx                 ✅ (fix aplicado)
├── components/
│   ├── menu/
│   │   ├── menu-category-card.tsx         ✅
│   │   ├── menu-item-card.tsx             ✅
│   │   ├── create-category-modal.tsx      ✅
│   │   └── create-item-modal.tsx          ✅
│   └── settings/
│       ├── general-settings-section.tsx       ✅
│       ├── opening-hours-section.tsx          ✅
│       ├── theme-settings-section.tsx         ✅
│       └── payment-settings-section.tsx       ✅
├── contexts/
│   └── auth-context.tsx               ✅ (auth fix)
└── middleware.ts                      ✅ (simplificado)
```

**Características:**

- @dnd-kit para drag & drop
- Client Components para interactividad
- Optimistic UI updates
- Manejo de errores con mensajes user-friendly
- Loading states
- Modales para creación/edición
- Protección de rutas client-side

---

## 🐛 Bugs Conocidos y Fixes Aplicados

### ✅ RESUELTO: Login no redirige

**Problema:**

- Después del login, se quedaba en la página de login
- Middleware server-side intentaba leer localStorage (imposible)

**Solución aplicada:**

- Middleware simplificado (solo pasa requests)
- Protección de rutas movida a client-side en el layout del dashboard
- Ahora el login redirige correctamente a `/dashboard`

**Archivos modificados:**

- `fronts/apps/dashboard/src/middleware.ts` - Simplificado
- `fronts/apps/dashboard/src/app/(dashboard)/layout.tsx` - Agregada protección client-side

### ✅ RESUELTO: TypeError con .toFixed() en decimales

**Problema:**

- TypeORM devuelve campos `decimal` como strings, no números
- Llamar `.toFixed()` en un string causaba error
- Afectaba: `item.price`, `restaurant.rating`

**Solución aplicada:**

- Envolver valores en `Number()` antes de llamar `.toFixed()`
- Ejemplos: `Number(item.price).toFixed(2)`, `Number(restaurant.rating).toFixed(1)`

**Archivos modificados:**

- `fronts/apps/dashboard/src/components/menu/item-card.tsx` - Fix en precio
- `fronts/apps/dashboard/src/app/(dashboard)/dashboard/restaurants/page.tsx` - Fix en rating (2 lugares)

### ⚠️ PENDIENTE: E2E tests de Time Slots

**Problema:**

- Los tests E2E fallan en el setup por formato de respuesta de auth
- Es un issue pre-existente, no específico de time slots

**Workaround:**

- Tests manuales en el dashboard funcionan correctamente
- APIs funcionan correctamente con Postman/curl

---

## ✅ Checklist de Completitud Sprint 3-4

### Backend

- [x] Entidades: MenuCategory, MenuItem, TimeSlot
- [x] DTOs con validaciones completas
- [x] Controllers con todos los endpoints
- [x] Services con lógica de negocio
- [x] Reordenamiento de categorías e items
- [x] Validación de solapamiento de horarios
- [x] E2E tests escritos
- [x] Migraciones aplicadas
- [x] Seeds actualizados

### Frontend

- [x] Página de menú con tabs
- [x] CRUD de categorías con drag & drop
- [x] CRUD de items con formularios completos
- [x] Página de configuración con 4 tabs
- [x] Sección de información general
- [x] Editor de horarios de apertura
- [x] Personalización de tema
- [x] Configuración de pagos y funcionalidades
- [x] Fix de autenticación aplicado
- [x] Protección de rutas implementada

### Documentación

- [x] Guía de pruebas completa
- [x] Ejemplos de APIs con curl
- [x] Instrucciones paso a paso para UI
- [x] Arquitectura documentada

---

## 🎯 Próximos Pasos Recomendados

1. **Probar flujo completo de login → menú → configuración**
2. **Verificar que todas las operaciones CRUD funcionan**
3. **Probar drag & drop en diferentes navegadores**
4. **Validar que los mensajes de error sean claros**
5. **Confirmar que los datos persisten correctamente**

Una vez validado todo, estarás listo para pasar a **Sprint 5-7** que incluye:

- Reservaciones con calendario
- Pre-orden desde reserva
- Sistema de notificaciones
- CRM básico

---

## 📞 Soporte

Si encuentras algún problema durante las pruebas:

1. Verificar que todos los servicios estén corriendo
2. Revisar logs del backend: `pnpm dev:api`
3. Revisar console del navegador para errores de frontend
4. Verificar que las migraciones se aplicaron: `pnpm migration:run`
5. Confirmar que el seed se ejecutó correctamente

**Base de datos limpia:**

```bash
cd back/api
pnpm migration:revert  # Revertir última migración
pnpm migration:run     # Volver a aplicar
pnpm seed              # Re-seedear datos
```
