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
  // With queryCompiler + --no-engine, @prisma/client is pure TypeScript
  // (no WASM, no fs). Marking external lets OpenNext's esbuild handle
  // them properly for the workerd runtime.
  serverExternalPackages: [
    "@prisma/client",
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
