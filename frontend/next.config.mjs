/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore build errors
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Suppress build errors
    config.ignoreWarnings = [/Failed to parse source map/];
    
    return config;
  },
  
  // Handle API routes proxy
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/:path*` : 'http://localhost:8000/api/:path*',
      },
    ];
  },
  
  // Allow external images/resources if needed
  images: {
    domains: ['localhost', 'your-backend-domain.com'],
  },
};

module.exports = nextConfig;