import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:locale/projects",
        destination: "/:locale/portfolio",
        permanent: true,
      },
      {
        source: "/:locale/projects/:slug",
        destination: "/:locale/portfolio/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
