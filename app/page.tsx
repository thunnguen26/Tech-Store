import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, Headphones, RefreshCw } from "lucide-react";
import Link from "next/link";

const featuredProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 29990000,
    originalPrice: 34990000,
    image: "/iphone-15-pro-max.jpg",
    category: "Điện thoại",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    price: 27990000,
    originalPrice: 32990000,
    image: "/samsung-s24-ultra.jpg",
    category: "Điện thoại",
    rating: 4.8,
  },
  {
    id: "3",
    name: "MacBook Pro M3 14 inch",
    price: 42990000,
    originalPrice: 49990000,
    image: "/macbook-pro-m3.jpg",
    category: "Laptop",
    rating: 5,
  },
  {
    id: "4",
    name: "Dell XPS 15",
    price: 35990000,
    originalPrice: 42990000,
    image: "/dell-xps-15.jpg",
    category: "Laptop",
    rating: 4.7,
  },
  {
    id: "5",
    name: "iPad Pro 12.9 inch M2",
    price: 28990000,
    originalPrice: 34990000,
    image: "/ipad-pro-m2.jpg",
    category: "Máy tính bảng",
    rating: 4.8,
  },
  {
    id: "6",
    name: "AirPods Pro 2",
    price: 5990000,
    originalPrice: 7490000,
    image: "/airpods-pro-2.jpg",
    category: "Phụ kiện",
    rating: 4.9,
  },
  {
    id: "7",
    name: "Apple Watch Series 9",
    price: 10990000,
    originalPrice: 12990000,
    image: "/apple-watch-9.jpg",
    category: "Phụ kiện",
    rating: 4.7,
  },
  {
    id: "8",
    name: "Sony WH-1000XM5",
    price: 7990000,
    originalPrice: 9990000,
    image: "/sony-wh1000xm5.jpg",
    category: "Phụ kiện",
    rating: 4.9,
  },
];

const categories = [
  { name: "Điện thoại", image: "/category-phones.jpg", count: 156 },
  { name: "Laptop", image: "/category-laptops.jpg", count: 89 },
  { name: "Máy tính bảng", image: "/category-tablets.jpg", count: 67 },
  { name: "Phụ kiện", image: "/category-accessories.jpg", count: 234 },
];

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />

        {/* Features Section */}
        <section className="py-6 border-y border-border bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Miễn phí vận chuyển</h3>
                  <p className="text-xs text-muted-foreground">Đơn hàng từ 500k</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Thanh toán an toàn</h3>
                  <p className="text-xs text-muted-foreground">Bảo mật 100%</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Đổi trả dễ dàng</h3>
                  <p className="text-xs text-muted-foreground">Trong vòng 30 ngày</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Hỗ trợ 24/7</h3>
                  <p className="text-xs text-muted-foreground">Luôn sẵn sàng</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Danh mục nổi bật</h2>
                <p className="text-muted-foreground">Khám phá các sản phẩm công nghệ mới nhất</p>
              </div>
              <Link href="/categories">
                <Button variant="ghost">
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.count} sản phẩm</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Sản phẩm nổi bật</h2>
                <p className="text-muted-foreground">Những thiết bị công nghệ được yêu thích nhất</p>
              </div>
              <Link href="/products">
                <Button variant="ghost">
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Đăng ký nhận tin</h2>
              <p className="text-muted-foreground mb-8 text-pretty">
                Nhận thông tin về sản phẩm công nghệ mới, ưu đãi đặc biệt và các chương trình khuyến mãi hấp dẫn
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-3 rounded-lg border border-input bg-background"
                />
                <Button size="lg">Đăng ký</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
