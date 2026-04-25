import { PrismaClient } from "@/generated/prisma";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cache } from "react";

/**
 * Returns a PrismaClient scoped to the current request.
 *
 * - Uses React `cache()` so the same request reuses the same client.
 * - Gets the D1 binding from Cloudflare's Worker context.
 * - Never creates a global PrismaClient (causes I/O errors on Workers).
 *
 * With queryCompiler + --no-engine there is NO WASM query engine,
 * so this runs as pure TypeScript — no dynamic require() issues.
 */
export const getDb = cache(function getDb(): PrismaClient {
  const { env } = getCloudflareContext();

  if (!env.DB) {
    throw new Error(
      "Binding D1 'DB' no disponible. Verifica wrangler.toml y que la migración esté aplicada."
    );
  }

  const adapter = new PrismaD1(env.DB);
  return new PrismaClient({ adapter });
});

/**
 * For static routes (ISR/SSG) that need async context access.
 */
export const getDbAsync = cache(async function getDbAsync(): Promise<PrismaClient> {
  const { env } = await getCloudflareContext({ async: true });

  if (!env.DB) {
    throw new Error(
      "Binding D1 'DB' no disponible. Verifica wrangler.toml y que la migración esté aplicada."
    );
  }

  const adapter = new PrismaD1(env.DB);
  return new PrismaClient({ adapter });
});

// ── Backward-compatible exports ──────────────────────────────────────
// The 18 API routes that import `createDb` or `db` continue to work
// without any changes. Under the hood they now use the per-request
// `getDb()` from React cache().

/**
 * Returns a PrismaClient for the current request.
 * Alias for `getDb()` — kept for backward compatibility.
 */
export function createDb(): PrismaClient {
  return getDb();
}

/**
 * Proxy that lazily delegates to `getDb()`.
 * This lets existing code do `db.user.create(...)` without changes.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_t, prop) {
    const client = getDb() as unknown as Record<string | symbol, unknown>;
    const value = client[prop];
    return typeof value === "function"
      ? (value as Function).bind(client)
      : value;
  },
});
