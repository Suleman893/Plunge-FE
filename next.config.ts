import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // basePath: process.env.BASEPATH,
  redirects: async () => {
    return []
  }
}

export default nextConfig
