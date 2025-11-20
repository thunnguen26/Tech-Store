'use client'

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, Headphones, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";

import { ProductService, Product, ProductVariant, CategoryInfo } from "@/services/ProductService"

type InfoItem = {
  img: string;
  title: string;
  content: React.ReactNode;
  reverse?: boolean;
};

const CATEGORY_IMAGES: Record<string, string> = {
  "Điện thoại": "/images/category-phones.jpg",
  "Laptop": "/images/category-laptops.jpg",
  "Máy tính bảng": "/images/category-tablets.jpg",
  "Phụ kiện": "/images/category-accessories.jpg"
};

// Component InformationSection
function InformationSection() {
  const list: InfoItem[] = [
    {
      img: "https://i.pinimg.com/736x/c4/b1/51/c4b151e777f49ee3374ee7fa08812400.jpg",
      title: "iPhone 17 Pro Max - Siêu phẩm mới ra mắt ",
      content: (
        <>
          <span className="text-teal-600 font-semibold">iPhone 17 Pro Max</span> mang đến trải nghiệm đỉnh cao với{" "}
          <span className="text-blue-600 font-semibold">màn hình 6.9" Super Retina XDR</span>{" "}siêu sáng và mượt mà. Sức mạnh từ{" "}
          <span className="text-blue-600 font-semibold">chip A19 Pro</span>{" "}giúp xử lý mọi tác vụ nhanh chóng, ổn định. Hệ thống{" "}
          <span className="text-blue-600 font-semibold">camera Pro 48MP</span>{" "}cho khả năng chụp đêm vượt trội và quay video 8K sắc nét.
        </>
      ),
    },
    {
      img: "https://i.pinimg.com/736x/79/61/99/7961993ddf39b5ee07039d07c0751a52.jpg",
      title: "Samsung Galaxy S25 Ultra – Siêu phẩm cao cấp",
      reverse: true,
      content: (
        <>
          <span className="text-teal-600 font-semibold">Samsung Galaxy S25 Ultra</span> sở hữu trải nghiệm đỉnh cao với{" "}
          <span className="text-blue-600 font-semibold">màn hình 6.9" Dynamic AMOLED 2X 120Hz</span> siêu mượt và sáng. Hiệu năng vượt trội nhờ{" "}
          <span className="text-blue-600 font-semibold">chip Snapdragon 8 Elite</span>, xử lý mọi tác vụ nhanh chóng. Hệ thống{" "}
          <span className="text-blue-600 font-semibold">camera 200MP + zoom 100×</span> giúp bắt trọn mọi khoảnh khắc, quay video 8K sắc nét.
        </>
      ),
    },
    {
      img: "https://i.pinimg.com/736x/f5/a3/94/f5a394ec92e5e36116139dac2dd90dfd.jpg",
      title: "AirPods Pro 2 – Chất lượng âm thanh đỉnh cao",
      content: (
        <>
          <span className="text-teal-600 font-semibold">Apple AirPods Pro 2nd Gen</span> mang đến trải nghiệm âm thanh sống động với{" "}
          <span className="text-blue-600 font-semibold">Khử ồn chủ động ANC</span> và <span className="text-blue-600 font-semibold">Adaptive Transparency</span>. 
          Chip <span className="text-blue-600 font-semibold">H2</span> nâng cao hiệu năng, kết nối ổn định. Hộp sạc <span className="text-blue-600 font-semibold">MagSafe</span> tiện lợi, hỗ trợ <span className="text-blue-600 font-semibold">Spatial Audio</span> cho trải nghiệm 3D sống động.
        </>
      ),
    },
    {
      img: "https://i.pinimg.com/736x/fb/df/5c/fbdf5ca5b73e15bc0a2dcf918633e1b2.jpg",
      title: "iPhone 16 128GB – Hiệu năng mạnh mẽ",
      reverse: true,
      content: (
        <>
          <span className="text-teal-600 font-semibold">iPhone 16 128GB</span> mang đến trải nghiệm mượt mà với{" "}
          <span className="text-blue-600 font-semibold">màn hình 6.7" Super Retina XDR</span> và tần số quét <span className="text-blue-600 font-semibold">120Hz</span>. 
          Hiệu năng vượt trội nhờ <span className="text-blue-600 font-semibold">chip A18 Pro</span>, camera <span className="text-blue-600 font-semibold">48MP</span> chụp đêm sắc nét và quay video <span className="text-blue-600 font-semibold">8K</span>.
        </>
      ),
    },
  ];

  return (
    <div className="px-4 lg:px-20 py-16 font-sans bg-white">
      {list.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col md:flex-row items-center bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden mb-12 ${
            item.reverse ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* IMAGE */}
          <div className="w-full md:w-1/2 h-72 md:h-96 overflow-hidden">
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* CONTENT */}
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
  );
}

