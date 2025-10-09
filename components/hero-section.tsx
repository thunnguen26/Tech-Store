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
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden">
      <video
        key={currentVideo}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
        onEnded={handleVideoEnded}
      >
        <source src={videos[currentVideo]} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="container mx-auto px-4 relative z-10 text-white">
    <div className="max-w-3xl">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        Công nghệ hàng đầu, giá tốt nhất
      </h1>
      <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
        Khám phá bộ sưu tập điện thoại, laptop, tablet và phụ kiện công nghệ chính hãng với giá ưu đãi nhất thị trường.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/products">
          <Button size="lg" className="w-full sm:w-auto">
            Mua sắm ngay
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Link href="/categories">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10"
          >
            Xem danh mục
          </Button>
        </Link>
      </div>
    </div>
  </div>
    </section>
  );
};
