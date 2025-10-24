/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.tokopedia.net" },
      { protocol: "https", hostname: "filebroker-cdn.lazada.co.id" },
      { protocol: "https", hostname: "media.karousell.com" },
      { protocol: "https", hostname: "down-id.img.susercontent.com" },
      { protocol: "https", hostname: "img.lazcdn.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

module.exports = nextConfig;
