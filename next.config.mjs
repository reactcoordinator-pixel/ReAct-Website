/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows the build to pass even if there are TS errors
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "images.pexel.com" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "www.uploads.reactmalaysia.org" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
