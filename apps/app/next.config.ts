import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Consome o source TS/CSS de @matchgoal/shared diretamente (sem build step).
  transpilePackages: ["@matchgoal/shared"],
};

export default nextConfig;
