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
  // CRITICAL: Mark Prisma packages as external so webpack does NOT bundle them.
  // With queryCompiler + --no-engine there is no WASM, but the Prisma runtime
  // still uses dynamic require() internally which breaks in the Workers ESM env.
  // Keeping these external lets OpenNext's esbuild step handle them correctly.
  serverExternalPackages: ["@prisma/client", ".prisma/client", "@prisma/adapter-d1"],
};

if (process.env.OPENNEXT_DEV === "1") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
}

export default nextConfig;
