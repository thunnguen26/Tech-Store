//components/hero-section.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const videos = [
    "/videos/intro-ip17.mp4",
    "/videos/intro-samsung.mp4",
    "/videos/intro-ip16.mp4",
    "/videos/intro-ai.mp4",
  ];

  const [currentVideo, setCurrentVideo] = useState(0);

  const handleVideoEnded = () => {
    // Chuyển sang video tiếp theo, quay lại video đầu khi hết
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  return (
    <section className="relative h-[95vh] flex items-center overflow-hidden">
      {/* Video Background - RÕ RÀNG HƠN */}
      <video
        key={currentVideo}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        onEnded={handleVideoEnded}
      >
        <source src={videos[currentVideo]} type="video/mp4" />
      </video>

      {/* Lớp phủ MỜ NHẸ HƠN - từ 50% xuống 30% */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40 z-10" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-white">
        <div className="max-w-3xl backdrop-blur-sm bg-black/1 p-8 rounded-2xl border border-white/5">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-2xl">
            Công nghệ hàng đầu, giá tốt nhất
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100 leading-relaxed drop-shadow-lg">
            Khám phá bộ sưu tập điện thoại, laptop, tablet và phụ kiện công nghệ chính hãng với giá ưu đãi nhất thị trường.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl">
                Mua sắm ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/categories">
              {/* <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-md shadow-lg"
              >
                Xem danh mục
              </Button> */}
            </Link>
          </div>

          {/* Video Indicators */}
          <div className="flex gap-2 mt-8">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideo(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentVideo === index 
                    ? 'w-12 bg-white' 
                    : 'w-8 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Xem video ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};