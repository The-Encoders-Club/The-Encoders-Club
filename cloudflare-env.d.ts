/* ──────────────────────────────────────────────────────────────
 * cloudflare-env.d.ts
 *
 * Declara los bindings de Cloudflare Workers para TypeScript.
 * Wrangler genera esto con `npm run cf:typegen`, pero aquí
 * están definidos manualmente para que el compilador reconozca
 * `CloudflareEnv` (usado en src/lib/db.ts y api/setup/route.ts).
 * ────────────────────────────────────────────────────────────── */

interface CloudflareEnv {
  /** D1 SQLite database binding (wrangler.toml → [[d1_databases]]) */
  DB: D1Database;

  /** Código de seguridad para /api/setup (wrangler.toml → [vars]) */
  SETUP_CODE?: string;

  /** Entorno de ejecución (wrangler.toml → [vars]) */
  NODE_ENV?: string;

  /** Assets binding para @opennextjs/cloudflare */
  ASSETS?: Fetcher;
}
