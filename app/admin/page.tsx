"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, DollarSign, ShoppingCart, Package, Users } from "lucide-react"
import { Line, LineChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const revenueData = [
  { month: "T1", revenue: 45000000 },
  { month: "T2", revenue: 52000000 },
  { month: "T3", revenue: 48000000 },
  { month: "T4", revenue: 61000000 },
  { month: "T5", revenue: 55000000 },
  { month: "T6", revenue: 67000000 },
  { month: "T7", revenue: 72000000 },
  { month: "T8", revenue: 68000000 },
  { month: "T9", revenue: 75000000 },
  { month: "T10", revenue: 82000000 },
  { month: "T11", revenue: 88000000 },
  { month: "T12", revenue: 95000000 },
]

const ordersData = [
  { day: "T2", orders: 45 },
  { day: "T3", orders: 52 },
  { day: "T4", orders: 48 },
  { day: "T5", orders: 61 },
  { day: "T6", orders: 55 },
  { day: "T7", orders: 67 },
  { day: "CN", orders: 72 },
]

const topProducts = [
  { name: "iPhone 15 Pro Max", sold: 234, revenue: 702000000 },
  { name: "MacBook Pro M3", sold: 156, revenue: 624000000 },
  { name: "Samsung S24 Ultra", sold: 189, revenue: 472500000 },
  { name: "Dell XPS 15", sold: 98, revenue: 294000000 },
  { name: "iPad Pro M2", sold: 145, revenue: 362500000 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Tổng quan hoạt động kinh doanh</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-800 bg-gray-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Doanh thu tháng này</p>
              <p className="mt-2 text-3xl font-bold text-white">95M</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span>+12.5%</span>
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
              <p className="text-sm text-gray-400">Đơn hàng</p>
              <p className="mt-2 text-3xl font-bold text-white">1,234</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span>+8.2%</span>
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
              <p className="text-sm text-gray-400">Sản phẩm</p>
              <p className="mt-2 text-3xl font-bold text-white">856</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-400">
                <span>Đang bán</span>
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
              <p className="text-sm text-gray-400">Khách hàng</p>
              <p className="mt-2 text-3xl font-bold text-white">3,456</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span>+15.3%</span>
              </div>
            </div>
            <div className="rounded-full bg-green-500/10 p-3">
              <Users className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="border-gray-800 bg-gray-950 p-6">
          <h3 className="text-lg font-semibold text-white">Doanh thu theo tháng</h3>
          <p className="text-sm text-gray-400">Biểu đồ doanh thu 12 tháng gần nhất</p>
          <div className="mt-6 h-[300px]">
            <ChartContainer
              config={{
                revenue: {
                  label: "Doanh thu",
                  color: "hsl(200, 100%, 50%)",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>

        {/* Orders Chart */}
        <Card className="border-gray-800 bg-gray-950 p-6">
          <h3 className="text-lg font-semibold text-white">Đơn hàng theo ngày</h3>
          <p className="text-sm text-gray-400">Số đơn hàng trong tuần</p>
          <div className="mt-6 h-[300px]">
            <ChartContainer
              config={{
                orders: {
                  label: "Đơn hàng",
                  color: "hsl(280, 100%, 50%)",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="orders" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="border-gray-800 bg-gray-950 p-6">
        <h3 className="text-lg font-semibold text-white">Sản phẩm bán chạy</h3>
        <p className="text-sm text-gray-400">Top 5 sản phẩm có doanh thu cao nhất</p>
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
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-800/50">
                    <td className="py-4 text-white">{product.name}</td>
                    <td className="py-4 text-gray-300">{product.sold} sản phẩm</td>
                    <td className="py-4 font-medium text-blue-400">{product.revenue.toLocaleString("vi-VN")} ₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}
