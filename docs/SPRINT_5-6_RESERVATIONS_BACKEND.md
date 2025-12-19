# Sistema de Reservas - Backend Completado ✅

## 🎯 Implementación Sprint 5-6

### Módulo de Reservas - Backend Completo

## ✅ Funcionalidades Implementadas

### 1. Endpoint de Disponibilidad (Real-Time) ✅

**Endpoint**: `GET /reservations/restaurants/:restaurantId/availability`

**Características**:

- Consulta disponibilidad en tiempo real
- Valida configuración del restaurante (minAdvanceBooking, maxAdvanceBooking)
- Genera slots cada 30 minutos basados en TimeSlots del restaurante
- Calcula disponibilidad por mesa considerando capacidad y partySize
- Verifica reservas existentes para cada slot
- Filtra slots en el pasado
- Retorna lista de slots con disponibilidad y razón si no disponible

**Request**:

```typescript
GET /reservations/restaurants/:restaurantId/availability?date=2025-12-25T19:00:00.000Z&partySize=4
```

**Response**:

```typescript
{
  success: true,
  data: {
    date: "2025-12-25T19:00:00.000Z",
    availableSlots: [
      {
        time: "19:00",
        available: true,
        tablesAvailable: 3
      },
      {
        time: "19:30",
        available: true,
        tablesAvailable: 2
      },
      {
        time: "20:00",
        available: false,
        tablesAvailable: 0,
        reason: "No tables available"
      }
    ]
  }
}
```

**Validaciones**:

- ✅ Restaurante activo y acepta reservas
- ✅ Party size dentro del límite máximo
- ✅ Fecha dentro del rango permitido (minAdvanceBooking - maxAdvanceBooking)
- ✅ Restaurante abierto ese día (basado en TimeSlots)

---

### 2. Validaciones de Horarios ✅

**Implementación**: `reservations.service.ts` - método `create()`

**Validaciones añadidas**:

1. **Validación de Fecha Pasada**:

   ```typescript
   if (reservationDate < now) {
     throw new BadRequestException('Cannot create reservation in the past');
   }
   ```

2. **Validación de Advance Booking**:

   ```typescript
   const minDate = addMinutes(now, minAdvanceBooking * 60);
   const maxDate = addMinutes(now, maxAdvanceBooking * 24 * 60);

   if (reservationDate < minDate) {
     throw new BadRequestException(
       `Reservations must be made at least ${minAdvanceBooking} hours in advance`
     );
   }
   ```

3. **Validación de Horario de Apertura**:

   ```typescript
   // Obtener día de la semana
   const dayOfWeek = ['sunday', 'monday', ...][getDay(reservationDate)];

   // Buscar time slots activos para ese día
   const openTimeSlots = await this.timeSlotRepository.find({
     where: { restaurantId, dayOfWeek, isActive: true },
   });

   // Verificar si la hora de reserva cae dentro de algún time slot
   if (!isWithinTimeSlot) {
     throw new BadRequestException('Restaurant is closed at this time');
   }
   ```

4. **Validación de Día Cerrado**:
   ```typescript
   if (openTimeSlots.length === 0) {
     throw new BadRequestException('Restaurant is closed on this day');
   }
   ```

---

### 3. Locks y Transacciones (Race Conditions) ✅

**Implementación**: Transacciones SERIALIZABLE con Pessimistic Locks

**Nivel de Aislamiento**: `SERIALIZABLE`

- Máximo nivel de aislamiento
- Previene phantom reads, non-repeatable reads, dirty reads
- Garantiza consistencia total

**Locks Implementados**:

1. **Pessimistic Write Lock en Table**:

   ```typescript
   const table = await transactionalEntityManager.findOne(Table, {
     where: { id: tableId, restaurantId },
     lock: { mode: 'pessimistic_write' },
   });
   ```

   - Bloquea la mesa para escritura
   - Otras transacciones deben esperar

