# Contribuir a YumYum

Gracias por tu interés en contribuir a YumYum. Este documento proporciona guías y mejores prácticas para contribuir al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Empezando](#empezando)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Estándares de Código](#estándares-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Testing](#testing)

## 🤝 Código de Conducta

Este proyecto adhiere a un código de conducta profesional. Al participar, se espera que mantengas este código.

## 🚀 Empezando

### Prerequisitos

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

### Configuración Inicial

1. **Fork el repositorio** en GitHub

2. **Clona tu fork:**

   ```bash
   git clone https://github.com/tu-usuario/yumyum.git
   cd yumyum
   ```

3. **Añade el upstream remote:**

   ```bash
   git remote add upstream https://github.com/yumyum-org/yumyum.git
   ```

4. **Instala dependencias:**

   ```bash
   pnpm install
   ```

5. **Copia variables de entorno:**

   ```bash
   cp fronts/apps/admin/.env.example fronts/apps/admin/.env.local
   cp fronts/apps/booking/.env.example fronts/apps/booking/.env.local
   cp fronts/apps/dashboard/.env.example fronts/apps/dashboard/.env.local
   cp back/api/.env.example back/api/.env
   ```

6. **Inicia servicios de desarrollo:**
   ```bash
   pnpm docker:up
   pnpm dev
   ```

## 🔄 Flujo de Trabajo

### Crear una Rama

Usa nombres descriptivos para tus ramas:

```bash
# Features
git checkout -b feat/add-reservation-validation

# Bug fixes
git checkout -b fix/resolve-timezone-issue

# Refactoring
git checkout -b refactor/improve-auth-service

# Documentation
git checkout -b docs/update-api-documentation
```

### Mantener tu Fork Actualizado

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## 📝 Estándares de Código

**IMPORTANTE:** Lee completamente [CODING_STANDARDS.md](./docs/CODING_STANDARDS.md) antes de escribir código.

### Reglas Principales:

1. **TypeScript Strict Mode** - Siempre
2. **No usar `any`** - Tipado explícito
3. **ESLint sin errores** - Código debe pasar linter
4. **Prettier** - Formateo consistente
5. **Tests** - Toda nueva funcionalidad debe tener tests

### Linting y Formato

```bash
# Lint todo el proyecto
pnpm lint

# Formatear código
pnpm format

# Lint específico
pnpm --filter @yumyum/admin lint
```

## 💬 Commits

### Conventional Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mensajes de commit:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types:

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formateo, punto y comas faltantes, etc.
- `refactor`: Refactorización de código
- `test`: Añadir o corregir tests
- `chore`: Actualizar dependencias, configs, etc.
- `perf`: Mejoras de performance

### Ejemplos:

```bash
feat(auth): add JWT refresh token support
fix(reservations): resolve timezone conversion issue
docs(readme): update installation instructions
refactor(users): extract validation logic to separate service
test(restaurants): add unit tests for CRUD operations
chore(deps): update Next.js to 14.0.4
```

### Scopes Comunes:

**Frontend:**

- `admin`, `booking`, `dashboard`
- `ui`, `types`, `utils`

**Backend:**

- `auth`, `users`, `restaurants`, `reservations`
- `menu`, `orders`, `customers`, `marketing`

### Reglas de Commits:

1. **Commits pequeños y atómicos** - Un cambio por commit
2. **Mensajes descriptivos** - Explica el "qué" y el "por qué"
3. **Imperative mood** - "add" no "added", "fix" no "fixed"
4. **Primera línea < 72 caracteres**
5. **Body opcional** - Detalles adicionales si es necesario

## 🔀 Pull Requests

### Antes de Crear un PR

1. ✅ Tests pasan
2. ✅ Linter pasa
3. ✅ Build exitoso
4. ✅ Código sigue CODING_STANDARDS.md
5. ✅ Documentación actualizada (si aplica)
6. ✅ Sin console.log() olvidados
7. ✅ Rama actualizada con main

```bash
# Verifica que todo funcione
pnpm lint
pnpm test
pnpm build

# Actualiza con main
git fetch upstream
git rebase upstream/main
```

### Título del PR

Usa el mismo formato que los commits:

```
feat(auth): add JWT refresh token support
fix(reservations): resolve timezone conversion issue
```

### Descripción del PR

Usa esta plantilla:

```markdown
## 📝 Descripción

Breve descripción de los cambios.

## 🎯 Tipo de Cambio

- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación
- [ ] Refactoring

## 🧪 Cómo se ha Testeado

Describe las pruebas que realizaste.

## ✅ Checklist

- [ ] Mi código sigue los estándares del proyecto
- [ ] He revisado mi propio código
- [ ] He comentado código complejo (si aplica)
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan warnings
- [ ] He añadido tests
- [ ] Todos los tests pasan
- [ ] Build exitoso

## 📸 Screenshots (si aplica)

Adjunta screenshots si hay cambios visuales.

## 🔗 Issues Relacionados

Closes #123
```

### Revisión de Código

1. **Al menos 1 aprobación** requerida antes de merge
2. **Responde a comentarios** de manera constructiva
3. **Resuelve conversaciones** antes de merge
4. **CI debe pasar** - Todos los checks en verde

### Merge

- **Squash and merge** para features pequeños
- **Merge commit** para features grandes
- **Nunca force push** a main

## 🧪 Testing

### Backend Tests

```bash
# Unit tests
pnpm --filter @yumyum/api test

# Tests con coverage
pnpm --filter @yumyum/api test:cov

# E2E tests
pnpm --filter @yumyum/api test:e2e

# Watch mode
pnpm --filter @yumyum/api test:watch
```

### Frontend Tests

```bash
# Todos los tests del frontend
pnpm --filter './fronts/**' test

# Test de una app específica
pnpm --filter @yumyum/admin test
```

### Escribir Tests

#### Backend (NestJS)

```typescript
describe('UsersService', () => {
  it('should create a user', async () => {
    const dto = { email: 'test@test.com', name: 'Test' };
    const result = await service.create(dto);

    expect(result).toBeDefined();
    expect(result.email).toBe(dto.email);
  });
});
```

#### Frontend (React Testing Library)

```typescript
describe('ReservationForm', () => {
  it('should submit form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<ReservationForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2024-12-25' },
    });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
```

## 🐛 Reportar Bugs

Usa la plantilla de issue de GitHub con:

1. **Descripción clara** del bug
2. **Pasos para reproducir**
3. **Comportamiento esperado**
4. **Comportamiento actual**
5. **Screenshots** (si aplica)
6. **Entorno** (OS, Browser, Node version)

## 💡 Solicitar Features

1. **Busca** si ya existe un issue similar
2. **Describe** el problema que resuelve
3. **Propone** una solución
4. **Considera** alternativas

## 📞 Preguntas

Si tienes preguntas:

1. Revisa la [documentación](./docs/)
2. Busca en issues cerrados
3. Pregunta en el canal de Slack del equipo
4. Crea un issue con la etiqueta `question`

## 📜 Licencia

Al contribuir a YumYum, aceptas que tus contribuciones se licenciarán bajo la misma licencia del proyecto.

---

**¡Gracias por contribuir a YumYum!** 🎉
