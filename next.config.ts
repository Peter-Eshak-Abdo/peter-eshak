import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site served by Firebase Hosting (see firebase.json).
  output: "export",
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // No image optimizer exists at runtime on static hosting; images are pre-optimized by `npm run images`.
    unoptimized: true,
  },
  experimental: {
    // Needed because every page lives under app/[locale] (multiple root layouts).
    globalNotFound: true,
  },
};

export default nextConfig;
