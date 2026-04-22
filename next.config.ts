import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  // Cloudflare Pages requiere que el runtime sea compatible con Edge
  // para funciones dinámicas y API routes.
};

export default nextConfig;
