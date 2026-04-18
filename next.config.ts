import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Tree-shake `lucide-react` imports — smaller, more stable chunks (helps avoid stale
   * webpack chunk refs like missing `./611.js` after hot reload / mixed dev+start runs).
   */
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  /** Browsers request `/favicon.ico` by default; we only ship an SVG under `/favicon/`. */
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon/el-portero-favicon.svg",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
