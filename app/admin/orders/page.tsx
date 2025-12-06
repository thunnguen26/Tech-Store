// app/admin/orders/page.tsx
'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, RefreshCw, AlertCircle } from "lucide-react"
import Link from "next/link"

// 1. SỬA IMPORT
import { OrderService } from "@/services/OrderService"
import { AdminOrder, OrderStatus } from "@/models/Order.model" // <-- Lấy từ Model

type FilterStatus = OrderStatus | "all";

// HÀM HELPER (Giữ nguyên)
const getStatusDisplay = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return { label: "Chờ xử lý", className: "bg-yellow-500/10 text-yellow-400" }
    case "processing":
      return { label: "Đang xử lý", className: "bg-blue-500/10 text-blue-400" }
    case "shipped":
      return { label: "Đang giao", className: "bg-indigo-500/10 text-indigo-400" }
    case "completed": 
      return { label: "Đã giao", className: "bg-green-500/10 text-green-400" }
    case "cancelled":
      return { label: "Đã hủy", className: "bg-red-500/10 text-red-400" }
    default:
      return { label: "Không rõ", className: "bg-gray-500/10 text-gray-400" }
  }
}

export default function OrdersManagement() {
  // ... (Giữ nguyên logic Component cũ của bạn) ...
  // Vì file này khá dài, bạn chỉ cần thay đổi phần Import ở đầu file là được!
  // Logic bên dưới không thay đổi gì cả.
  
  // (Để đảm bảo, tôi paste lại đoạn đầu quan trọng)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await OrderService.getAdminOrders()
      setOrders(data)
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // ... (Phần render return bên dưới giữ nguyên như file cũ của bạn) ...
  // (Lưu ý: Bạn chỉ cần sửa 2 dòng import ở đầu file là xong file này)
  
  // Để tôi viết nốt phần render cho bạn copy-paste cho an toàn:
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.user_full_name && order.user_full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.order_code && order.order_code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.customer_email && order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý Đơn hàng</h1>
          <p className="text-gray-400">Theo dõi và quản lý các đơn đặt hàng của khách hàng</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={fetchOrders} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-gray-800 bg-gray-950 p-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo mã đơn hàng, tên, hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gray-800 bg-black pl-10 text-white placeholder:text-gray-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="rounded-lg border border-gray-800 bg-black px-4 py-2 text-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đang giao hàng</option>
            <option value="completed">Đã giao hàng</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="border-gray-800 bg-gray-950">
        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-400">
            <AlertCircle className="mb-2 h-12 w-12" />
            <p>{error}</p>
            <Button onClick={fetchOrders} className="mt-4 bg-blue-600 hover:bg-blue-700">Thử lại</Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
            <p className="mt-4 text-gray-400">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                  <th className="p-4 font-medium">Mã Đơn hàng</th>
                  <th className="p-4 font-medium">Khách hàng</th>
                  <th className="p-4 font-medium">Ngày đặt</th>
                  <th className="p-4 font-medium">Tổng tiền</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const statusInfo = getStatusDisplay(order.status)
                    return (
                      <tr key={order.id} className="border-b border-gray-800/50 text-sm hover:bg-gray-900/50">
                        <td className="p-4 font-medium text-white">{order.order_code}</td>
                        <td className="p-4 text-gray-300">{order.user_full_name}</td>
                        <td className="p-4 text-gray-300">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                        <td className="p-4 font-medium text-white">{Math.round(order.total_amount).toLocaleString("vi-VN")} ₫</td>
                        <td className="p-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white" title="Xem chi tiết đơn hàng">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      Không tìm thấy đơn hàng nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}