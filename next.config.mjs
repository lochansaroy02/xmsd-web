/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'barbersyndicate.in',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
