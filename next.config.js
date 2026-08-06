/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  // GitHub Pages needs a static export; Vercel uses the default Next.js runtime.
  output: isGitHubPages ? 'export' : undefined,
  // Keep images unoptimized for GitHub Pages static export. On Vercel, let
  // Next.js optimize images since we now use Next.js <Image> for remote assets.
  images: {
    unoptimized: isGitHubPages,
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