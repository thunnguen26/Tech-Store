// app/admin/orders/page.tsx
'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, RefreshCw, AlertCircle } from "lucide-react"
import Link from "next/link"
import { OrderService, AdminOrder } from "@/services/OrderService" 

type OrderStatus = "pending" | "processing" | "shipped" | "completed" | "cancelled";
type FilterStatus = OrderStatus | "all";

const ITEMS_PER_PAGE = 10; // Số đơn hàng mỗi trang

export default function OrdersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.user_full_name && order.user_full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.order_code && order.order_code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.customer_email && order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentOrders = filteredOrders.slice(startIndex, endIndex)

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

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

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  // Tạo array các số trang để hiển thị
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý Đơn hàng</h1>
          <p className="text-gray-400">Theo dõi và quản lý các đơn đặt hàng của khách hàng</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700" 
          onClick={fetchOrders} 
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </div>

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

      <Card className="border-gray-800 bg-gray-950">
        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-400">
            <AlertCircle className="mb-2 h-12 w-12" />
            <p>{error}</p>
            <Button onClick={fetchOrders} className="mt-4 bg-blue-600 hover:bg-blue-700">
              Thử lại
            </Button>
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
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => {
                    const statusInfo = getStatusDisplay(order.status)
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-gray-800/50 text-sm hover:bg-gray-900/50"
                      >
                        <td className="p-4 font-medium text-white">{order.order_code}</td>
                        <td className="p-4 text-gray-300">{order.user_full_name}</td>
                        <td className="p-4 text-gray-300">
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="p-4 font-medium text-white">
                          {Math.round(order.total_amount).toLocaleString("vi-VN")} ₫
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                title="Xem chi tiết đơn hàng"
                              >
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

        {/* Pagination */}
        {!isLoading && !error && filteredOrders.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-800 p-4">
            <p className="text-sm text-gray-400">
              Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} trong tổng số {filteredOrders.length} đơn hàng
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="border-gray-800 text-gray-400 bg-transparent hover:bg-gray-800 disabled:opacity-50"
              >
                Trước
              </Button>
              
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageClick(page as number)}
                    className={`border-gray-800 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 bg-transparent hover:bg-gray-800'
                    }`}
                  >
                    {page}
                  </Button>
                )
              ))}

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="border-gray-800 text-gray-400 bg-transparent hover:bg-gray-800 disabled:opacity-50"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}