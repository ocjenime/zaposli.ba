/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  // GitHub Pages needs a static export; Vercel uses the default Next.js runtime.
  output: isGitHubPages ? 'export' : undefined,
  // Keep images unoptimized for the static export. On Vercel this is harmless
  // because the project primarily uses plain <img> tags.
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