2. **Pessimistic Read Lock en Conflicting Reservations**:
   ```typescript
   const conflictingReservations = await transactionalEntityManager.count(Reservation, {
     where: {
       tableId,
       reservationDate: Between(startTime, endTime),
       status: Between(CONFIRMED, SEATED),
     },
     lock: { mode: 'pessimistic_read' },
   });
   ```

   - Evita que otras transacciones modifiquen reservas conflictivas durante la lectura
   - Si hay conflictos, lanza `ConflictException`

**Flujo de Transacción**:

```typescript
return await this.dataSource.transaction('SERIALIZABLE', async transactionalEntityManager => {
  // 1. Lock table
  // 2. Check conflicting reservations with lock
  // 3. Create reservation
  // 4. Save reservation
  // 5. Commit automático si todo OK
  // 6. Rollback automático si hay error
});
```

**Beneficios**:

- ❌ **Sin locks**: 2 usuarios pueden reservar la misma mesa simultáneamente
- ✅ **Con locks**: Solo 1 usuario consigue la reserva, el otro recibe error de conflicto

---

### 4. Módulo Customers con Auto-Creación ✅

**Problema Resuelto**: Permitir reservas sin registro previo

**Implementación**: `reservations.service.ts` - método `create()`

**Flujo de Auto-Creación**:

```typescript
// 1. Si NO hay customerId (usuario no autenticado)
if (!customerId && createReservationDto.customerEmail) {
  // 2. Buscar si ya existe un customer con ese email
  let customer = await this.userRepository.findOne({
    where: { email: createReservationDto.customerEmail },
  });

  // 3. Si NO existe, crear nuevo customer
  if (!customer) {
    const [firstName, ...lastNameParts] = customerName.split(' ');
    customer = await this.usersService.create({
      email: customerEmail,
      password: Math.random().toString(36).slice(-8), // Password temporal
      firstName: firstName || 'Customer',
      lastName: lastNameParts.join(' ') || '',
      phone: customerPhone,
      role: UserRole.CUSTOMER,
    });
  }

  // 4. Usar el customerId encontrado o creado
  finalCustomerId = customer.id;
}
```

**Características**:

- ✅ Evita duplicados: Busca primero por email
- ✅ Crea User con role `CUSTOMER` automáticamente
- ✅ Password temporal aleatorio
- ✅ Asocia reserva al customer automáticamente
- ✅ Permite rastrear historial de reservas por customer

**Casos de Uso**:

1. **Usuario Anónimo**: Primera reserva → Crea customer
2. **Usuario Anónimo Recurrente**: Segunda reserva → Usa customer existente
3. **Usuario Autenticado**: Usa customerId del token JWT

---

### 5. WebSocket para Updates en Tiempo Real ✅

**Implementación**: `EventsGateway` + Integration en `ReservationsService`

#### Eventos Implementados

**Gateway (`events.gateway.ts`)**:

```typescript
// Eventos de reservas
emitReservationCreated(restaurantId, reservation); // Nueva reserva
emitReservationUpdated(restaurantId, reservation); // Reserva actualizada
emitReservationCancelled(restaurantId, reservation); // Reserva cancelada
emitReservationConfirmed(restaurantId, reservation); // Reserva confirmada
emitReservationSeated(restaurantId, reservation); // Cliente sentado
emitReservationCompleted(restaurantId, reservation); // Reserva completada
emitReservationNoShow(restaurantId, reservation); // Cliente no apareció
```

#### Room Management

**Join Restaurant Room**:

```javascript
// Cliente se suscribe a updates del restaurante
socket.emit('join:restaurant', 'restaurant-uuid-123');
```

**Leave Restaurant Room**:

```javascript
// Cliente se desuscribe
socket.emit('leave:restaurant', 'restaurant-uuid-123');
```

#### Integración en Service

**Cada método de estado emite evento**:

```typescript
// Ejemplo: create()
const savedReservation = await transactionalEntityManager.save(reservation);
this.eventsGateway.emitReservationCreated(restaurantId, savedReservation);
return savedReservation;
```

#### Uso en Frontend

**Conexión**:

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

