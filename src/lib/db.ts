import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Cloudflare Workers runtime: use D1 binding via the driver adapter.
  // We detect it via the OpenNext helper, which is only available at runtime
  // inside the Worker — so we require it lazily.
  if (process.env.NEXT_RUNTIME === "edge" || process.env.CF_PAGES || process.env.CLOUDFLARE_WORKERS) {
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
      // fall through to standard client (e.g. during build)
    }
  }
  return new PrismaClient();
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
