import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Keep Firebase Admin and Firestore gRPC stack out of the webpack bundle (loaded from
   * `node_modules` at runtime). Bundling them inflates `__netlify-server-handler` past Netlify’s upload limit.
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/serverExternalPackages
   */
  serverExternalPackages: [
    "firebase-admin",
    "@google-cloud/firestore",
    "@google-cloud/storage",
    "google-auth-library",
  ],
  /**
   * Tree-shake `lucide-react` imports — smaller, more stable chunks (helps avoid stale
   * webpack chunk refs like missing `./611.js` after hot reload / mixed dev+start runs).
   */
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  /** Browsers request `/favicon.ico` by default; route to the SVG under `public/assets/favicon/`. */
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/assets/favicon/el-portero-favicon.svg",
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
