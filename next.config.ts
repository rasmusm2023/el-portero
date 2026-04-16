import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
