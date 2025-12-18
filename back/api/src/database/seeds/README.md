# Database Seeds

Este directorio contiene los scripts de semillas (seeds) para poblar la base de datos con datos iniciales.

## Uso

Para ejecutar las semillas y poblar la base de datos:

```bash
# Desde la raíz del proyecto
pnpm --filter @yumyum/api seed

# O desde el directorio back/api
pnpm seed
```

## Semillas Incluidas

### 1. UserSeeder

Crea usuarios iniciales del sistema:

- **Super Admin**
  - Email: `admin@yumyum.com`
  - Password: `Admin123!`
  - Rol: `super_admin`
  - Acceso completo al panel de administración

- **Restaurant Owner (Demo)**
  - Email: `owner@demo-restaurant.com`
  - Password: `Admin123!`
  - Rol: `restaurant_owner`
  - Propietario del restaurante demo

- **Customer (Demo)**
  - Email: `customer@example.com`
  - Password: `Admin123!`
  - Rol: `customer`
  - Cliente de ejemplo para pruebas

### 2. RestaurantSeeder

Crea un restaurante de demostración completo:

- **Restaurante: La Bella Italia**
  - Cocina italiana auténtica
  - 12 mesas distribuidas en 3 secciones (Terraza, Interior, Sala VIP)
  - Horarios de apertura configurados
  - Menú completo con 3 categorías y 8 platos

- **Mesas:**
  - Terraza: 4 mesas (2 de 2 personas, 2 de 4 personas)
  - Interior: 5 mesas (2 de 2 personas, 2 de 4 personas, 1 de 6 personas)
  - Sala VIP: 3 mesas (1 de 6, 1 de 8, 1 de 10 personas)

- **Menú:**
  - **Antipasti:** Bruschetta, Caprese
  - **Pasta:** Carbonara, Ravioli, Lasagna
  - **Pizza:** Margherita, Quattro Formaggi, Diavola

## Crear Nuevas Semillas

Para crear una nueva semilla:

1. Crea un archivo en este directorio: `nombre.seeder.ts`

2. Implementa la clase seeder:

```typescript
import { DataSource } from 'typeorm';

export class NombreSeeder {
  async run(dataSource: DataSource): Promise<void> {
    console.log('📝 Seeding nombre...');

    const repository = dataSource.getRepository('Entity');

    // Tu lógica de seeding aquí

    console.log('  ✅ Nombre seeded successfully');
  }
}
```

3. Registra el seeder en `seed.ts`:

```typescript
import { NombreSeeder } from './nombre.seeder';

// En la función runSeeders()
const nombreSeeder = new NombreSeeder();
await nombreSeeder.run(AppDataSource);
```

## Notas Importantes

- Las semillas verifican si los datos ya existen antes de crearlos
- Las semillas se ejecutan en orden específico para mantener integridad referencial
- Todas las contraseñas de demo son: `Admin123!`
- Los datos creados son solo para desarrollo y pruebas
- **NUNCA** ejecutes estas semillas en producción con datos reales

## Limpieza de Base de Datos

Si necesitas reiniciar la base de datos desde cero:

```bash
# Eliminar todas las tablas y recrearlas
pnpm --filter @yumyum/api migration:revert
pnpm --filter @yumyum/api migration:run

# Ejecutar semillas
pnpm --filter @yumyum/api seed
```

## Troubleshooting

### Error: "Database connection failed"

- Verifica que PostgreSQL esté ejecutándose
- Confirma las credenciales en el archivo `.env`
- Asegúrate de que la base de datos `yumyum_db` existe

### Error: "Entity not found"

- Ejecuta las migraciones primero: `pnpm migration:run`
- Verifica que las entidades estén correctamente definidas

### Error: "Duplicate key"

- Los datos ya existen en la base de datos
- Las semillas están diseñadas para no duplicar, pero verifica el código
