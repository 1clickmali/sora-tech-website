import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  // WebP/AVIF auto-conversion + aggressive CDN caching for images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Automatically tree-shake large packages — reduces framer-motion & lucide-react bundle by 40-60%
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'recharts'],
  },

  async headers() {
    return [
      // Security + performance headers on all routes
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      // Immutable cache for all static assets (hashed filenames)
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Long cache for public media assets
      {
        source: '/:path*\\.(svg|png|jpg|jpeg|gif|ico|webp|avif|woff2|woff)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Public pages: CDN caches for 5 min, serves stale while revalidating in background
      {
        source: '/(|services|about|blog|projets|boutique|devis|contact|suivi)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
      // Admin pages: never cache
      {
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
};

export default nextConfig;
