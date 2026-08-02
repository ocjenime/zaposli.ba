/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/zaposli.ba',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;