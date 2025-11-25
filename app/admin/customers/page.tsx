// app/admin/customers/page.tsx
'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, UserPlus, AlertCircle } from "lucide-react"
import Link from "next/link"

// Import service và type
import { AdminService, AdminCustomer } from "@/services/AdminService"

type CustomerStatus = "active" | "inactive";
type FilterStatus = CustomerStatus | "all";

export default function CustomersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [customers, setCustomers] = useState<AdminCustomer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch customers từ API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await AdminService.getAdminCustomers()
        setCustomers(data)
      } catch (err) {
        setError("Không thể tải danh sách khách hàng. Vui lòng thử lại.")
        console.error("Error fetching customers:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // Logic lọc khách hàng
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Hàm xử lý xóa khách hàng
  const handleDeleteCustomer = async (customerId: number, customerName: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customerName}"? \nLƯU Ý: Toàn bộ đơn hàng và giỏ hàng của họ cũng sẽ bị xóa vĩnh viễn!`)) {
          return;
        }
    
        try {
          // 1. Gọi API xóa
          const result = await AdminService.deleteCustomer(customerId);
          
          if (result.success) {
            // 2. Cập nhật state local CHỈ KHI API THÀNH CÔNG
            setCustomers(customers.filter(c => c.id !== customerId));
    //         alert("Xóa khách hàng thành công!");
          } else {
            // 3. Hiển thị lỗi nếu API thất bại
            alert(result.message);
          }
        } catch (err) {
          alert("Không thể xóa khách hàng. Vui lòng thử lại.");
          console.error("Error deleting customer:", err);
        }
      }

  // Định dạng hiển thị trạng thái
  const getStatusDisplay = (status: CustomerStatus) => {
    switch (status) {
      case "active":
        return { label: "Hoạt động", className: "bg-green-500/10 text-green-400" }
      case "inactive":
        return { label: "Khóa", className: "bg-red-500/10 text-red-400" }
      default:
        return { label: "Không rõ", className: "bg-gray-500/10 text-gray-400" }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý Khách hàng</h1>
          <p className="text-gray-400">Quản lý danh sách, thông tin và tài khoản khách hàng</p>
        </div>
        <Link href="/admin/customers/add">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Thêm khách hàng
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="border-gray-800 bg-gray-950 p-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gray-800 bg-black pl-10 text-white placeholder:text-gray-500"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="rounded-lg border border-gray-800 bg-black px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Khóa</option>
          </select>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-gray-800 bg-gray-950 p-4">
          <div className="text-sm text-gray-400">Tổng khách hàng</div>
          <div className="mt-2 text-2xl font-bold text-white">{customers.length}</div>
        </Card>
        <Card className="border-gray-800 bg-gray-950 p-4">
          <div className="text-sm text-gray-400">Đang hoạt động</div>
          <div className="mt-2 text-2xl font-bold text-green-400">
            {customers.filter(c => c.status === "active").length}
          </div>
        </Card>
        <Card className="border-gray-800 bg-gray-950 p-4">
          <div className="text-sm text-gray-400">Đã khóa</div>
          <div className="mt-2 text-2xl font-bold text-red-400">
            {customers.filter(c => c.status === "inactive").length}
          </div>
        </Card>
      </div>

      {/* Customers Table */}
      <Card className="border-gray-800 bg-gray-950">
        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-400">
            <AlertCircle className="mb-2 h-12 w-12" />
            <p>{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Thử lại
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
            <p className="mt-4 text-gray-400">Đang tải danh sách khách hàng...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                  <th className="p-4 font-medium">Tên Khách hàng</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">SĐT</th>
                  <th className="p-4 font-medium">Đơn hàng</th>
                  <th className="p-4 font-medium">Tổng chi tiêu</th>
                  <th className="p-4 font-medium">Ngày tham gia</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => {
                    const statusInfo = getStatusDisplay(customer.status)
                    return (
                      <tr key={customer.id} className="border-b border-gray-800/50 text-sm hover:bg-gray-900/50">
                        <td className="p-4 font-medium text-white">{customer.name}</td>
                        <td className="p-4 text-gray-300">{customer.email}</td>
                        <td className="p-4 text-gray-300">{customer.phone}</td>
                        <td className="p-4 text-gray-300">{customer.totalOrders}</td>
                        <td className="p-4 font-medium text-white">
                          {customer.totalSpent.toLocaleString("vi-VN")} ₫
                        </td>
                        <td className="p-4 text-gray-300">
                          {new Date(customer.joinDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/customers/edit/${customer.id}`}>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white" 
                                title="Chỉnh sửa thông tin"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-400" 
                              title="Xóa tài khoản"
                              onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-gray-500">
                      {searchQuery || statusFilter !== "all" 
                        ? "Không tìm thấy khách hàng phù hợp" 
                        : "Chưa có khách hàng nào"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Footer info */}
      {!isLoading && !error && filteredCustomers.length > 0 && (
        <div className="text-center text-sm text-gray-400">
          Hiển thị {filteredCustomers.length} / {customers.length} khách hàng
        </div>
      )}
    </div>
  )
}