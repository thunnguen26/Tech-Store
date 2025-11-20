// app/account/orders/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ArrowLeft } from "lucide-react"
import Link from "next/link"

// 1. IMPORT SERVICE VÀ TYPE
import { OrderService, UserOrder } from "@/services/OrderService"

// Hàm chuyển đổi status
const getStatusDisplay = (status: UserOrder['status']) => {
  switch (status) {
    case 'completed': return <Badge className="bg-green-600 hover:bg-green-700">Đã giao</Badge>;
    case 'pending': return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Chờ xử lý</Badge>;
    case 'processing': return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Đang xử lý</Badge>;
    case 'shipped': return <Badge className="bg-cyan-500 hover:bg-cyan-600 text-white">Đang giao</Badge>;
    case 'cancelled': return <Badge variant="destructive">Đã hủy</Badge>;
    default: return <Badge variant="secondary">Không rõ</Badge>;
  }
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 2. DÙNG useEffect ĐỂ GỌI API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const data = await OrderService.getUserOrders();
      
      if (data.length === 0) {
        // Kiểm tra xem họ có đăng nhập không
        if (!localStorage.getItem('techstore_user')) {
          router.push('/login'); // Chưa đăng nhập, đẩy về login
          return;
        }
      }
      
      setOrders(data);
      setIsLoading(false);
    };
    
    fetchOrders();
  }, [router]);

  // 3. HIỂN THỊ LOADING
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

  // 4. HIỂN THỊ ĐƠN HÀNG
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/account">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại Tài khoản
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Lịch sử mua hàng</CardTitle>
              <CardDescription>
                {orders.length === 0 
                  ? "Bạn chưa có đơn hàng nào." 
                  : `Bạn có ${orders.length} đơn hàng.`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-background transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex w-12 h-12 rounded-lg bg-primary/10 items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-primary">{order.order_code}</h3>
                      <p className="text-sm text-muted-foreground">
                        Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.item_count} sản phẩm
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                    <span className="font-bold text-xl">{order.total_amount.toLocaleString("vi-VN")}₫</span>
                    <div className="flex items-center gap-2">
                      {getStatusDisplay(order.status)}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/account/orders/${order.id}`}>
                          Xem chi tiết
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}