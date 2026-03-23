import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    APP_VERSION: process.env.npm_package_version,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  allowedDevOrigins: ['galvanoscopic-lauretta-plurally.ngrok-free.dev'],
};

export default nextConfig;