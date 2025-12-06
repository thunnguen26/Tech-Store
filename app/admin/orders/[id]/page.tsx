// app/admin/orders/[id]/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Mail, Phone, Home, Truck, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// 1. IMPORT CHUẨN MVC (QUAN TRỌNG)
import { OrderService } from "@/services/OrderService"
import { UserOrderDetail, OrderItemDetail, OrderStatus } from "@/models/Order.model" // <-- Lấy từ Model

// Hàm hiển thị trạng thái
const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'completed': return <Badge className="bg-green-500/10 text-green-400">Đã giao</Badge>;
    case 'pending': return <Badge className="bg-yellow-500/10 text-yellow-400">Chờ xử lý</Badge>;
    case 'processing': return <Badge className="bg-blue-500/10 text-blue-400">Đang xử lý</Badge>;
    case 'shipped': return <Badge className="bg-indigo-500/10 text-indigo-400">Đang giao</Badge>;
    case 'cancelled': return <Badge className="bg-red-500/10 text-red-400">Đã hủy</Badge>;
    default: return <Badge variant="secondary">Không rõ</Badge>;
  }
};

export default function AdminOrderDetailPage() {
  const [orderData, setOrderData] = useState<UserOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('pending');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!id) return;

    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await OrderService.getAdminOrderDetails(id); 
        if (!data) {
          setError("Không thể tải chi tiết đơn hàng.");
        } else {
          setOrderData(data);
          setCurrentStatus(data.details.status); 
        }
      } catch (err) {
        setError("Lỗi kết nối máy chủ.");
      }
      setIsLoading(false);
    };
    
    fetchOrderDetails();
  }, [id, router]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    
    if (!orderData) return;
    
    setIsUpdating(true);
    setError(null);
    
    const result = await OrderService.updateOrderStatus(orderData.details.id, newStatus);
    
    if (result.success) {
      setCurrentStatus(newStatus); 
      alert(result.message);
    } else {
      setError(result.message);
      // Rollback
      e.target.value = currentStatus;
    }
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Lỗi</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-red-400">
          <AlertCircle className="mb-2 h-12 w-12" />
          <p>{error || "Không tìm thấy đơn hàng"}</p>
        </div>
      </div>
    );
  }

  const { details, items } = orderData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Chi tiết Đơn hàng</h1>
          <p className="text-gray-400 mt-1">Mã đơn: <span className="text-blue-400 font-medium">{details.order_code}</span></p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-red-950/50 border border-red-900 p-4">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-400">Lỗi</p>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Card className="border-gray-800 bg-gray-950">
        <CardHeader className="border-b border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl text-white">Đơn hàng {details.order_code}</CardTitle>
              <CardDescription className="mt-1">
                Đặt lúc: {new Date(details.created_at).toLocaleString('vi-VN')}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="status" className="text-sm text-gray-400">Trạng thái:</Label>
              <select
                id="status"
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={isUpdating}
                className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
              >
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đang giao</option>
                <option value="completed">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cột 1: Chi tiết đơn hàng (Sản phẩm) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold text-white">Chi tiết Đơn hàng</h3>
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 border-b border-gray-800 pb-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-800">
                  <Image
                    src={item.base_image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white">{item.name}</h4>
                  <p className="text-sm text-gray-400">
                    {item.size && `${item.size}`} {item.color_name && `• ${item.color_name}`}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-400">
                      {Math.round(item.price_at_purchase).toLocaleString("vi-VN")}₫ x {item.quantity}
                    </span>
                    <span className="font-semibold text-white text-right">
                      {Math.round(item.price_at_purchase * item.quantity).toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cột 2: Thông tin nhận hàng và Tổng tiền */}
          <div className="space-y-6">
            {/* Tổng tiền */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Tổng cộng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Tạm tính:</span>
                  <span>{Math.round(details.subtotal || details.total_amount).toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Phí vận chuyển:</span>
                  <span>{Math.round(details.shipping_fee || 0).toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-white border-t border-gray-700 pt-3 mt-3">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-400">{Math.round(details.total_amount).toLocaleString("vi-VN")}₫</span>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin giao hàng */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{details.customer_first_name} {details.customer_last_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{details.customer_email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{details.customer_phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                  <span>{details.shipping_address}, {details.shipping_district}, {details.shipping_city}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <span>{details.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Đã thanh toán online'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}