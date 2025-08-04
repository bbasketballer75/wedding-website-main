import withBundleAnalyzer from '@next/bundle-analyzer';

// Bundle analyzer configuration
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for optimal Netlify hosting
  output: 'export',
  trailingSlash: true,

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Disable source maps in production for Netlify (reduces bundle size)
  productionBrowserSourceMaps: false,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Disable optimization for static export
    unoptimized: true,
  },

  webpack: (config, { dev, isServer }) => {
    // Ensure we're using standard Webpack, not Turbopack
    config.name = isServer ? 'server' : 'client';

    // Ignore test files to prevent them from being treated as pages
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // Bundle optimization for production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
          },
          common: {
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 30,
          },
        },
      };
    }

    return config;
  },

  // Note: Custom headers and redirects are handled in netlify.toml for static export
};

// Apply bundle analyzer and Sentry config
const finalConfig = bundleAnalyzer(nextConfig);

// Only apply Sentry config if auth token is available
export default finalConfig;
