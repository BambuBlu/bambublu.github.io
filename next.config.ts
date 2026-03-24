import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    APP_VERSION: process.env.npm_package_version,
  },
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
        pathname: '/**',
      }
    ],
  },
  allowedDevOrigins: ['galvanoscopic-lauretta-plurally.ngrok-free.dev'],
};

export default nextConfig;