// Unirse al room del restaurante
socket.emit('join:restaurant', restaurantId);

// Escuchar eventos
socket.on('reservation:created', data => {
  console.log('Nueva reserva:', data.reservation);
  // Actualizar lista de reservas en UI
});

socket.on('reservation:confirmed', data => {
  console.log('Reserva confirmada:', data.reservation);
  // Actualizar estado en UI
});
```

**Beneficios**:

- ✅ Dashboard actualiza automáticamente cuando llegan reservas nuevas
- ✅ Múltiples staff members ven cambios en tiempo real
- ✅ No necesita polling (refresh manual)
- ✅ Isolado por restaurante (multi-tenant seguro)

---

## 📊 Endpoints Completos

### Reservas

| Método    | Endpoint                                               | Auth              | Descripción                   |
| --------- | ------------------------------------------------------ | ----------------- | ----------------------------- |
| **POST**  | `/reservations/restaurants/:restaurantId`              | Public            | Crear reserva                 |
| **GET**   | `/reservations`                                        | Protected         | Listar reservas (con filtros) |
| **GET**   | `/reservations/my-reservations`                        | Protected         | Mis reservas                  |
| **GET**   | `/reservations/:id`                                    | Protected         | Detalle de reserva            |
| **PATCH** | `/reservations/:id`                                    | Protected         | Actualizar reserva            |
| **POST**  | `/reservations/:id/cancel`                             | Protected         | Cancelar reserva              |
| **POST**  | `/reservations/:id/confirm`                            | Owner/Staff/Admin | Confirmar reserva             |
| **POST**  | `/reservations/:id/seat`                               | Owner/Staff/Admin | Sentar cliente                |
| **POST**  | `/reservations/:id/complete`                           | Owner/Staff/Admin | Completar reserva             |
| **POST**  | `/reservations/:id/no-show`                            | Owner/Staff/Admin | Marcar no-show                |
| **GET**   | `/reservations/restaurants/:restaurantId/availability` | Public            | Verificar disponibilidad      |

### Filtros en GET /reservations

```
?restaurantId=uuid      # Filtrar por restaurante
&customerId=uuid        # Filtrar por cliente
&status=confirmed       # Filtrar por estado
&date=2025-12-25        # Filtrar por fecha
&page=1                 # Paginación
&limit=10               # Items por página
```

---

## 🔒 Autorización por Endpoint

### Public Endpoints (No requieren auth)

- ✅ `POST /reservations/restaurants/:restaurantId` - Crear reserva
- ✅ `GET /reservations/restaurants/:restaurantId/availability` - Ver disponibilidad

### Protected Endpoints (Requieren JWT)

- 🔐 `GET /reservations` - Ver reservas (filtrado por permisos)
- 🔐 `GET /reservations/my-reservations` - Ver mis reservas
- 🔐 `GET /reservations/:id` - Ver detalle
- 🔐 `PATCH /reservations/:id` - Actualizar (solo owner/customer/admin)
- 🔐 `POST /reservations/:id/cancel` - Cancelar (solo owner/customer/admin)

### Owner/Staff/Admin Only

- 👔 `POST /reservations/:id/confirm` - Confirmar
- 👔 `POST /reservations/:id/seat` - Sentar
- 👔 `POST /reservations/:id/complete` - Completar
- 👔 `POST /reservations/:id/no-show` - Marcar no-show

---

## 🧪 Cómo Probar

### 1. Verificar Disponibilidad

```bash
curl -X GET \
  'http://localhost:4000/api/reservations/restaurants/RESTAURANT_ID/availability?date=2025-12-25T19:00:00.000Z&partySize=4'
```

### 2. Crear Reserva (Usuario Anónimo)

```bash
curl -X POST \
  http://localhost:4000/api/reservations/restaurants/RESTAURANT_ID \
  -H 'Content-Type: application/json' \
  -d '{
    "reservationDate": "2025-12-25T19:00:00.000Z",
    "partySize": 4,
    "customerName": "Juan Pérez",
    "customerEmail": "juan@example.com",
    "customerPhone": "+34 600 000 000",
    "specialRequests": "Mesa cerca de la ventana"
  }'
