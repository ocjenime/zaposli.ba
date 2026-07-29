/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'docs',
  basePath: '/zaposli.ba',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;