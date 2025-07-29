import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Force legacy Webpack for dev (not Turbopack)
  experimental: {
    serverComponentsExternalPackages: ['react-router-dom'],
    legacyWebpack: true,
  },
  webpack: (config) => {
    // Ignore test files to prevent them from being treated as pages
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