```

**✅ Resultado**: Se crea automáticamente un customer con ese email si no existe

### 3. Listar Reservas de un Restaurante

```bash
# Necesitas token JWT de owner/staff/admin
curl -X GET \
  'http://localhost:4000/api/reservations?restaurantId=RESTAURANT_ID&date=2025-12-25' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

### 4. Confirmar Reserva (Owner)

```bash
curl -X POST \
  http://localhost:4000/api/reservations/RESERVATION_ID/confirm \
  -H 'Authorization: Bearer OWNER_JWT_TOKEN'
```

**✅ Resultado**: WebSocket emite `reservation:confirmed` a todos conectados al room del restaurante

### 5. Probar Race Condition (Locks)

**Terminal 1**:

```bash
curl -X POST http://localhost:4000/api/reservations/restaurants/RES_ID \
  -H 'Content-Type: application/json' \
  -d '{"reservationDate": "2025-12-25T19:00:00.000Z", "partySize": 4, "tableId": "TABLE_ID", ...}' &
```

**Terminal 2** (inmediatamente):

```bash
curl -X POST http://localhost:4000/api/reservations/restaurants/RES_ID \
  -H 'Content-Type: application/json' \
  -d '{"reservationDate": "2025-12-25T19:00:00.000Z", "partySize": 4, "tableId": "TABLE_ID", ...}' &
```

**✅ Esperado**:

- Primera request: `201 Created`
- Segunda request: `409 Conflict - Table is not available at this time`

### 6. Probar WebSocket

```javascript
// En navegador o Node.js
const socket = io('http://localhost:4000');

socket.emit('join:restaurant', 'RESTAURANT_ID');

socket.on('reservation:created', data => {
  console.log('¡Nueva reserva!', data.reservation);
});

// Ahora crea una reserva desde otra pestaña/terminal
// Verás el evento en tiempo real
```

---

## 🎯 Flujo Completo de Reserva

### Desde Booking App (Cliente)

```
1. Cliente navega a booking.yumyum.com/la-bella-italia
   ↓
2. Selecciona fecha, hora, número de personas
   ↓
3. Frontend llama: GET /reservations/restaurants/RES_ID/availability
   ↓
4. Backend calcula slots disponibles (con validaciones)
   ↓
5. Frontend muestra slots verdes (available) y rojos (no available)
   ↓
6. Cliente selecciona slot, ingresa datos (nombre, email, teléfono)
   ↓
7. Frontend llama: POST /reservations/restaurants/RES_ID
   ↓
8. Backend:
   - Valida datos y horarios
   - Auto-crea customer si no existe
   - Usa transacción SERIALIZABLE con locks
   - Verifica disponibilidad final
   - Crea reserva
   - Emite WebSocket event 'reservation:created'
   ↓
9. Cliente recibe confirmación con código (ej: "ABC123")
```

### Desde Dashboard App (Owner)

```
1. Owner abre dashboard.yumyum.com/dashboard/reservations
   ↓
2. Frontend conecta WebSocket: socket.emit('join:restaurant', restaurantId)
   ↓
3. Frontend llama: GET /reservations?restaurantId=RES_ID&date=today
   ↓
4. Backend devuelve lista de reservas del día
   ↓
5. Frontend muestra lista con estados (Pending, Confirmed, Seated, etc.)
   ↓
6. [TIEMPO REAL] Llega nueva reserva desde Booking App
   ↓
7. WebSocket emite: 'reservation:created'
   ↓
8. Dashboard actualiza lista automáticamente (sin refresh)
   ↓
9. Owner ve nueva reserva, click en "Confirmar"
   ↓
10. Frontend llama: POST /reservations/RES_ID/confirm
    ↓
11. Backend actualiza estado, emite 'reservation:confirmed'
    ↓
12. Dashboard actualiza estado en UI
    ↓
13. Cliente llega al restaurante, owner click "Sentar"
    ↓
14. Frontend llama: POST /reservations/RES_ID/seat
    ↓
15. WebSocket emite 'reservation:seated'
    ↓
16. Cliente termina, owner click "Completar"
    ↓
17. WebSocket emite 'reservation:completed'
```

