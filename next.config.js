/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nwgbrvpomjkzkofjknyi.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
  trailingSlash: true,
};

module.exports = nextConfig;