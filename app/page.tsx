// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react'; // <--- 1. THÊM React VÀO ĐÂY
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { HeroSection } from '@/components/hero-section';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Truck,
  Shield,
  Headphones,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { ProductService } from '@/services/ProductService';
import { Product, ProductVariant, CategoryInfo } from '@/models/Product.model';

type InfoItem = {
  img: string;
  title: string;
  content: React.ReactNode;
  reverse?: boolean;
};

interface SpecItem {
  title: string;
  description: string;
}

interface FeatureItem {
  label: string;
  value: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  'Điện thoại': '/images/category-phones.jpg',
  Laptop: '/images/category-laptops.jpg',
  'Máy tính bảng': '/images/category-tablets.jpg',
  'Phụ kiện': '/images/category-accessories.jpg',
};

const specs: SpecItem[] = [
  {
    title: 'Camera 200MP',
    description: 'Chụp ảnh sắc nét ngay cả trong điều kiện thiếu sáng',
  },
  { title: 'Pin 5500mAh', description: 'Dùng cả ngày, sạc nhanh 80W' },
  {
    title: 'Snapdragon 8 Elite',
    description: 'Hiệu năng cực đỉnh cho gaming và multitask',
  },
  {
    title: 'Màn hình 6.8" 120Hz',
    description: 'Độ phân giải 2K+ với Dynamic AMOLED',
  },
];

const designFeatures = [
  {
    label: 'Camera sắc nét',
    image:
      'https://i.pinimg.com/1200x/36/88/6b/36886bf1e1891d56e4093aec2b963dbb.jpg',
  },
  {
    label: 'Chất Liệu Cao Cấp',
    image:
      'https://i.pinimg.com/1200x/db/12/25/db1225b4f2eed4d64b3ed45684ae4f0c.jpg',
  },
  {
    label: 'Hoàn Thiện Tinh Xảo',
    image:
      'https://i.pinimg.com/736x/d8/e6/9f/d8e69f9b36b7a2cf0a3add6d0d83498a.jpg',
  },
];

const displayFeatures: FeatureItem[] = [
  { label: '6.8"', value: 'Dynamic AMOLED' },
  { label: '120Hz', value: 'Tần số quét cao' },
  { label: '2K+', value: 'Độ phân giải' },
  { label: 'HDR10+', value: 'Màu sắc sống động' },
];

