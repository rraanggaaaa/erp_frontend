import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["erp-backend-5ax6.vercel.app"],
  },
  transpilePackages: ["antd"],

  // Rewrites untuk proxy ke backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://erp-backend-5ax6.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
