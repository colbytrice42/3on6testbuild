/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
    ],
  },
  // Keep old Wix URLs alive. Add any extra legacy paths here.
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/blog/categories/:slug', destination: '/blog?category=:slug', permanent: true },
    ]
  },
}
export default nextConfig