// Component InformationSection
function InformationSection() {
  const list: InfoItem[] = [
    {
      img: 'https://i.pinimg.com/736x/c4/b1/51/c4b151e777f49ee3374ee7fa08812400.jpg',
      title: 'iPhone 17 Pro Max - Siêu phẩm mới ra mắt',
      content: (
        <>
          <span className="text-indigo-600 font-semibold">
            iPhone 17 Pro Max
          </span>{' '}
          mang đến trải nghiệm đỉnh cao với{' '}
          <span className="text-indigo-600 font-semibold">
            màn hình 6.9" Super Retina XDR
          </span>{' '}
          siêu sáng và mượt mà. Sức mạnh từ{' '}
          <span className="text-indigo-600 font-semibold">chip A19 Pro</span>{' '}
          giúp xử lý mọi tác vụ nhanh chóng, ổn định. Hệ thống{' '}
          <span className="text-indigo-600 font-semibold">camera Pro 48MP</span>{' '}
          cho khả năng chụp đêm vượt trội và quay video 8K sắc nét.
        </>
      ),
    },
    {
      img: 'https://i.pinimg.com/736x/79/61/99/7961993ddf39b5ee07039d07c0751a52.jpg',
      title: 'Samsung Galaxy S25 Ultra – Siêu phẩm cao cấp',
      reverse: true,
      content: (
        <>
          <span className="text-indigo-600 font-semibold">
            Samsung Galaxy S25 Ultra
          </span>{' '}
          sở hữu trải nghiệm đỉnh cao với{' '}
          <span className="text-indigo-600 font-semibold">
            màn hình 6.9" Dynamic AMOLED 2X 120Hz
          </span>{' '}
          siêu mượt và sáng. Hiệu năng vượt trội nhờ{' '}
          <span className="text-indigo-600 font-semibold">
            chip Snapdragon 8 Elite
          </span>
          , xử lý mọi tác vụ nhanh chóng. Hệ thống{' '}
          <span className="text-indigo-600 font-semibold">
            camera 200MP + zoom 100×
          </span>{' '}
          giúp bắt trọn mọi khoảnh khắc, quay video 8K sắc nét.
        </>
      ),
    },
    {
      img: 'https://i.pinimg.com/736x/f5/a3/94/f5a394ec92e5e36116139dac2dd90dfd.jpg',
      title: 'AirPods Pro 2 – Chất lượng âm thanh đỉnh cao',
      content: (
        <>
          <span className="text-indigo-600 font-semibold">
            Apple AirPods Pro 2nd Gen
          </span>{' '}
          mang đến trải nghiệm âm thanh sống động với{' '}
          <span className="text-indigo-600 font-semibold">
            Khử ồn chủ động ANC
          </span>{' '}
          và{' '}
          <span className="text-indigo-600 font-semibold">
            Adaptive Transparency
          </span>
          . Chip <span className="text-indigo-600 font-semibold">H2</span> nâng
          cao hiệu năng, kết nối ổn định. Hộp sạc{' '}
          <span className="text-indigo-600 font-semibold">MagSafe</span> tiện
          lợi, hỗ trợ{' '}
          <span className="text-indigo-600 font-semibold">Spatial Audio</span>{' '}
          cho trải nghiệm 3D sống động.
        </>
      ),
    },
    {
      img: 'https://i.pinimg.com/736x/fb/df/5c/fbdf5ca5b73e15bc0a2dcf918633e1b2.jpg',
      title: 'iPhone 16 128GB – Hiệu năng mạnh mẽ',
      reverse: true,
      content: (
        <>
          <span className="text-indigo-600 font-semibold">iPhone 16 128GB</span>{' '}
          mang đến trải nghiệm mượt mà với{' '}
          <span className="text-indigo-600 font-semibold">
            màn hình 6.7" Super Retina XDR
          </span>{' '}
          và tần số quét{' '}
          <span className="text-indigo-600 font-semibold">120Hz</span>. Hiệu
          năng vượt trội nhờ{' '}
          <span className="text-indigo-600 font-semibold">chip A18 Pro</span>,
          camera <span className="text-indigo-600 font-semibold">48MP</span>{' '}
          chụp đêm sắc nét và quay video{' '}
          <span className="text-indigo-600 font-semibold">8K</span>.
        </>
      ),
    },
  ];

  return (
    <div className="px-4 lg:px-20 py-16 font-sans bg-gradient-to-b from-white to-indigo-50">
      <div className="flex items-center justify-center pt-4 pb-16">
        <span className="text-5xl font-bold">Tin tức</span>
      </div>

      <div className="space-y-12">
        {list.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden ${
              item.reverse ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className="w-full md:w-1/2 h-72 md:h-96 overflow-hidden">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 leading-snug">
                {item.title}
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-6">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component GalaxyUltraSection
function GalaxyUltraSection() {
  return (
    <div className="overflow-x-hidden bg-white text-black">
      <div className="flex items-center justify-center pt-10 pb-4">
        <span className="text-5xl font-bold">Sản phẩm được săn đón 2025</span>
      </div>
      <section className="min-h-screen -mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-8 lg:px-16  pb-20 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-transparent rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent leading-tight">
            Galaxy Ultra 2025
          </h1>

          <p className="text-xl lg:text-2xl mb-8 text-gray-800">
            Đỉnh cao công nghệ. Hoàn hảo từng chi tiết.
          </p>

          <div className="space-y-4">
            {specs.map((spec, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-4 bg-indigo-100/50 border-l-4 border-indigo-500 rounded-lg"
              >
                <div>
                  <h3 className="text-lg font-semibold text-black">
                    {spec.title}
                  </h3>
                  <p className="text-sm text-gray-600">{spec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex justify-center items-center">
          <div
            className="w-full max-w-sm h-96 bg-cover bg-center rounded-3xl shadow-2xl"
            style={{
              backgroundImage:
                'url(https://i.pinimg.com/736x/8d/c7/3f/8dc73fc801d34067a10d3e5d86ac4c7c.jpg)',
            }}
          ></div>
        </div>
      </section>

      {/* Layout 1 - Camera */}
      <section className="py-20 px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className="h-96 bg-cover bg-center rounded-2xl shadow-2xl"
            style={{
              backgroundImage:
                'url(https://i.pinimg.com/736x/1d/37/e2/1d37e23ed7991bcdcba9001b4a202ab7.jpg)',
            }}
          ></div>
          <div>
            <h2 className="text-5xl font-bold mb-6 text-black">
              Camera Chuyên Nghiệp
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Hệ thống 3 camera với cảm biến 200MP chính, cho phép bạn chụp ảnh
              sắc nét ngay cả trong điều kiện thiếu sáng.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Công nghệ AI tích hợp giúp tối ưu hóa từng bức ảnh, mang đến chất
              lượng ảnh đẳng cấp studio.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Zoom quang học 10x và zoom kỹ thuật số 100x, không bỏ lỡ bất kỳ
              khoảnh khắc nào dù ở xa.
            </p>
          </div>
        </div>
      </section>

      {/* Layout 2 - Design */}
      <section className="py-20 px-8 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
          Thiết Kế Tinh Tế
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {designFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="h-64 bg-cover bg-center rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 flex items-end justify-center pb-6 relative group"
              style={{
                backgroundImage: `url(${feature.image})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 rounded-2xl"></div>
              <span className="text-xl font-semibold text-white relative z-10">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Layout 3 - Display */}
      <section className="py-20 px-8 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
          Màn Hình Tuyệt Đẹp
        </h2>

        <div
          className="w-full h-80 bg-cover bg-center rounded-2xl shadow-2xl mb-12"
          style={{
            backgroundImage:
              'url(https://i.pinimg.com/1200x/2e/aa/f6/2eaaf648a5a01348b5bfd44b6a86a8c3.jpg)',
          }}
        ></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {displayFeatures.map((feature, idx) => (
            <div key={idx}>
              <h3 className="text-3xl font-bold text-indigo-500 mb-2">
                {feature.label}
              </h3>
              <p className="text-gray-600">{feature.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Layout 4 - Battery */}
      <section className="py-20 px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className="h-96 bg-cover bg-center rounded-2xl shadow-2xl flex items-end justify-center pb-8 relative"
            style={{
              backgroundImage:
                'url(https://i.pinimg.com/1200x/93/5b/ad/935bad66d6988db9edb2d1055d12064c.jpg)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-2xl"></div>
            <span className="text-3xl font-bold text-white relative z-10">
              Sạc Nhanh 80W
            </span>
          </div>
          <div
            className="h-96 bg-cover bg-center rounded-2xl shadow-2xl flex items-end justify-center pb-8 relative"
            style={{
              backgroundImage:
                'url(https://i.pinimg.com/736x/6a/0c/e1/6a0ce1833b32821df30e9124af063fcc.jpg)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-2xl"></div>
            <span className="text-3xl font-bold text-white relative z-10">
              Pin 5500mAh
            </span>
          </div>
        </div>
      </section>

      {/* Layout 5 - Gallery */}
      <section className="py-20 px-8 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
          Trải Nghiệm Đa Dạng
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max">
          <div
            className="lg:col-span-2 lg:row-span-2 h-96 lg:h-full bg-cover bg-center rounded-2xl shadow-2xl"
            style={{
              backgroundImage:
                'url(https://i.pinimg.com/736x/53/4a/a9/534aa9efe19b1079bb76d34a230adead.jpg)',
            }}
          ></div>
          <div
            className="h-64 bg-cover bg-center rounded-2xl shadow-lg"
            style={{
              backgroundImage:
                'url(https://i.pinimg.com/736x/ad/7b/19/ad7b1929f9586651e9cc2c44d51bc88a.jpg)',
            }}
          ></div>
          <div
            className="h-64 bg-cover bg-center rounded-2xl shadow-lg"
            style={{
              backgroundImage:
                'url(https://i.pinimg.com/736x/8d/c7/3f/8dc73fc801d34067a10d3e5d86ac4c7c.jpg)',
            }}
          ></div>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      try {
        const [allProducts, categoriesData] = await Promise.all([
          ProductService.getAllProducts(),
          ProductService.getCategories(),
        ]);

        setFeaturedProducts(allProducts.slice(0, 8));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Lỗi tải dữ liệu trang chủ:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const getProductMinPrice = (variants: ProductVariant[]): number => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce(
      (min, v) => Math.min(min, v.price),
      variants[0].price,
    );
  };

  // === 2. HÀM QUAN TRỌNG: XỬ LÝ URL ẢNH ===
  const getSafeImageUrl = (url: string | null | undefined): string => {
    if (!url) return '/placeholder.svg';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return url;
    return `/${url}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      <main className="flex-1">
        <HeroSection />

        {/* Danh mục */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Khám phá ngay
                  </span>
                </div>
                <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Danh mục nổi bật
                </h2>
                <p className="text-muted-foreground text-lg">
                  Khám phá các sản phẩm công nghệ mới nhất
                </p>
              </div>
              <Link href="/products">
                <Button variant="outline" size="lg" className="group">
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category, idx) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.name}`}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-lg hover:shadow-2xl transition-all duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* 3. Dùng thẻ Image với ảnh ánh xạ */}
                  <Image
                    src={CATEGORY_IMAGES[category.name] || '/placeholder.jpg'}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary-foreground transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/90">
                        {category.count} sản phẩm
                      </span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-10">
              {/* Tiêu đề... */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-1 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">
                    Best Sellers
                  </span>
                </div>
                <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Sản phẩm nổi bật
                </h2>
                <p className="text-muted-foreground text-lg">
                  Những thiết bị công nghệ được yêu thích nhất
                </p>
              </div>
              <Link href="/products">
                <Button
                  size="lg"
                  className="group shadow-lg hover:shadow-xl transition-all"
                >
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground text-lg">
                  Đang tải dữ liệu...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product, index) => {
                  const minPriceVariant = getProductMinPrice(product.variants);
                  const originalPrice =
                    product.variants[0]?.original_price || undefined;
                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id.toString()}
                      name={product.name}
                      price={minPriceVariant}
                      originalPrice={originalPrice}
                      // === 4. Dùng hàm getSafeImageUrl ở đây ===
                      image={getSafeImageUrl(
                        product.images?.[0] || product.base_image,
                      )}
                      category={product.category_name}
                      rating={product.rating}
                      reviewCount={product.review_count}
                      variants={product.variants}
                      priority={index < 2}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ... Các section khác giữ nguyên ... */}
        <section className="py-10 bg-muted/30">
          {/* ...Code Truck, Shield... */}
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Truck,
                  title: 'Miễn phí vận chuyển',
                  desc: 'Đơn hàng từ 500k',
                  color: 'text-blue-600',
                },
                {
                  icon: Shield,
                  title: 'Thanh toán an toàn',
                  desc: 'Bảo mật 100%',
                  color: 'text-green-600',
                },
                {
                  icon: RefreshCw,
                  title: 'Đổi trả dễ dàng',
                  desc: 'Trong vòng 30 ngày',
                  color: 'text-orange-600',
                },
                {
                  icon: Headphones,
                  title: 'Hỗ trợ 24/7',
                  desc: 'Luôn sẵn sàng',
                  color: 'text-purple-600',
                },
              ].map((feature, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-primary/50 to-primary opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                  <div className="relative h-full flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border group-hover:border-transparent transition-all duration-300">
                    <div className="w-16 h-16 mb-4 rounded-full border-2 border-primary/20 flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-lg transition-all duration-300">
                      <feature.icon
                        className="h-8 w-8 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="font-bold text-base mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.desc}
                    </p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary group-hover:w-16 transition-all duration-300 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <InformationSection />
        <GalaxyUltraSection />
      </main>
      <Footer />
    </div>
  );
}
