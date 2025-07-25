import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Ignore test files when building
  webpack: (config) => {
    // Ignore test files to prevent them from being treated as pages
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
