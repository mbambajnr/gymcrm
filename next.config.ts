import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['*.ngrok-free.dev', 'localhost:3000'],
    },
  },
};

export default nextConfig;
