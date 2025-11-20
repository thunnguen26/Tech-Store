import type React from "react"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, BarChart3, Menu } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-800 bg-black">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-800 px-6">
            <Link href="/admin" className="text-xl font-bold text-white">
              TechStore Admin
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-900 hover:text-white"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-900 hover:text-white"
            >
              <Package className="h-5 w-5" />
              Quản lý sản phẩm
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-900 hover:text-white"
            >
              <ShoppingCart className="h-5 w-5" />
              Quản lý đơn hàng
            </Link>

            <Link
              href="/admin/customers"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-900 hover:text-white"
            >
              <Users className="h-5 w-5" />
              Khách hàng
            </Link>
          </nav>

          {/* User Info */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-gray-400">thuannp.24it@vku.udn.vn</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-800 bg-black/50 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button className="lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-400 hover:text-white">
              Xem trang web
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
