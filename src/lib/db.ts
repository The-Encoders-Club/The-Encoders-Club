import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Try Cloudflare D1 binding first. getCloudflareContext throws if we're
  // not running inside a Worker (e.g. during `next build`), so we try/catch
  // and fall back to the standard SQLite client for local dev.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaD1 } = require("@prisma/adapter-d1");
    const ctx = getCloudflareContext();
    const env = ctx?.env;
    if (env?.DB) {
      const adapter = new PrismaD1(env.DB);
      return new PrismaClient({ adapter });
    }
  } catch {
    // Not in a Worker — fall through to the standard client.
  }
  return new PrismaClient();
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export function getD1(): D1Database | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const env = getCloudflareContext()?.env;
    return env?.DB ?? null;
  } catch {
    return null;
  }
}

declare global {
  // Minimal D1 type for getD1() — full type comes from @cloudflare/workers-types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type D1Database = any;
}
