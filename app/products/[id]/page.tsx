'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Truck, Shield, RefreshCw, Minus, Plus, Share2, User, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// === QUAN TRỌNG: Import ProductCard ===
import { ProductCard } from "@/components/product-card"

// Import Services
import { ProductService, Product, ProductVariant, Review, ReviewFormData } from "@/services/ProductService"
import { CartService } from "@/services/CartService"
import { OrderService, OrderItemDetail } from "@/services/OrderService"

interface ColorOption {
  name: string | null;
  value: string | null;
}

// --- COMPONENT: Hiển thị sao ---
function StarRating({ rating, size = "h-4 w-4" }: { rating: number, size?: string }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

// --- COMPONENT: Modal Đánh giá ---
function ReviewModal({
  item,
  orderId,
  userId,
  onClose,
  onSubmitSuccess
}: {
  item: OrderItemDetail,
  orderId: number,
  userId: number,
  onClose: () => void,
  onSubmitSuccess: () => void
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Vui lòng chọn số sao đánh giá.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const reviewData: ReviewFormData = {
      user_id: userId,
      product_id: item.product_id,
      order_id: orderId,
      rating: rating,
      comment: comment
    };

    const result = await ProductService.submitReview(reviewData);
    setIsSubmitting(false);

    if (result.success) {
      alert(result.message);
      onSubmitSuccess();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <Card className="w-[90%] max-w-lg bg-background border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Đánh giá sản phẩm</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
              <Image src={item.base_image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
            <div>
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-muted-foreground">
                 {item.size ? item.size : ''} {item.color_name ? `• ${item.color_name}` : ''}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-medium">Đánh giá của bạn *</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400 hover:text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Bình luận (tùy chọn)</Label>
              <Textarea
                id="comment"
                placeholder="Sản phẩm rất tuyệt vời..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-muted border-border"
              />
            </div>
            {error && (<div className="text-sm text-red-500">{error}</div>)}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// --- COMPONENT CHÍNH ---
export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);
  const [uniqueColors, setUniqueColors] = useState<ColorOption[]>([]);

  const [selectedItemForReview, setSelectedItemForReview] = useState<OrderItemDetail | null>(null);

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!id) return;

    const fetchProductData = async () => {
      setIsLoading(true);
      const productData = await ProductService.getProductById(id);
      setProduct(productData);

      const allProducts = await ProductService.getAllProducts();
      // Lọc sản phẩm liên quan
      setRelatedProducts(
        allProducts.filter(p => p.id.toString() !== id && p.category_name === productData?.category_name).slice(0, 4)
      );

      if (productData && productData.variants) {
        const sizes = [...new Set(productData.variants.map(v => v.size).filter(Boolean))] as string[];
        setUniqueSizes(sizes);

        const colors = [...new Map(
          productData.variants.map(v => [v.color_name, { name: v.color_name, value: v.color_hex }])
        ).values()].filter(v => v.name) as ColorOption[];
        setUniqueColors(colors);

        if (sizes.length > 0) setSelectedSize(sizes[0]);
        if (colors.length > 0 && colors[0].name) setSelectedColor(colors[0].name);
      }
      setIsLoading(false);
    };

    fetchProductData();
  }, [id]);

  // --- HÀM GIẢI MÃ JSON FEATURES ---
  const parseFeatures = (featuresData: string | string[] | null | any): string[] => {
    if (!featuresData) return [];
    
    let parsedData = featuresData;

    // 1. Nếu là chuỗi JSON, thử giải mã
    if (typeof featuresData === 'string') {
      try {
        parsedData = JSON.parse(featuresData);
      } catch (e) {
        return [featuresData]; 
      }
    }

    if (Array.isArray(parsedData)) {
      return parsedData.map(item => String(item));
    }
    if (typeof parsedData === 'object' && parsedData !== null) {
      const specsArray: string[] = [];
      
      const labels: Record<string, string> = {
        processor: "Bộ xử lý",
        ram: "RAM",
        storage: "Bộ nhớ/Dung lượng",
        screen: "Màn hình",
      };

      for (const key in parsedData) {
        if (Object.prototype.hasOwnProperty.call(parsedData, key)) {
          const value = parsedData[key];
          if (value) { // Chỉ hiển thị nếu có giá trị
             const label = labels[key] || key.charAt(0).toUpperCase() + key.slice(1); 
             specsArray.push(`${label}: ${value}`);
          }
        }
      }
      return specsArray;
    }

    return [];
  };

  // Hàm lấy giá thấp nhất cho sản phẩm liên quan
  const getProductMinPrice = (variants: ProductVariant[]): number => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((min, v) => Math.min(min, v.price), variants[0].price);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xl">Không tìm thấy sản phẩm.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const currentVariant = product.variants.find(v => {
    const sizeMatch = uniqueSizes.length === 0 || v.size === selectedSize;
    const colorMatch = uniqueColors.length === 0 || v.color_name === selectedColor;
    return sizeMatch && colorMatch;
  });

  const price = currentVariant ? currentVariant.price : (product.variants[0]?.price || 0);
  const originalPrice = currentVariant ? currentVariant.original_price : (product.variants[0]?.original_price || 0);
  const inStock = currentVariant ? currentVariant.stock_quantity > 0 : (product.variants.some(v => v.stock_quantity > 0));
  const discount = (originalPrice && price && originalPrice > 0)
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!currentVariant) {
      alert("Lỗi: Không tìm thấy biến thể sản phẩm.");
      return;
    }
    setIsAddingToCart(true);
    const result = await CartService.addItem(currentVariant.id, quantity);
    if (result.success) {
      // alert("Đã thêm vào giỏ hàng!");
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } else {
      alert(`Lỗi: ${result.message}`);
    }
    setIsAddingToCart(false);
  }

  const safeImages = (product.images && product.images.length > 0)
    ? product.images
    : (product.base_image ? [product.base_image] : ["/placeholder.svg"]);
  const currentImageIndex = Math.min(selectedImage, safeImages.length - 1);

  const productFeatures = parseFeatures(product.features);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="border-b border-border bg-muted/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-foreground transition-colors">Sản phẩm</Link>
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
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted border">
                  <Image
                    src={safeImages[currentImageIndex] || "/placeholder.svg"}
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
                {safeImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {safeImages.map((image: string, index: number) => (
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
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{product.category_name}</p>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{product.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <StarRating rating={product.rating} size="h-5 w-5" />
                    <span className="text-sm text-muted-foreground">
                      {product.rating.toFixed(1)} ({product.review_count} đánh giá)
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold">{Math.round(price).toLocaleString("vi-VN")}₫</span>
                    {originalPrice && originalPrice > 0 && (
                      <span className="text-xl text-muted-foreground line-through">
                        {Math.round(originalPrice).toLocaleString("vi-VN")}₫
                      </span>
                    )}
                  </div>
                  {/* Hiển thị mô tả ngắn gọn ở đây nếu muốn, hoặc bỏ qua */}
                </div>

                {/* Size Selection */}
                {uniqueSizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      {product.category_name === "Điện thoại" || product.category_name === "Laptop" ? "Dung lượng" : "Kích thước"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {uniqueSizes.map((size: string) => (
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
                {uniqueColors.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold mb-3">Màu sắc</label>
                    <div className="flex flex-wrap gap-3">
                      {uniqueColors.map((color: ColorOption) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name || "")}
                          className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                            selectedColor === color.name
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          <div
                            className="w-6 h-6 rounded-full border border-border"
                            style={{ backgroundColor: color.value || "#FFFFFF" }}
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
                    <Badge variant={inStock ? "default" : "destructive"} className={inStock ? "bg-green-500" : ""}>
                      {inStock ? "Còn hàng" : "Hết hàng"}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !inStock}
                  >
                    {isAddingToCart ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    ) : (
                      <ShoppingCart className="h-5 w-5 mr-2" />
                    )}
                    {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Features Icons */}
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

            {/* === Product Details Tabs === */}
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
                    Đánh giá ({product.review_count})
                  </TabsTrigger>
                </TabsList>

                {/* Tab Mô tả */}
                <TabsContent value="description" className="mt-6">
                  <div className="prose max-w-none text-muted-foreground">
                    <p className="whitespace-pre-line">
                      {product.description || "Sản phẩm này chưa có mô tả."}
                    </p>
                  </div>
                </TabsContent>

                {/* Tab Đặc điểm */}
                <TabsContent value="features" className="mt-6">
                  <ul className="space-y-3">
                    {productFeatures.length > 0 ? (
                      productFeatures.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))
                    ) : (
                      <p className="text-muted-foreground">Chưa có thông tin đặc điểm nổi bật.</p>
                    )}
                  </ul>
                </TabsContent>

                {/* Tab Đánh giá */}
                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-6">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review: Review, index: number) => (
                        <div key={index} className="flex gap-4 border-b border-border pb-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{review.user_name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {new Date(review.created_at).toLocaleDateString('vi-VN')}
                            </p>
                            <StarRating rating={review.rating} />
                            {review.comment && (
                              <p className="text-muted-foreground mt-3">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        Chưa có đánh giá nào.
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
            <section className="py-16 bg-muted/20 border-t border-border">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Sản phẩm liên quan</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {relatedProducts.map((relatedProd) => {
                    const minPriceVariant = relatedProd.variants.length > 0
                      ? relatedProd.variants.reduce((min, v) => v.price < min.price ? v : min, relatedProd.variants[0])
                      : null;
                    const originalPriceRelated = minPriceVariant?.original_price || 0;

                    return (
                      <ProductCard
                        key={relatedProd.id}
                        id={relatedProd.id.toString()}
                        name={relatedProd.name}
                        price={minPriceVariant ? minPriceVariant.price : 0}
                        originalPrice={originalPriceRelated}
                        image={relatedProd.base_image || "/placeholder.svg"}
                        category={relatedProd.category_name}
                        rating={relatedProd.rating}
                        reviewCount={relatedProd.review_count}
                      />
                    );
                  })}
                </div>
              </div>
            </section>
        )}
      </main>

      <Footer />
    </div>
  )
}