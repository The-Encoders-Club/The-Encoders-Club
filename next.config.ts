import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  transpilePackages: ["framer-motion", "motion-dom", "motion-utils"],
  // CRITICAL: Prevent webpack from bundling Prisma packages.
  // The standard @prisma/client uses fs/path which DON'T EXIST in Workers.
  // Marking them external lets OpenNext's esbuild handle them properly,
  // and @prisma/client/edge (imported in db.ts) avoids all fs calls.
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/client/edge",
    ".prisma/client",
    "@prisma/adapter-d1",
  ],
};

if (process.env.OPENNEXT_DEV === "1") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
}

export default nextConfig;
