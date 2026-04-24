import { PrismaClient } from "@/generated/prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Cachea un PrismaClient por instancia de `env` de Cloudflare.
const clientCache = new WeakMap<object, PrismaClient>();

function getPrisma(): PrismaClient {
  let env: CloudflareEnv | undefined;
  try {
    env = getCloudflareContext().env;
  } catch {
    // Fuera de un Worker (ej. `next dev` clásico). Cae a libsql/sqlite local.
  }

  if (!env?.DB) {
    throw new Error(
      "Binding D1 'DB' no disponible. Verifica wrangler.toml y que la migración esté aplicada."
    );
  }

  let client = clientCache.get(env as unknown as object);
  if (!client) {
    client = new PrismaClient({ adapter: new PrismaD1(env.DB) });
    clientCache.set(env as unknown as object, client);
  }
  return client;
}

// Proxy para no tocar las 16 rutas que usan `db.user.create(...)`, etc.
export const db = new Proxy({} as PrismaClient, {
  get(_t, prop) {
    const client = getPrisma() as unknown as Record<string | symbol, unknown>;
    const value = client[prop];
    return typeof value === "function" ? (value as Function).bind(client) : value;
  },
});

/**
 * createDb() — alias de compatibilidad para todas las rutas que importan
 * `{ createDb }` de '@/lib/db'. Devuelve el mismo PrismaClient que `db`.
 */
export function createDb(): PrismaClient {
  return getPrisma();
}