import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Configuración para Cloudflare Pages
  experimental: {
    runtime: "nodejs",
  },
  // Asegurarse de que las variables de entorno se pasen correctamente
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;
