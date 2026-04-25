/**
 * Tipado del entorno de Cloudflare Workers.
 *
 * Este archivo es generado conceptualmente por `wrangler types` pero se
 * incluye aquí explícitamente para asegurar que el tipo `CloudflareEnv`
 * usado en src/lib/db.ts y otros archivos esté siempre disponible.
 *
 * Si ejecutas `npm run cf:typegen` se sobreescribirá con la versión
 * autogenerada por Wrangler.
 */
interface CloudflareEnv {
  /** Binding D1 — base de datos SQLite */
  DB: D1Database;

  /** Código de seguridad para /api/setup */
  SETUP_CODE?: string;

  /** Variables de entorno inyectadas por Wrangler / Dashboard */
  NODE_ENV?: string;
}
