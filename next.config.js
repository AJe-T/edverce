/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  // Run analyzer only for production builds (e.g. `npm run analyze`)
  enabled:
    process.env.ANALYZE === "true" && process.env.NODE_ENV === "production",
});

const nextConfig = {
  images: {
    // remotePatterns is safer and more flexible than 'domains'
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Optional: Speeds up production builds by ignoring linting/typescript errors
  // during the 'build' step (use with caution!)
  // eslint: { ignoreDuringBuilds: true },
  // typescript: { ignoreBuildErrors: true },
};

module.exports = withBundleAnalyzer(nextConfig);
