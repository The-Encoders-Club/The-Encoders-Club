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
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...(config.experiments || {}),
      asyncWebAssembly: true,
      layers: true,
    };

    if (isServer) {
      // ── Server build (→ Cloudflare Worker) ──────────────────────
      // No dejes que webpack procese las importaciones .wasm del
      // cliente Prisma.  Deben pasar intactas hasta esbuild (OpenNext),
      // donde el plugin `prisma-wasm-external` las marca como externas
      // para que Wrangler las resuelva de forma nativa.
      const existingExternals = config.externals;
      if (Array.isArray(existingExternals)) {
        config.externals = [
          ...existingExternals,
          /query_engine_bg\.wasm/,
        ];
      } else {
        config.externals = [/query_engine_bg\.wasm/];
      }
    } else {
      // ── Client build ────────────────────────────────────────────
      // Para el navegador, los .wasm se emiten como assets normales.
      config.module.rules.push({
        test: /\.wasm$/,
        type: "asset/resource",
      });
    }

    return config;
  },
};

if (process.env.OPENNEXT_DEV === "1") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
}

export default nextConfig;