export default function Page() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]); // State cho danh mục
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      try {
        // Gọi song song 2 API: Lấy sản phẩm & Lấy danh mục
        const [allProducts, categoriesData] = await Promise.all([
          ProductService.getAllProducts(),
          ProductService.getCategories()
        ]);

        // Lấy 8 sản phẩm đầu tiên làm "Nổi bật"
        setFeaturedProducts(allProducts.slice(0, 8));
        
        // Lưu danh mục vào state
        setCategories(categoriesData);

      } catch (error) {
        console.error("Lỗi tải dữ liệu trang chủ:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const getProductMinPrice = (variants: ProductVariant[]): number => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((min, v) => Math.min(min, v.price), variants[0].price);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      <main className="flex-1">
        <HeroSection />

       {/*Danh mục */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Khám phá ngay</span>
                </div>
                <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Danh mục nổi bật
                </h2>
                <p className="text-muted-foreground text-lg">Khám phá các sản phẩm công nghệ mới nhất</p>
              </div>
              {/* Link này dẫn đến trang sản phẩm với filter */}
              <Link href="/products">
                <Button variant="outline" size="lg" className="group">
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Grid danh mục */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category, idx) => (
                <Link
                  key={category.id}
                  // Khi click, dẫn đến trang products và tự động lọc theo tên danh mục
                  href={`/products?category=${category.name}`}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-lg hover:shadow-2xl transition-all duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    // Lấy ảnh từ biến CATEGORY_IMAGES ở trên, nếu không có thì dùng ảnh mặc định
                    style={{ backgroundImage: `url(${CATEGORY_IMAGES[category.name] || "/placeholder.jpg"})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary-foreground transition-colors">{category.name}</h3>
                    <div className="flex items-center gap-2">
                      {/* Hiển thị số lượng thật từ CSDL */}
                      <span className="text-sm text-white/90">{category.count} sản phẩm</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Featured Products Section */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-1 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">Best Sellers</span>
                </div>
                <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Sản phẩm nổi bật
                </h2>
                <p className="text-muted-foreground text-lg">Những thiết bị công nghệ được yêu thích nhất</p>
              </div>
              <Link href="/products">
                <Button size="lg" className="group shadow-lg hover:shadow-xl transition-all">
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground text-lg">Đang tải sản phẩm...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product, index) => {
                  const minPriceVariant = getProductMinPrice(product.variants) > 0 
                    ? product.variants.reduce((min, v) => v.price < min.price ? v : min, product.variants[0])
                    : null;
                  
                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id.toString()}
                      name={product.name}
                      price={minPriceVariant ? minPriceVariant.price : 0}
                      originalPrice={minPriceVariant?.original_price || undefined}
                      image={product.base_image || "/placeholder.svg"}
                      category={product.category_name}
                      rating={product.rating}
                      reviewCount={product.review_count}
                      priority={index < 2}
                      variants={product.variants}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

{/* Features Section - Minimal with Animated Borders */}
        <section className="py-10 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Truck, title: "Miễn phí vận chuyển", desc: "Đơn hàng từ 500k" },
                { icon: Shield, title: "Thanh toán an toàn", desc: "Bảo mật 100%" },
                { icon: RefreshCw, title: "Đổi trả dễ dàng", desc: "Trong vòng 30 ngày" },
                { icon: Headphones, title: "Hỗ trợ 24/7", desc: "Luôn sẵn sàng" }
              ].map((feature, idx) => (
                <div key={idx} className="group relative">
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-primary/50 to-primary opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                  
                  <div className="relative h-full flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border group-hover:border-transparent transition-all duration-300">
                    {/* Simple icon circle */}
                    <div className="w-16 h-16 mb-4 rounded-full border-2 border-primary/20 flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-lg transition-all duration-300">
                      <feature.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="font-bold text-base mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    
                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary group-hover:w-16 transition-all duration-300 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


      {/* Thông tin các sản phầm nổi bật */}
        <InformationSection />

  
      </main>
      <Footer />
    </div>
  );
}