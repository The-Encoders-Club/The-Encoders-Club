import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Intentamos siempre obtener el contexto de Cloudflare.
  // Si existe y tiene el binding DB, usamos el adaptador D1.
  // Si no (build estático, dev local, etc.), caemos al cliente SQLite normal.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaD1 } = require("@prisma/adapter-d1");
    const ctx = getCloudflareContext();
    if (ctx?.env?.DB) {
      const adapter = new PrismaD1(ctx.env.DB);
      return new PrismaClient({ adapter });
    }
  } catch {
    // No estamos dentro de Workers (dev local) → usamos SQLite local
  }
  return new PrismaClient();
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;