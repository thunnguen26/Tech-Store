// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '', // Cổng 80 mặc định của XAMPP
        pathname: '/techstore-api/uploads/**', // Cho phép tất cả ảnh trong thư mục uploads
      },
    ],
  },
};

export default nextConfig;