import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Cloudflare Workers runtime: use D1 binding via the driver adapter.
  // Always try to get the Cloudflare context first — if we're running
  // inside a Worker, getCloudflareContext() will succeed and we'll use
  // the D1 adapter. If it fails (e.g. during build, local dev without
  // OpenNext), we fall back to the standard Prisma client.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaD1 } = require("@prisma/adapter-d1");
    const { env } = getCloudflareContext();
    if (env?.DB) {
      const adapter = new PrismaD1(env.DB);
      return new PrismaClient({ adapter });
    }
  } catch {
    // Not inside a Cloudflare Worker — fall through to standard client
    // (e.g. during build, local dev)
  }
  return new PrismaClient();
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
