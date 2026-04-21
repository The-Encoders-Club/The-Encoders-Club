import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages compatibility — do NOT use "standalone" output
  // @cloudflare/next-on-pages handles the build output format.
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow images from external domains if needed
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
