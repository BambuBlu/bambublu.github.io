import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['galvanoscopic-lauretta-plurally.ngrok-free.dev'],
};

export default nextConfig;
