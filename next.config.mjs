/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "ibb.co" },
    ],
  },
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
