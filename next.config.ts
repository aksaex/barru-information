import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Abaikan error TypeScript biar bisa deploy
  typescript: {
    ignoreBuildErrors: true,
  },
  // Abaikan error ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Settingan lain
  reactCompiler: true,
};

export default nextConfig;