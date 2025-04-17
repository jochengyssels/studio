/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'maps.googleapis.com',
      'maps.gstatic.com',
    ],
  },
}

module.exports = nextConfig 