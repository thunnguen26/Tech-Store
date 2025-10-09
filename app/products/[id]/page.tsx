"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Truck, Shield, RefreshCw, Minus, Plus, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const productData: Record<string, any> = {
  "1": {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 29990000,
    originalPrice: 34990000,
    images: ["/iphone-15-pro-max.jpg", "/iphone-15-pro-max.jpg", "/iphone-15-pro-max.jpg"],
    category: "Điện thoại",
    rating: 4.9,
    reviews: 328,
    description:
      "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp, màn hình Super Retina XDR 6.7 inch. Thiết kế titan cao cấp, pin lâu dài và hỗ trợ 5G tốc độ cao.",
    features: [
      "Chip A17 Pro 3nm hiệu năng vượt trội",
      "Camera chính 48MP với zoom quang học 5x",
      "Màn hình ProMotion 120Hz",
      "Khung titan chuẩn hàng không vũ trụ",
      "Pin 4422mAh, sạc nhanh 27W",
      "Hỗ trợ 5G, WiFi 6E, USB-C",
    ],
    sizes: ["128GB", "256GB", "512GB", "1TB"],
    colors: [
      { name: "Titan Tự Nhiên", value: "#8B8B8B" },
      { name: "Titan Xanh", value: "#4A5568" },
      { name: "Titan Trắng", value: "#E5E5E5" },
      { name: "Titan Đen", value: "#2D3748" },
    ],
    inStock: true,
    sku: "IP15PM-001",
  },
  "3": {
    id: "3",
    name: "MacBook Pro M3 14 inch",
    price: 42990000,
    originalPrice: 49990000,
    images: ["/macbook-pro-m3.jpg", "/macbook-pro-m3.jpg", "/macbook-pro-m3.jpg"],
    category: "Laptop",
    rating: 5,
    reviews: 256,
    description:
      "MacBook Pro 14 inch với chip M3 mạnh mẽ, màn hình Liquid Retina XDR tuyệt đẹp. Hiệu năng vượt trội cho công việc sáng tạo, lập trình và đồ họa chuyên nghiệp.",
    features: [
      "Chip Apple M3 8-core CPU, 10-core GPU",
      "Màn hình Liquid Retina XDR 14.2 inch",
      "RAM 16GB thống nhất",
      "SSD 512GB tốc độ cao",
      "Pin 70Wh, sử dụng đến 17 giờ",
      "3x Thunderbolt 4, HDMI, SD card",
    ],
    sizes: ["16GB/512GB", "16GB/1TB", "32GB/1TB", "32GB/2TB"],
    colors: [
      { name: "Xám Không Gian", value: "#5C5C5C" },
      { name: "Bạc", value: "#E3E3E3" },
    ],
    inStock: true,
    sku: "MBP14-M3-001",
  },
}

const relatedProducts = [
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
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = productData[params.id] || productData["1"]
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="border-b border-border bg-muted/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Trang chủ
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-foreground transition-colors">
                Sản phẩm
              </Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </div>
          </div>
        </section>

        {/* Product Detail */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={product.images[selectedImage] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {discount > 0 && (
                    <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
                      -{discount}%
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden rounded-lg bg-muted border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{product.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews} đánh giá)
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold">{product.price.toLocaleString("vi-VN")}₫</span>
                    {product.originalPrice && (
                      <span className="text-xl text-muted-foreground line-through">
                        {product.originalPrice.toLocaleString("vi-VN")}₫
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>

                {/* Size Selection */}
                {product.sizes && (
                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      {product.category === "Điện thoại" || product.category === "Laptop" ? "Dung lượng" : "Kích thước"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded-md transition-colors ${
                            selectedSize === size
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors && (
                  <div>
                    <label className="block text-sm font-semibold mb-3">Màu sắc</label>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color: any) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                            selectedColor === color.name
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          <div
                            className="w-6 h-6 rounded-full border border-border"
                            style={{ backgroundColor: color.value }}
                          />
                          <span className="text-sm">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Số lượng</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-muted transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-6 py-2 border-x border-border min-w-[60px] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 hover:bg-muted transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <Badge variant={product.inStock ? "default" : "destructive"} className="bg-green-500">
                      {product.inStock ? "Còn hàng" : "Hết hàng"}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="flex-1">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Thêm vào giỏ hàng
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Miễn phí vận chuyển</p>
                      <p className="text-xs text-muted-foreground">Đơn từ 500k</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Bảo hành chính hãng</p>
                      <p className="text-xs text-muted-foreground">12 tháng</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <RefreshCw className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Đổi trả dễ dàng</p>
                      <p className="text-xs text-muted-foreground">Trong 30 ngày</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-12">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Mô tả sản phẩm
                  </TabsTrigger>
                  <TabsTrigger
                    value="features"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Đặc điểm nổi bật
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Đánh giá ({product.reviews})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-6">
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      Sản phẩm được thiết kế với sự tỉ mỉ trong từng chi tiết, đảm bảo chất lượng cao nhất cho khách
                      hàng. Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời với dịch vụ chăm sóc khách hàng tận
                      tâm.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="features" className="mt-6">
                  <ul className="space-y-3">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-2">{product.rating}</div>
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{product.reviews} đánh giá</p>
                      </div>
                    </div>
                    <div className="border-t border-border pt-6">
                      <p className="text-muted-foreground">
                        Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-16 bg-muted/20 border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
