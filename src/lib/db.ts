import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Detección canónica del runtime de Cloudflare Workers.
// En Workers, navigator.userAgent siempre vale "Cloudflare-Workers".
// Las env vars (CF_PAGES, NEXT_RUNTIME, etc.) NO sirven con OpenNext;
// por eso el chequeo viejo fallaba y caía al PrismaClient sin adapter.
function isCloudflareWorkers(): boolean {
  try {
    return (
      typeof navigator !== "undefined" &&
      (navigator as { userAgent?: string }).userAgent === "Cloudflare-Workers"
    );
  } catch {
    return false;
  }
}

function createPrismaClient(): PrismaClient {
  if (isCloudflareWorkers()) {
    // En Workers SIEMPRE usamos el adaptador D1.
    // Nunca crees un PrismaClient sin adapter aquí: intentaría cargar
    // el motor binario con fs.readdir y unenv lanza el error que ves.
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const { PrismaD1 } = require("@prisma/adapter-d1");
    const { env } = getCloudflareContext();
    if (!env?.DB) {
      throw new Error(
        "Falta el binding D1 'DB'. Revisa wrangler.toml y la configuración del Worker."
      );
    }
    return new PrismaClient({ adapter: new PrismaD1(env.DB) });
  }

  // Desarrollo local (npm run dev) → SQLite vía DATABASE_URL.
  return new PrismaClient();
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && !isCloudflareWorkers()) {
  globalForPrisma.prisma = db;
}