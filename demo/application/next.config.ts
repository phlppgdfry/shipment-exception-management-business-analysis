import path from "node:path";
import type { NextConfig } from "next";

// Static export, so the demo runs on GitHub Pages without a server (see demo/README.md).
// BASE_PATH is set by the Pages workflow, e.g. /shipment-exception-management-business-analysis/control-tower
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
  turbopack: {
    // The repository root: the app imports the shared rule module (site/assets) and the mock data (demo/mock-data).
    root: path.join(__dirname, "..", ".."),
  },
};

export default nextConfig;
