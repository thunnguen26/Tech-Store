// app/account/orders/[id]/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Mail, Phone, Home, Truck, AlertCircle, Package, Star, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// 1. IMPORT SERVICE (Thêm ProductService)
import { OrderService, UserOrderDetail, OrderItemDetail, OrderStatus } from "@/services/OrderService"
import { ProductService, ReviewFormData } from "@/services/ProductService" 

// === HÀM HELPER: ĐỊNH DẠNG TRẠNG THÁI (CHO KHÁCH HÀNG) ===
const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'completed': return <Badge className="bg-green-600 hover:bg-green-700">Đã giao</Badge>;
    case 'pending': return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Chờ xử lý</Badge>;
    case 'processing': return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Đang xử lý</Badge>;
    case 'shipped': return <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white">Đang giao</Badge>;
    case 'cancelled': return <Badge variant="destructive">Đã hủy</Badge>;
    default: return <Badge variant="secondary">Không rõ</Badge>;
  }
};

// === COMPONENT MỚI: MODAL ĐÁNH GIÁ ===
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
      product_id: item.product_id, // Cần product_id từ OrderItemDetail
      order_id: orderId,
      rating: rating,
      comment: comment
    };

    const result = await ProductService.submitReview(reviewData);
    setIsSubmitting(false);

    if (result.success) {
      alert(result.message);
      onSubmitSuccess(); // Gọi hàm callback để đóng modal
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
              <p className="text-sm text-muted-foreground">{item.size} • {item.color_name}</p>
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
            
            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
// === KẾT THÚC MODAL ===


// === COMPONENT CHÍNH CỦA TRANG ===
export default function OrderDetailPage() {
  const [orderData, setOrderData] = useState<UserOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemForReview, setSelectedItemForReview] = useState<OrderItemDetail | null>(null);

  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id as string;

  // Dùng useEffect để gọi API
  useEffect(() => {
    if (!id) return; 

    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Gọi API của Customer, không phải Admin
        const data = await OrderService.getUserOrderDetails(id); 
        if (!data) {
          setError("Không thể tải chi tiết đơn hàng hoặc bạn không có quyền xem.");
          router.push('/account/orders'); // Đẩy về trang danh sách
        } else {
          setOrderData(data);
        }
      } catch (err) {
        setError("Lỗi kết nối máy chủ.");
      }
      setIsLoading(false);
    };
    
    fetchOrderDetails();
  }, [id, router]);

  // === SỬA LỖI: THÊM BỘ BẢO VỆ (GUARD) ===
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

  if (error || !orderData) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/account/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại Lịch sử đơn hàng
              </Link>
            </Button>
            <div className="text-center py-20 text-red-500">
              <AlertCircle className="mx-auto h-10 w-10 mb-4" />
              <p className="text-lg mb-2">{error || "Không tìm thấy đơn hàng"}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // === DỮ LIỆU ĐÃ AN TOÀN (orderData không còn là null) ===
  const { details, items } = orderData;
  
  // Lấy user_id từ localStorage (cần thiết cho Modal)
  const getUserId = () => {
    if (typeof window === 'undefined') return null;
    const userDataString = localStorage.getItem('techstore_user');
    if (!userDataString) return null;
    try { return JSON.parse(userDataString).id || null; } 
    catch (e) { return null; }
  }
  const userId = getUserId();

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/account/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại Lịch sử đơn hàng
            </Link>
          </Button>

          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle className="text-3xl text-primary">{details.order_code}</CardTitle>
                  <CardDescription className="mt-1">
                    Đặt lúc: {new Date(details.created_at).toLocaleString('vi-VN')}
                  </CardDescription>
                </div>
                <div>
                  {getStatusDisplay(details.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Cột 1: Chi tiết đơn hàng */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Chi tiết Đơn hàng</h3>
                {items.map((item: OrderItemDetail, index: number) => (
                  <div key={index} className="flex flex-col gap-3 border-b pb-4">
                    {/* Hàng 1: Thông tin sản phẩm */}
                    <div className="flex gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={item.base_image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.size && `${item.size}`} {item.color_name && `• ${item.color_name}`}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-muted-foreground">
                            {Math.round(item.price_at_purchase).toLocaleString("vi-VN")}₫ x {item.quantity}
                          </span>
                          <span className="font-semibold text-right">
                            {Math.round(item.price_at_purchase * item.quantity).toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Hàng 2: Nút Đánh giá (CHỈ HIỂN THỊ KHI ĐÃ GIAO) */}
                    {details.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="ml-auto"
                        onClick={() => setSelectedItemForReview(item)}
                      >
                        Viết đánh giá
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Cột 2: Thông tin nhận hàng và Tổng tiền */}
              <div className="space-y-6">
                {/* Tổng tiền */}
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Tổng cộng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tạm tính:</span>
                      <span>{Math.round(details.subtotal).toLocaleString("vi-VN")}₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phí vận chuyển:</span>
                      <span>{Math.round(details.shipping_fee).toLocaleString("vi-VN")}₫</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
                      <span>Tổng cộng:</span>
                      <span className="text-primary">{Math.round(details.total_amount).toLocaleString("vi-VN")}₫</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Thông tin giao hàng */}
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Thông tin giao hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{details.customer_first_name} {details.customer_last_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{details.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{details.customer_phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Home className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <span>{details.shipping_address}, {details.shipping_district}, {details.shipping_city}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>{details.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Đã thanh toán online'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      
      {/* === HIỂN THỊ MODAL KHI ĐƯỢC CHỌN === */}
      {selectedItemForReview && userId && (
        <ReviewModal 
          item={selectedItemForReview}
          orderId={details.id}
          userId={userId}
          onClose={() => setSelectedItemForReview(null)}
          onSubmitSuccess={() => {
            setSelectedItemForReview(null);
            // (Bạn có thể thêm logic để đánh dấu là "Đã đánh giá")
          }}
        />
      )}
    </div>
  );
}