/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bypass Next.js Image Optimization - ImageKit already handles resize/compress via transformedUrl(). Vercel optimizer was intermittently failing on some images.
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'ik.imagekit.io' }
    ],
    formats: ['image/avif', 'image/webp']
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
