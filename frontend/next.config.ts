import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['resizing.flixster.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        port: "",
        pathname: "/my-bucket/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
