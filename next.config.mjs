/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/api/resume.pdf': ['./node_modules/@sparticuz/chromium/bin/**/*'],
  },
  async rewrites() {
    return [
      {
        source: '/api/py/:path*',
        destination: 'http://127.0.0.1:8000/api/py/:path*',
      },
    ];
  },
};

export default nextConfig;
