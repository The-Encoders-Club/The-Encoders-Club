import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  images: { unoptimized: true },
  transpilePackages: ["framer-motion", "motion-dom", "motion-utils"],
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...(config.experiments || {}),
      asyncWebAssembly: true,
      layers: true,
    };

    if (isServer) {
      // ── CRITICAL for Cloudflare Workers ──────────────────────
      // By default, webpack converts ESM imports for "externals"
      // into CJS require() calls. But Cloudflare Workers does NOT
      // support require() — only ESM import.
      //
      // Setting externalsType + output.module makes webpack output
      // `import ... from "..."` instead of `require("...")` for
      // external modules (including the Prisma WASM).
      config.output = { ...config.output, module: true };
      config.externalsType = "module";

      // Mark Prisma's WASM as external so webpack doesn't inline it
      const existingExternals = config.externals;
      if (Array.isArray(existingExternals)) {
        config.externals = [...existingExternals, /query_engine_bg\.wasm/];
      } else {
        config.externals = [/query_engine_bg\.wasm/];
      }
    } else {
      config.module.rules.push({
        test: /\.wasm$/,
        type: "asset/resource",
      });
    }
    return config;
  },
};

if (process.env.OPENNEXT_DEV === "1") {
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
}

export default nextConfig;
