# YumYum Booking App

Aplicación pública para exploración y reservas de restaurantes. Funciona como un marketplace estilo TripAdvisor cuando se accede sin subdominio, y como página dedicada del restaurante cuando se accede con subdominio.

## 🌟 Características

### Modo Marketplace (sin subdominio)

- 🔍 **Búsqueda y Filtros:** Encuentra restaurantes por nombre, ciudad o tipo de cocina
- ⭐ **Restaurantes Destacados:** Ve los mejores calificados primero
- 📊 **Comparación:** Compara ratings, precios y ubicaciones
- 🎯 **Recomendaciones:** Descubre nuevos lugares basados en tus preferencias
- 📱 **Responsive:** Funciona perfectamente en móvil y desktop

### Modo Restaurante Individual (con subdominio)

- 🍽️ **Vista Dedicada:** Página personalizada para cada restaurante
- 🎨 **Temas Personalizables:** Colores y logo del restaurante
- 📅 **Sistema de Reservas:** Reserva mesas en tiempo real
- 📍 **Información Completa:** Ubicación, horarios, contacto
- ⭐ **Reseñas:** Ve qué dicen otros comensales

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+
- pnpm
- Backend corriendo en `http://localhost:4000`
- PostgreSQL con datos seed

### Instalación

```bash
# Desde la raíz del monorepo
pnpm install

# Iniciar solo la app de booking
pnpm --filter @yumyum/booking dev

# O iniciar todas las apps
pnpm dev
```

### Configuración

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env.local
```

2. Configura las variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 📖 Uso

### Desarrollo Local

#### Ver Marketplace

```
http://localhost:3001
```

#### Ver Restaurante Específico

```
http://localhost:3001/?restaurant=demo-restaurant
```

### Producción

#### Marketplace Principal

```
https://yumyum.com
```

#### Restaurantes Individuales

```
https://demo-restaurant.yumyum.com
https://pizzeria-roma.yumyum.com
https://sushi-master.yumyum.com
```

## 🏗️ Estructura del Proyecto

```
fronts/apps/booking/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Marketplace (landing)
│   │   ├── restaurant/
│   │   │   └── page.tsx          # Vista individual de restaurante
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── restaurant-card.tsx   # Card de restaurante
│   │   └── restaurant-view.tsx   # Vista completa de restaurante
│   ├── lib/
│   │   └── api.ts                # Cliente API (Axios)
│   ├── hooks/
│   │   └── useSocket.ts          # WebSocket hook
│   └── middleware.ts             # Detección de subdominios
├── public/
│   └── logo.svg                  # Logo de YumYum
├── DEVELOPMENT.md                # Guía de desarrollo
├── README.md                     # Este archivo
└── package.json
```

## 🎨 Temas y Personalización

Cada restaurante puede personalizar:

```typescript
theme: {
  primaryColor: '#f97316',    // Color principal
  secondaryColor: '#fbbf24',  // Color secundario
  logo: 'https://...',        // URL del logo
}
```

Los colores se aplican automáticamente a:

- Header del restaurante
- Botones de acción
- Gradientes
- Highlights

## 🔧 Componentes Principales

### RestaurantCard

Muestra un restaurante en formato card.

```tsx
<RestaurantCard restaurant={restaurantData} />
```

**Props:**

- `restaurant`: Objeto con datos del restaurante
  - `id`, `name`, `slug`, `description`
  - `city`, `cuisine`, `rating`, `reviewCount`
  - `priceRange`, `images`, `isActive`, `isFeatured`

### RestaurantView

Vista completa de un restaurante individual.

```tsx
<RestaurantView restaurant={restaurantData} />
```

**Props:**

- `restaurant`: Objeto completo del restaurante
  - Incluye `theme`, `settings`, `openingHours`

## 🌐 Subdominios

### ¿Cómo Funcionan?

El middleware detecta el subdominio y:

1. Extrae el slug del hostname
2. Pasa el slug via header `x-restaurant-slug`
3. Reescribe la ruta a `/restaurant`
4. La página fetch datos del restaurante por slug

### Desarrollo Local

**Opción 1: Query Parameter**

```
http://localhost:3001/?restaurant=demo-restaurant
```

**Opción 2: Hosts File**

```
# Agregar a /etc/hosts (Mac/Linux) o C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 demo-restaurant.localhost

# Acceder a
http://demo-restaurant.localhost:3001
```

## 📊 API Integration

### Endpoints Usados

```typescript
// Listar restaurantes
GET /api/restaurants?city=...&cuisine=...&search=...

// Obtener por slug
GET /api/restaurants/slug/:slug

// Crear reserva
POST /api/reservations/restaurants/:id

// Ver horarios disponibles
GET /api/restaurants/:id/availability?date=...
```

## 🧪 Testing

### Testing Manual

1. **Marketplace:**
   - Visita `http://localhost:3001`
   - Prueba búsqueda por nombre
   - Filtra por ciudad y cocina
   - Verifica cards de restaurantes

2. **Vista Individual:**
   - Accede con `?restaurant=demo-restaurant`
   - Verifica tema personalizado
   - Prueba sistema de reservas
   - Verifica información del restaurante

### Datos de Prueba

El seed crea un restaurante demo:

```
Nombre: Demo Restaurant
Slug: demo-restaurant
Ciudad: Ciudad de México
Cocina: Internacional
Mesas: 12 (4 personas cada una)
```

## 🚀 Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio
2. Configura variables de entorno:
   ```
   NEXT_PUBLIC_API_URL=https://api.yumyum.com/api
   ```
3. Configura dominios:
   - Dominio principal: `yumyum.com`
   - Wildcard: `*.yumyum.com`

4. Deploy:
   ```bash
   vercel --prod
   ```

### Configuración DNS

Para subdominios wildcard:

```
Type    Name    Value               TTL
A       @       76.76.21.21        Auto
A       *       76.76.21.21        Auto
CNAME   www     cname.vercel-dns.com  Auto
```

## 🔐 Seguridad

- ✅ Input sanitization
- ✅ CORS configurado
- ✅ Rate limiting (preparado)
- ✅ XSS protection
- ✅ SSL enforced en producción

## 📱 Responsive Design

Breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Optimizaciones:

- Imágenes lazy loading
- Grid responsivo
- Touch-friendly buttons
- Mobile-first approach

## 🎯 Próximas Funcionalidades

- [ ] Login/Registro de usuarios
- [ ] Favoritos y listas guardadas
- [ ] Recomendaciones personalizadas
- [ ] Sistema de reviews
- [ ] Historial de reservas
- [ ] Notificaciones push
- [ ] Integración con mapas
- [ ] Compartir en redes sociales

## 🐛 Troubleshooting

### No se muestran restaurantes

1. Verifica que el backend esté corriendo
2. Ejecuta el seed: `cd back/api && pnpm seed`
3. Revisa la consola para errores de API

### Subdominio no funciona en local

1. Usa query parameter: `?restaurant=slug`
2. Verifica configuración de hosts
3. Limpia caché del navegador

### Error de CORS

1. Verifica `NEXT_PUBLIC_API_URL`
2. Asegúrate que el backend acepte requests de `localhost:3001`
3. Revisa configuración de CORS en backend

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Axios](https://axios-http.com/docs/intro)

## 📝 Licencia

Parte del proyecto YumYum SaaS.

---

**Última actualización:** Diciembre 2025
