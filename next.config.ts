import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/blog", destination: "/startup/blog", permanent: false },
      { source: "/tools", destination: "/fundraise/tools", permanent: false },
      { source: "/products", destination: "/fundraise/templates", permanent: false },
    ]
  },
};

export default nextConfig;
