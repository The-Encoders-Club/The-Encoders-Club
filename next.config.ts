import { setupDevBindings } from "@cloudflare/next-on-pages/next";
if (process.env.NODE_ENV === "development") setupDevBindings();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
