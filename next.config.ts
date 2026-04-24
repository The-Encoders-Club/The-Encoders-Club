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
  // -----------------------------------------------------------------------
  // Prisma + Cloudflare Workers (workerd runtime)
  // -----------------------------------------------------------------------
  // El cliente Prisma generado con `runtime = "workerd"` importa un archivo
  // .wasm (query_engine_bg.wasm).  Si webpack intenta procesarlo, lo
  // convierte en una URL string (asset/resource) o lo compila incorrectamente
  // (asyncWebAssembly), causando:
  //   TypeError: WebAssembly.Instance(): Argument 0 must be a WebAssembly.Module
  //
  // SOLUCIÓN: Marcar los paquetes de Prisma como "serverExternalPackages" para
  // que Next.js NO los pase por webpack.  En su lugar, OpenNext Cloudflare los
  // re-bundlea con esbuild, que sabe manejar .wasm correctamente para workerd.
  //
  // NO añadir reglas webpack para .wasm (ni asset/resource, ni asyncWebAssembly).
  // -----------------------------------------------------------------------
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-d1",
    "@prisma/adapter-libsql",
  ],
};

if (process.env.OPENNEXT_DEV === "1") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
}

export default nextConfig;
