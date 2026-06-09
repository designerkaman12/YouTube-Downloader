import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: resolve(__dirname),
  },
};

export default nextConfig;
