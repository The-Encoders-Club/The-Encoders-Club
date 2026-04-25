import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Cloudflare Workers compatible configuration
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Avoid using server-side features that aren't Edge-compatible
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
