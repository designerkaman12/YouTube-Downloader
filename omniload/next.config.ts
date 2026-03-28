import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Don't fail build on type errors in CI
    ignoreBuildErrors: true,
  },
  output: 'standalone',
};

export default nextConfig;
