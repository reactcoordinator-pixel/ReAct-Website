/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  // Modularize barrel imports so only used components ship (huge JS savings).
  experimental: {
    optimizePackageImports: [
      "@heroui/react",
      "lucide-react",
      "react-icons",
      "framer-motion",
    ],
  },
  typescript: {
    // This allows the build to pass even if there are TS errors
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "images.pexel.com" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "www.uploads.reactmalaysia.org" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
