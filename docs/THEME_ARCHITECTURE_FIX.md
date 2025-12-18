# Corrección de Arquitectura de Temas (White-Label)

## 🎯 Problema Identificado

**Feedback del usuario**: "property theme should not exist"

El tema estaba implementado como una propiedad de nivel superior `restaurant.theme`, pero esto no coincidía con la arquitectura de la entidad. El tema debe estar anidado dentro de `restaurant.settings.theme`.

## 🔧 Cambios Realizados

### 1. Backend - Entidad Restaurant

**Archivo**: `back/api/src/restaurants/entities/restaurant.entity.ts`

**Cambios**:

- Añadida interfaz `ThemeSettings` con `primaryColor`, `secondaryColor`, `fontFamily`
- Integrado `theme?: ThemeSettings` dentro de `RestaurantSettings`
- Añadidos campos faltantes: `depositThreshold`, `enablePreOrder`, `enableTableOrdering`

**Estructura correcta**:

```typescript
export interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export interface RestaurantSettings {
  // Reservation settings
  acceptReservations: boolean;
  requireDeposit: boolean;
  depositAmount?: number;
  depositThreshold?: number;
  cancellationPolicy: string;
  maxPartySize: number;
  minAdvanceBooking: number;
  maxAdvanceBooking: number;
  autoConfirmReservations?: boolean;
  allowWaitlist?: boolean;

  // Feature flags
  enablePreOrder?: boolean;
  enableTableOrdering?: boolean;

  // White-label theme (ANIDADO AQUÍ)
  theme?: ThemeSettings;
}

@Entity('restaurants')
export class Restaurant extends BaseEntity {
  // ... otros campos ...

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string; // ← Nivel superior

  @Column({ type: 'varchar', length: 255, nullable: true })
  coverImage?: string; // ← Nivel superior (antes heroImage)

  @Column({ type: 'jsonb', nullable: true })
  settings?: RestaurantSettings; // ← Contiene theme anidado
}
```

### 2. Backend - Seed

**Archivo**: `back/api/src/database/seeds/restaurant.seeder.ts`

**Cambios**:

```typescript
settings: {
  acceptReservations: true,
  requireDeposit: false,
  depositAmount: 10,
  depositThreshold: 6,
  cancellationPolicy: '24h',
  maxPartySize: 12,
  minAdvanceBooking: 1,
  maxAdvanceBooking: 60,
  enablePreOrder: false,
  enableTableOrdering: false,
  theme: {  // ← Anidado dentro de settings
    primaryColor: '#0ea5e9', // sky-500
    secondaryColor: '#06b6d4', // cyan-500
    fontFamily: 'Inter',
  },
},
```

### 3. Frontend - Dashboard (Settings)

**Archivo**: `fronts/apps/dashboard/src/components/settings/theme-settings-section.tsx`

**Cambios en fetch**:

```typescript
// ANTES:
const restaurantTheme = response.data.data.restaurant.theme || {};

// DESPUÉS:
const restaurant = response.data.data.restaurant;
const restaurantTheme = restaurant.settings?.theme || {};
setTheme({
  primaryColor: restaurantTheme.primaryColor || '#0ea5e9',
  secondaryColor: restaurantTheme.secondaryColor || '#06b6d4',
  logo: restaurant.logo || '', // ← Nivel superior
  heroImage: restaurant.coverImage || '', // ← Nivel superior
  fontFamily: restaurantTheme.fontFamily || 'Inter',
});
```

**Cambios en save**:

```typescript
// ANTES:
await api.patch(`/restaurants/${restaurantId}`, { theme });

// DESPUÉS:
const response = await api.get(`/restaurants/${restaurantId}`);
const currentSettings = response.data.data.restaurant.settings || {};

await api.patch(`/restaurants/${restaurantId}`, {
  logo: theme.logo || null, // ← Guardar en nivel superior
  coverImage: theme.heroImage || null, // ← Guardar en nivel superior
  settings: {
    ...currentSettings, // ← Preservar settings existentes
    theme: {
      // ← Guardar colores/fuente en settings.theme
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      fontFamily: theme.fontFamily,
    },
  },
});
```

### 4. Frontend - Booking (Visualización)

**Archivo**: `fronts/apps/booking/src/app/[slug]/page.tsx`

**Cambios en interfaces**:

```typescript
// ANTES:
interface RestaurantTheme {
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
  heroImage?: string;
  fontFamily?: string;
}

interface Restaurant {
  theme?: RestaurantTheme;
  // ...
}

// DESPUÉS:
interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

interface RestaurantSettings {
  theme?: ThemeSettings;
  [key: string]: any;
}

interface Restaurant {
  logo?: string; // ← Nivel superior
  coverImage?: string; // ← Nivel superior
  settings?: RestaurantSettings; // ← Contiene theme
  // ...
}
```

**Cambios en aplicación de tema**:

