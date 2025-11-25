// app/admin/layout.tsx
'use client'

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, Menu, LogOut, ArrowLeft } from "lucide-react"
import { AuthService, User } from "@/services/AuthService"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  // === 1. KIỂM TRA QUYỀN TRUY CẬP ===
  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const currentUser = AuthService.getUser();
    
    // Kiểm tra: Có user không? Và role có phải là 'admin' không?
    if (!currentUser || currentUser.role !== 'admin') {
      // Nếu không phải admin -> Chuyển hướng về trang chủ
      router.push('/'); 
    } else {
      // Nếu đúng là admin -> Cho phép vào
      setUser(currentUser);
      setIsAuthorized(true);
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    AuthService.logout(); 
    router.push('/login');
  }

  // === 2. MÀN HÌNH LOADING (KHI ĐANG KIỂM TRA) ===
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p>Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  // Nếu không có quyền, không hiển thị gì cả (đợi redirect)
  if (!isAuthorized) {
    return null;
  }

  // === 3. GIAO DIỆN ADMIN (KHI ĐÃ CÓ QUYỀN) ===
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
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-red-400 hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
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
            <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Về trang chủ
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}