---

## 🏗️ Arquitectura Técnica

### Entidades Relacionadas

```
Reservation
├── restaurantId (FK → Restaurant)
├── customerId (FK → User) [nullable, auto-creado]
├── tableId (FK → Table) [nullable]
├── reservationDate (timestamp with timezone)
├── partySize (integer)
├── status (enum: pending, confirmed, seated, completed, cancelled, no_show)
├── customerName, customerEmail, customerPhone (strings)
├── confirmationCode (string, único)
├── specialRequests, notes (text)
└── timestamps (confirmedAt, seatedAt, completedAt, cancelledAt)
```

### Flujo de Estados

```
       PENDING
          ↓ (owner confirma)
      CONFIRMED
          ↓ (cliente llega)
       SEATED
          ↓ (cliente termina)
     COMPLETED

Desde cualquier estado (excepto COMPLETED):
  ↓ (cancelación)
CANCELLED

Desde CONFIRMED:
  ↓ (cliente no llega)
 NO_SHOW
```

### Índices de Base de Datos

```sql
-- Para queries por restaurante y fecha (muy frecuente)
CREATE INDEX idx_reservations_restaurant_date
ON reservations(restaurantId, reservationDate);

-- Para queries por cliente
CREATE INDEX idx_reservations_customer
ON reservations(customerId);

-- Para queries por estado y fecha (dashboard filters)
CREATE INDEX idx_reservations_status_date
ON reservations(status, reservationDate);
```

---

## 📈 Optimizaciones Implementadas

### 1. Transacciones Solo Cuando Necesario

- ✅ `create()`: Usa transacción (race conditions críticas)
- ❌ `findAll()`: No usa transacción (solo lectura)
- ❌ `findOne()`: No usa transacción (solo lectura)

### 2. Locks Granulares

- Solo lockea la **mesa específica** (no todas las mesas)
- Solo lockea **reservas conflictivas** (no todas las reservas)

### 3. Validaciones Tempranas

- Valida restaurante activo ANTES de transacción
- Valida horarios ANTES de lockear mesas
- Ahorra locks innecesarios

### 4. WebSocket con Rooms

- Eventos solo a clientes suscritos al restaurante específico
- No broadcast global (eficiente)

---

## ✅ Checklist de Completitud

### Backend (Completado)

- [x] ✅ Endpoint GET /availability con cálculo real-time
- [x] ✅ Validaciones de horarios del restaurante
- [x] ✅ Validaciones de advance booking (min/max)
- [x] ✅ Validaciones de party size
- [x] ✅ Transacciones SERIALIZABLE en create
- [x] ✅ Pessimistic locks para evitar race conditions
- [x] ✅ Auto-creación de customers
- [x] ✅ WebSocket events para todos los cambios de estado
- [x] ✅ Endpoints CRUD completos
- [x] ✅ Autorización por roles
- [x] ✅ Filtros en listado de reservas
- [x] ✅ Compilación exitosa

---

## 🚀 Próximos Pasos (Frontend - Sprint 5-6)

### Booking App

- [ ] Formulario de reserva
- [ ] Selector de fecha/hora con disponibilidad
- [ ] Validación de campos
- [ ] Confirmación con código
- [ ] Email de confirmación (opcional)

### Dashboard App

- [ ] Lista de reservas del día
- [ ] Calendario de reservas
- [ ] Filtros por estado/fecha
- [ ] Botones de acciones (confirmar, sentar, completar, cancelar, no-show)
- [ ] Conexión WebSocket para updates en tiempo real
- [ ] Notificaciones de nuevas reservas

---

**Estado**: ✅ Backend 100% Completado
**Compilación**: ✅ Exitosa
**Próximo paso**: Implementar frontend de reservas en Booking y Dashboard
