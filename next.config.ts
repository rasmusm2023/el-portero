import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Netlify OpenNext uploads one Node bundle (`___netlify-server-handler`). Next’s default
   * image optimizer pulls in **sharp** (+ `@img/*` native binaries, often 30MB+), which alone can
   * push the zipped function past Netlify’s ~50MB upload cap — unrelated to how big `public/` is.
   *
   * `unoptimized` disables the Sharp pipeline; `<Image>` still resolves URLs and layout. Assets
   * under `/public` are served as-is; remote patterns continue to work without server-side decoding.
   */
  images: {
    unoptimized: true,
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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dovyrycsh/**",
      },
    ],
  },
  /**
   * Belt-and-suspenders: keep sharp out of the NFT trace when possible (pairs with `unoptimized`).
   */
  outputFileTracingExcludes: {
    "*": [
      "node_modules/sharp/**/*",
      "node_modules/@img/**/*",
    ],
  },
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
};

export default nextConfig;
