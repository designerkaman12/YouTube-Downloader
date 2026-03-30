import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  typescript: {
    // Don't fail build on type errors in CI
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: resolve(__dirname),
  },
  output: 'standalone',
};

export default nextConfig;
