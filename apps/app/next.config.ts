import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Consome o source TS de @matchgoal/* diretamente (sem build step).
  transpilePackages: ["@matchgoal/shared", "@matchgoal/api"],
};

export default nextConfig;
