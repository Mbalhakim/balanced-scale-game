import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker
  reactStrictMode: true,
  experimental: {
    
  },
};

export default nextConfig;
