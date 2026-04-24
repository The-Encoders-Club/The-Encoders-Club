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
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-d1"],
};

// OpenNext Cloudflare dev initialization moved to separate logic 
// to avoid importing @opennextjs/cloudflare in the Worker build.

export default nextConfig;
