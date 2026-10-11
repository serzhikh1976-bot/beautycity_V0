/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@beautycity/db', '@beautycity/shared'],
};

export default nextConfig;
