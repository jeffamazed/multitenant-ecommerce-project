import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "orange-dollop-g4v5gw5g4rpj2p7q7-3000.app.github.dev",
    "localhost:3000",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "orange-dollop-g4v5gw5g4rpj2p7q7-3000.app.github.dev",
        "localhost:3000",
      ],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withPayload(nextConfig);
