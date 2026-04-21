# The Encoders Club - Guía de despliegue en Cloudflare

## Cambios realizados para Cloudflare Workers

| Antes | Ahora |
|-------|-------|
| Prisma ORM | Drizzle ORM + D1 |
| bcrypt (Node.js) | Web Crypto API (PBKDF2) |
| fs/promises (avatar) | Base64 en base de datos |
| next build standalone | @opennextjs/cloudflare |
| SQLite local | Cloudflare D1 |

## Pasos para desplegar

### 1. Instalar dependencias
```bash
npm install
```

### 2. Crear la base de datos D1
```bash
npm run db:create
```
Esto te dará un `database_id`. Cópialo y pégalo en `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "encoders-club-db"
database_id = "TU_DATABASE_ID_AQUI"  # <-- Pega aquí
```

### 3. Ejecutar migraciones (crear tablas)
```bash
npm run db:migrate
```

### 4. Construir para Cloudflare
```bash
npm run build:cloudflare
```

### 5. Probar localmente
```bash
npm run preview
```

### 6. Desplegar
```bash
npm run deploy
```

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo local con Next.js |
| `npm run build:cloudflare` | Build para Cloudflare Workers |
| `npm run preview` | Previsualizar con Wrangler local |
| `npm run deploy` | Desplegar a Cloudflare |
| `npm run db:create` | Crear base de datos D1 |
| `npm run db:migrate` | Crear tablas en D1 (remoto) |
| `npm run db:migrate:local` | Crear tablas en D1 (local) |
| `npm run db:console` | Ejecutar SQL en D1 |

## Primera vez: Crear cuenta Owner

Después de desplegar, ve a:
```
https://tu-dominio.pages.dev/setup
```
Ahí creas la cuenta Owner (solo se puede hacer una vez).

## Estructura de archivos modificados

```
drizzle/
  schema.ts          # Esquema Drizzle (reemplaza prisma/schema.prisma)
  migrations/
    0001_initial.sql # SQL para crear tablas en D1

src/lib/
  db.ts              # Conexión Drizzle + D1 (reemplaza Prisma)
  auth.ts            # Web Crypto API (reemplaza bcrypt/Node crypto)
  session.ts         # Sesiones con Drizzle

src/app/api/         # Todas las rutas reescritas para Drizzle
  auth/              # registro, login, logout, sesión, contraseña
  comments/          # comentarios, likes, reportes
  admin/             # usuarios, stats, owner, discord
  user/              # perfil, avatar
  notifications/     # notificaciones
  donations/         # donaciones
  discord/           # webhook

wrangler.toml        # Configuración de Cloudflare Workers + D1
```
