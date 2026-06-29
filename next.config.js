/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'picsum.photos'],
  },
  async rewrites() {
    return [
      // Serve Firebase Messaging SW with injected config from an API route
      {
        source: '/firebase-messaging-sw.js',
        destination: '/api/firebase-messaging-sw',
      },
    ]
  },
}

module.exports = nextConfig
