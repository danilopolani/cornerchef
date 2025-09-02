/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  // Optimize for smooth client-side navigation
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Reduce bundle size for better navigation performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
