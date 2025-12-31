import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // 1. Abaikan Error TypeScript saat Build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 2. Abaikan Error ESLint saat Build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;