```typescript
// ANTES:
const theme = restaurant.theme || {};
const primaryColor = theme.primaryColor || '#f97316';
// ...
background: theme.heroImage ? `url(${theme.heroImage})` : gradient;
{(theme.logo || restaurant.logo) && <img src={theme.logo || restaurant.logo} />}

// DESPUÉS:
const theme = restaurant.settings?.theme || {};  // ← Desde settings
const primaryColor = theme.primaryColor || '#f97316';
// ...
background: restaurant.coverImage ? `url(${restaurant.coverImage})` : gradient;  // ← coverImage
{restaurant.logo && <img src={restaurant.logo} />}  // ← Solo logo de nivel superior
```

## 📊 Arquitectura Final

### Separación de Responsabilidades

1. **Nivel Superior del Restaurant**:
   - `logo`: URL del logo del restaurante
   - `coverImage`: URL de la imagen de portada/hero

2. **Dentro de `settings.theme`**:
   - `primaryColor`: Color principal del tema
   - `secondaryColor`: Color secundario del tema
   - `fontFamily`: Fuente tipográfica

### Flujo de Datos

```
Dashboard Settings
      ↓
   [Usuario edita tema]
      ↓
   PATCH /restaurants/:id
      {
        logo: "url",
        coverImage: "url",
        settings: {
          ...otherSettings,
          theme: {
            primaryColor: "#color",
            secondaryColor: "#color",
            fontFamily: "font"
          }
        }
      }
      ↓
   PostgreSQL (JSONB)
      ↓
   GET /restaurants/slug/:slug
      ↓
   Booking App aplica tema
```

## ✅ Estado de Compilación

- ✅ **Backend**: Compilado exitosamente
- ✅ **Dashboard**: Compilado exitosamente
- ✅ **Booking**: Compilado exitosamente
- ✅ **Seed**: Actualizado con nueva estructura

## 🧪 Cómo Probar

### 1. Actualizar Restaurante Existente (Si es necesario)

Si el restaurante "La Bella Italia" ya existe en la base de datos con la estructura antigua, puedes actualizarlo de dos formas:

**Opción A: Via Dashboard UI (Recomendado)**

1. Accede al Dashboard: http://localhost:3002/login
2. Ve a Configuración → Tema
3. Actualiza los colores/logo/imagen
4. Guarda los cambios

**Opción B: Via SQL Directo**

```sql
UPDATE restaurants
SET settings = jsonb_set(
  COALESCE(settings, '{}'::jsonb),
  '{theme}',
  '{"primaryColor": "#0ea5e9", "secondaryColor": "#06b6d4", "fontFamily": "Inter"}'::jsonb
)
WHERE slug = 'la-bella-italia';
```

### 2. Verificar en Booking

1. Accede a: http://localhost:3001/la-bella-italia
2. **Verificar**:
   - Colores del gradiente aplican correctamente
   - Logo aparece (si está configurado)
   - Hero image aparece (si está configurado)
   - Fuente tipográfica aplica correctamente

### 3. Probar Actualización de Tema

1. En Dashboard → Configuración → Tema:
   - Cambiar color principal a naranja (#f97316)
   - Cambiar color secundario a amarillo (#fbbf24)
   - Añadir URL de logo
   - Añadir URL de imagen de portada
   - Cambiar fuente a "Poppins"
   - Guardar

2. Verificar en Booking que los cambios se reflejan

## 🔄 Migración de Datos Existentes

Si tienes restaurantes en producción con la estructura antigua (`theme` como top-level property), necesitarás ejecutar una migración:

```sql
-- Mover theme de nivel superior a settings.theme
UPDATE restaurants
SET
  settings = jsonb_set(
    COALESCE(settings, '{}'::jsonb),
    '{theme}',
    jsonb_build_object(
      'primaryColor', theme->'primaryColor',
      'secondaryColor', theme->'secondaryColor',
      'fontFamily', theme->'fontFamily'
    )
  ),
  logo = theme->'logo',
  coverImage = theme->'heroImage'
WHERE theme IS NOT NULL;

-- Remover la columna theme si existe (esto requeriría una migración TypeORM)
```

## 📝 Notas Importantes

1. **JSONB en PostgreSQL**: `settings` es un campo JSONB, lo que permite almacenar estructura JSON anidada de forma eficiente
2. **Retrocompatibilidad**: El código siempre usa `|| {}` para manejar casos donde `settings` o `settings.theme` sean null
3. **Validación**: Considera añadir DTOs para validar la estructura de theme en futuras actualizaciones
4. **Defaults**: Siempre se proporcionan colores y fuente por defecto si no están configurados

## ✨ Beneficios de la Nueva Arquitectura

1. ✅ **Consistencia**: Theme ahora está donde debe estar (en settings)
2. ✅ **Extensibilidad**: Fácil añadir más opciones de tema sin contaminar el nivel superior
3. ✅ **Claridad**: Separación clara entre assets (logo, coverImage) y configuración (theme)
4. ✅ **Type Safety**: Interfaces TypeScript reflejan la estructura real de la base de datos
5. ✅ **Mantenibilidad**: Un solo lugar para toda la configuración del restaurante

---

**Fecha de corrección**: 2025-12-18
**Archivos modificados**: 4 archivos (1 backend, 1 seed, 2 frontend)
**Status**: ✅ Completado y compilado
