# Booking App - Desarrollo Local

## 🏠 Dos Modos de Operación

### 1. Modo Marketplace (Sin Subdominio)

Accede a `http://localhost:3001` para ver el marketplace completo:

- Explorar todos los restaurantes
- Buscar y filtrar
- Ver restaurantes destacados
- Comparar opciones

### 2. Modo Restaurante Individual (Con Subdominio Simulado)

Para probar la vista de un restaurante específico en desarrollo local:

#### Opción A: Query Parameter (Recomendado)

```
http://localhost:3001/?restaurant=demo-restaurant
```

Donde `demo-restaurant` es el slug del restaurante que quieres ver.

#### Opción B: Modificar /etc/hosts (Simular Subdominio Real)

**En Windows:**

1. Abre `C:\Windows\System32\drivers\etc\hosts` como administrador
2. Agrega esta línea:
   ```
   127.0.0.1 demo-restaurant.localhost
   ```
3. Guarda el archivo
4. Accede a `http://demo-restaurant.localhost:3001`

**En Mac/Linux:**

1. Edita `/etc/hosts`:
   ```bash
   sudo nano /etc/hosts
   ```
2. Agrega:
   ```
   127.0.0.1 demo-restaurant.localhost
   ```
3. Guarda y accede a `http://demo-restaurant.localhost:3001`

---

## 🧪 Restaurante de Prueba

El restaurante de prueba creado por el seeder tiene:

```
Nombre: Demo Restaurant
Slug: demo-restaurant
URL Local: http://localhost:3001/?restaurant=demo-restaurant
```

### Datos del Restaurante Demo:

- **Nombre:** Demo Restaurant
- **Slug:** demo-restaurant
- **Cocina:** Internacional
- **Ciudad:** Ciudad de México
- **12 mesas** (4 personas cada una)
- **Menú completo** con categorías

---

## 🎯 Flujo de Testing

### Paso 1: Probar Marketplace

1. Ve a `http://localhost:3001`
2. Deberías ver la página de exploración
3. Busca "Demo Restaurant" o filtra por ciudad/cocina
4. Haz click en "Ver Restaurante y Reservar"

### Paso 2: Probar Vista Individual

1. Serás redirigido a `http://localhost:3001/?restaurant=demo-restaurant`
2. Deberías ver la página completa del restaurante
3. Prueba hacer una reserva (selecciona fecha, hora, personas)

### Paso 3: Probar Reservas

1. Selecciona una fecha (hoy o futuro)
2. Selecciona una hora disponible
3. Selecciona número de personas
4. Haz click en "Confirmar Reserva"
5. Deberías recibir confirmación (integración pendiente)

---

## 📝 Notas de Desarrollo

### Middleware

El middleware en `src/middleware.ts` detecta:

- Query param `?restaurant=slug` en desarrollo local
- Subdominios en producción (`slug.yumyum.com`)

### Componentes Principales

1. **page.tsx** - Marketplace / Exploración
2. **restaurant/page.tsx** - Vista individual de restaurante
3. **components/restaurant-card.tsx** - Card de restaurante
4. **components/restaurant-view.tsx** - Vista completa de restaurante

### API Endpoints Usados

```typescript
GET /api/restaurants              // Lista todos
GET /api/restaurants?city=...     // Filtrar por ciudad
GET /api/restaurants?cuisine=...  // Filtrar por cocina
GET /api/restaurants?search=...   // Buscar
GET /api/restaurants/slug/:slug   // Obtener por slug
```

---

## 🚀 Próximos Pasos

### Para Desarrollo

- [ ] Implementar login/registro de usuarios
- [ ] Guardar restaurantes favoritos
- [ ] Sistema de recomendaciones basado en preferencias
- [ ] Historial de reservas del usuario

### Para Producción

- [ ] Configurar DNS wildcards para subdominios
- [ ] Verificar SSL para subdominios dinámicos
- [ ] Optimizar carga de imágenes
- [ ] Implementar cache de restaurantes

---

## 🐛 Troubleshooting

### "No se encontraron restaurantes"

1. Verifica que el backend esté corriendo (`http://localhost:4000`)
2. Ejecuta el seed: `cd back/api && pnpm seed`
3. Verifica que PostgreSQL esté corriendo: `pnpm docker:up`

### "Restaurant not found"

1. Verifica que el slug sea correcto
2. Ejecuta el seed si no hay datos
3. Verifica logs del backend para errores

### Middleware no detecta subdominio

1. Verifica la configuración de hosts
2. Usa query param como alternativa
3. Revisa logs del navegador (Network tab)

---

## 📞 Contacto

Si encuentras problemas, revisa:

- Logs del backend: `back/api/` terminal
- Logs del frontend: Console del navegador
- Network tab: Requests a `/api/restaurants`

---

**Última actualización:** Diciembre 2025
