import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Define a raiz do monorepo para o tracing — evita o aviso de múltiplos lockfiles.
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
