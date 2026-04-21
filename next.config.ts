import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone output — @opennextjs/cloudflare handles the build
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
