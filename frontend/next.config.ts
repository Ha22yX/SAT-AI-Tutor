import type { NextConfig } from "next";

// Server-side rewrite target. The browser still calls same-origin /api.
const API_BASE = process.env.API_BASE || "http://127.0.0.1:5080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
