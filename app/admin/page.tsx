// app/admin/page.tsx
'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, DollarSign, ShoppingCart, Package, Users, AlertCircle } from "lucide-react"
import { Line, LineChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

// 1. IMPORT SERVICE VÀ MODEL (ĐÚNG CHUẨN MVC)
import { AdminService } from "@/services/AdminService"
import { DashboardStats } from "@/models/Order.model" // Import từ Model

// Định dạng tiền tệ
const formatCurrency = (value: number) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + ' Tỷ';
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + ' Tr';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(0) + 'K';
  }
  return value.toLocaleString("vi-VN");
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await AdminService.getDashboardStats()
        setStats(data)
      } catch (err) {
        setError("Không thể tải dữ liệu thống kê.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-400">
        <AlertCircle className="mb-2 h-12 w-12" />
        <p>{error || "Không có dữ liệu"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Tổng quan hoạt động kinh doanh</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-800 bg-gray-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Doanh thu (Đã giao)</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {formatCurrency(stats.kpi.totalRevenue)}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span>+{stats.kpi.revenueChange}%</span>
              </div>
            </div>
            <div className="rounded-full bg-blue-500/10 p-3">
              <DollarSign className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="border-gray-800 bg-gray-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tổng đơn hàng</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {stats.kpi.totalOrders.toLocaleString("vi-VN")}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span>+{stats.kpi.ordersChange}%</span>
              </div>
            </div>
            <div className="rounded-full bg-purple-500/10 p-3">
              <ShoppingCart className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="border-gray-800 bg-gray-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Sản phẩm (Đang bán)</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {stats.kpi.totalProducts.toLocaleString("vi-VN")}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-400">
                <span>sản phẩm</span>
              </div>
            </div>
            <div className="rounded-full bg-cyan-500/10 p-3">
              <Package className="h-6 w-6 text-cyan-500" />
            </div>
          </div>
        </Card>

        <Card className="border-gray-800 bg-gray-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tổng khách hàng</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {stats.kpi.totalCustomers.toLocaleString("vi-VN")}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span>+{stats.kpi.customerChange}%</span>
              </div>
            </div>
            <div className="rounded-full bg-green-500/10 p-3">
              <Users className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-800 bg-gray-950 p-6">
          <h3 className="text-lg font-semibold text-white">Doanh thu theo tháng</h3>
          <p className="text-sm text-gray-400">Doanh thu 12 tháng gần nhất</p>
          <div className="mt-6 h-[300px]">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
                  labelStyle={{ color: '#ffffff' }}
                  formatter={(value: number) => [value.toLocaleString("vi-VN") + '₫', 'Doanh thu']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
        </div>
        </Card>


        <Card className="border-gray-800 bg-gray-950 p-6">
          <h3 className="text-lg font-semibold text-white">Đơn hàng 7 ngày qua</h3>
          <p className="text-sm text-gray-400">Số đơn hàng trong tuần</p>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ordersChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280" 
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
                  }}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
                  labelStyle={{ color: '#ffffff' }}
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('vi-VN', { 
                      weekday: 'long',
                      day: '2-digit', 
                      month: '2-digit',
                      year: 'numeric'
                    })
                  }}
                  formatter={(value: number) => [value, 'Đơn hàng']}
                />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>


      <Card className="border-gray-800 bg-gray-950 p-6">
        <h3 className="text-lg font-semibold text-white">Sản phẩm bán chạy</h3>
        <p className="text-sm text-gray-400">Top sản phẩm có doanh thu cao nhất</p>
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                  <th className="pb-3 font-medium">Sản phẩm</th>
                  <th className="pb-3 font-medium">Đã bán</th>
                  <th className="pb-3 font-medium">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.topProducts.length > 0 ? (
                  // 2. ĐỊNH NGHĨA KIỂU DỮ LIỆU CHO product VÀ index
                  stats.topProducts.map((product: any, index: number) => (
                    <tr key={index} className="border-b border-gray-800/50">
                      <td className="py-4 text-white">{product.name}</td>
                      <td className="py-4 text-gray-300">{product.sold} sản phẩm</td>
                      <td className="py-4 font-medium text-blue-400">
                        {Math.round(product.revenue).toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-500">
                      Chưa có dữ liệu sản phẩm bán chạy
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}