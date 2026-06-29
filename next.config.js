/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent browsers from MIME-sniffing the content type
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Block the page from loading in a frame on external sites (prevents clickjacking)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Force HTTPS for 2 years (only effective after first HTTPS visit)
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Send minimal referrer info when navigating cross-origin
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features not needed by this app
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  // DNS prefetch hint
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
]

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'picsum.photos'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/firebase-messaging-sw.js',
        destination: '/api/firebase-messaging-sw',
      },
    ]
  },
}

module.exports = nextConfig
