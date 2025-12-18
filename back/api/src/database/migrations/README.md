# Database Migrations

Este directorio contiene todas las migraciones de base de datos para YumYum API.

## Prerrequisitos

Antes de ejecutar las migraciones, asegúrate de que:

1. PostgreSQL esté instalado y ejecutándose
2. La base de datos `yumyum_db` (o la que hayas configurado en `.env`) esté creada
3. Las variables de entorno estén configuradas correctamente en `.env`

## Crear la Base de Datos

Si aún no has creado la base de datos:

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE yumyum_db;

# Crear usuario (opcional)
CREATE USER yumyum WITH ENCRYPTED PASSWORD 'yumyum123';
GRANT ALL PRIVILEGES ON DATABASE yumyum_db TO yumyum;

# Salir
\q
```

## Generar una Nueva Migración

### Método 1: Generar automáticamente desde las entidades

Este método compara tus entidades TypeORM con el esquema actual de la base de datos y genera automáticamente la migración:

```bash
# Desde la raíz del proyecto
pnpm --filter @yumyum/api migration:generate src/database/migrations/InitialSchema

# O desde back/api
pnpm migration:generate src/database/migrations/InitialSchema
```

El nombre `InitialSchema` puede ser cualquier nombre descriptivo para tu migración.

### Método 2: Crear una migración vacía

Si necesitas escribir una migración personalizada:

```bash
pnpm --filter @yumyum/api migration:create src/database/migrations/CustomMigration
```

## Ejecutar Migraciones

Para aplicar todas las migraciones pendientes:

```bash
# Desde la raíz
pnpm --filter @yumyum/api migration:run

# O desde back/api
pnpm migration:run
```

Este comando:

- Ejecuta todas las migraciones que aún no se han aplicado
- Crea la tabla `migrations` si no existe
- Registra cada migración ejecutada

## Revertir Migraciones

Para revertir la última migración ejecutada:

```bash
pnpm --filter @yumyum/api migration:revert
```

Para revertir múltiples migraciones, ejecuta el comando varias veces.

## Ver Estado de las Migraciones

Para ver qué migraciones se han ejecutado:

```bash
pnpm --filter @yumyum/api typeorm migration:show -d src/config/typeorm.config.ts
```

## Ejemplo de Flujo de Trabajo Completo

### Primera vez (Setup inicial)

```bash
# 1. Crear la base de datos (si no existe)
createdb yumyum_db

# 2. Generar la migración inicial desde las entidades
pnpm --filter @yumyum/api migration:generate src/database/migrations/InitialSchema

# 3. Ejecutar la migración
pnpm --filter @yumyum/api migration:run

# 4. (Opcional) Ejecutar seeds para datos de prueba
pnpm --filter @yumyum/api seed
```

### Desarrollo continuo

```bash
# 1. Modificas una entidad (por ejemplo, añades un campo a User)

# 2. Generas una nueva migración
pnpm --filter @yumyum/api migration:generate src/database/migrations/AddPhoneToUser

# 3. Revisas el archivo de migración generado en src/database/migrations/

# 4. Ejecutas la migración
pnpm --filter @yumyum/api migration:run

# 5. Si algo sale mal, puedes revertir
pnpm --filter @yumyum/api migration:revert
```

## Buenas Prácticas

1. **Nunca modifiques migraciones ya ejecutadas** en producción. En su lugar, crea una nueva migración.

2. **Revisa siempre** las migraciones generadas automáticamente antes de ejecutarlas.

3. **Nombres descriptivos**: Usa nombres que describan claramente qué hace la migración:
   - ✅ `CreateUsersTable`
   - ✅ `AddEmailVerificationToUsers`
   - ✅ `CreateRestaurantsAndTables`
   - ❌ `Migration1234567890`
   - ❌ `Update`

4. **Mantén las migraciones pequeñas**: Es mejor tener varias migraciones pequeñas que una enorme.

5. **Prueba las migraciones**:

   ```bash
   # Ejecutar
   pnpm migration:run

   # Revertir
   pnpm migration:revert

   # Ejecutar de nuevo
   pnpm migration:run
   ```

6. **Nunca uses `synchronize: true`** en producción. Siempre usa migraciones.

## Estructura de una Migración

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1234567890 implements MigrationInterface {
  name = 'CreateUsersTable1234567890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cambios a aplicar (crear tablas, añadir columnas, etc.)
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar(255) NOT NULL UNIQUE,
        "password" varchar(255) NOT NULL,
        "created_at" timestamp DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir los cambios (para migration:revert)
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
```

## Troubleshooting

### Error: "relation already exists"

- La tabla ya existe en la base de datos
- Solución: Verifica que `DB_SYNCHRONIZE=false` en `.env` y usa migraciones en lugar de synchronize

### Error: "No changes in database schema were found"

- No hay diferencias entre tus entidades y el esquema de la base de datos
- Solución: Verifica que hayas guardado los cambios en tus entidades

### Error: "Database connection failed"

- Verifica las credenciales en `.env`
- Asegúrate de que PostgreSQL está ejecutándose
- Verifica que la base de datos existe

### Error: "Module not found"

- Ejecuta `pnpm install` desde la raíz del proyecto o desde `back/api`

## Entidades Actuales

Las siguientes entidades están configuradas y listas para generar migraciones:

1. **User** (`src/users/entities/user.entity.ts`)
   - Usuarios del sistema (admin, owners, staff, customers)
   - Autenticación y perfiles

2. **Restaurant** (`src/restaurants/entities/restaurant.entity.ts`)
   - Información de restaurantes
   - Horarios, ubicación, configuración

3. **Table** (`src/restaurants/entities/table.entity.ts`)
   - Mesas de los restaurantes
   - Capacidad, sección, estado

4. **MenuCategory** (`src/restaurants/entities/menu-category.entity.ts`)
   - Categorías del menú (Antipasti, Pasta, Pizza, etc.)

5. **MenuItem** (`src/restaurants/entities/menu-item.entity.ts`)
   - Items del menú con precios, alérgenos, info nutricional

6. **Reservation** (`src/reservations/entities/reservation.entity.ts`)
   - Reservas de clientes
   - Estados (pending, confirmed, seated, completed, etc.)

## Referencias

- [TypeORM Migrations Documentation](https://typeorm.io/migrations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
