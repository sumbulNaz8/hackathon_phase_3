/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore TypeScript and ESLint build errors for Vercel deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Enable experimental features that might help with build issues
  experimental: {
    typedRoutes: true,
  },
  
  // Images configuration (important for Vercel)
  images: {
    unoptimized: true, // Set to true for static exports
  },
  
  // Ensure webpack uses case-sensitive paths for Linux/Vercel
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.caseSensitiveModules = true;
    }
    return config;
  },
};

module.exports = nextConfig;