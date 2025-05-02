/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure proper handling of routes
  experimental: {
    // This enables full support for catch-all routes
    appDir: true,
  },
};

module.exports = nextConfig; 