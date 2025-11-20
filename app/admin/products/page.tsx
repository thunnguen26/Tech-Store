// app/admin/products/page.tsx
'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { ProductService, AdminProduct } from "@/services/ProductService"

type ProductCategory = "all" | "phone" | "laptop" | "tablet" | "accessory"
type ProductStatus = "all" | "active" | "out_of_stock" | "draft"

const convertCategoryToSlug = (categoryName: string): ProductCategory => {
  switch (categoryName.toLowerCase()) {
    case 'điện thoại': return 'phone';
    case 'laptop': return 'laptop';
    case 'máy tính bảng': return 'tablet';
    case 'phụ kiện': return 'accessory';
    default: return 'all';
  }
}

export default function ProductsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory>("all")
  const [statusFilter, setStatusFilter] = useState<ProductStatus>("all")
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await ProductService.getAdminProducts()
      setProducts(data)
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.")
      console.error("Error fetching products:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const productCategorySlug = convertCategoryToSlug(product.category);
    const matchesCategory = categoryFilter === "all" || productCategorySlug === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn lưu trữ sản phẩm "${productName}"? \nSản phẩm sẽ bị ẩn khỏi trang bán hàng.`)) {
      return;
    }

    try {
      const result = await ProductService.deleteProduct(productId);
      
      if (result.success) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, status: 'draft' } : p
        ));
        alert(result.message);
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (err: any) {
      alert("Không thể cập nhật sản phẩm. Vui lòng thử lại.");
      console.error("Error archiving product:", err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý sản phẩm</h1>
          <p className="text-gray-400">Quản lý danh sách sản phẩm trong cửa hàng</p>
        </div>
        <Link href="/admin/products/add">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="border-gray-800 bg-gray-950 p-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gray-800 bg-black pl-10 text-white placeholder:text-gray-500"
            />
          </div>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ProductCategory)}
            className="rounded-lg border border-gray-800 bg-black px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="phone">Điện thoại</option>
            <option value="laptop">Laptop</option>
            <option value="tablet">Máy tính bảng</option>
            <option value="accessory">Phụ kiện</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProductStatus)}
            className="rounded-lg border border-gray-800 bg-black px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="out_of_stock">Hết hàng</option>
            <option value="draft">Nháp</option>
          </select>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-950 p-4">
          <div className="text-sm text-gray-400">Tổng sản phẩm</div>
          <div className="mt-2 text-2xl font-bold text-white">{products.length}</div>
        </Card>
        <Card className="border-gray-800 bg-gray-950 p-4">
          <div className="text-sm text-gray-400">Đang bán</div>
          <div className="mt-2 text-2xl font-bold text-green-400">
            {products.filter(p => p.status === "active").length}
          </div>
        </Card>
        <Card className="border-gray-800 bg-gray-950 p-4">
          <div className="text-sm text-gray-400">Hết hàng</div>
          <div className="mt-2 text-2xl font-bold text-red-400">
            {products.filter(p => p.status === "out_of_stock").length}
          </div>
        </Card>
        <Card className="border-gray-800 bg-gray-950 p-4">
          <div className="text-sm text-gray-400">Nháp</div>
          <div className="mt-2 text-2xl font-bold text-yellow-400">
            {products.filter(p => p.status === "draft").length}
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="border-gray-800 bg-gray-950">
        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-400">
            <AlertCircle className="mb-2 h-12 w-12" />
            <p>{error}</p>
            <Button 
              onClick={fetchProducts} 
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Thử lại
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
            <p className="mt-4 text-gray-400">Đang tải danh sách sản phẩm...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                  <th className="p-4 font-medium">Sản phẩm</th>
                  <th className="p-4 font-medium">Danh mục</th>
                  <th className="p-4 font-medium">Giá</th>
                  <th className="p-4 font-medium">Tồn kho</th>
                  <th className="p-4 font-medium">Đã bán</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-800/50 text-sm hover:bg-gray-900/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-800">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium text-white">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{product.category}</td>
                      <td className="p-4 font-medium text-white">{product.price.toLocaleString("vi-VN")} ₫</td>
                      <td className="p-4">
                        <span
                          className={`font-medium ${
                            product.stock === 0 
                              ? "text-red-400" 
                              : product.stock < 20 
                                ? "text-yellow-400" 
                                : "text-green-400"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{product.sold}</td>
                      <td className="p-4">
                        {product.status === "active" ? (
                          <span className="inline-flex rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                            Đang bán
                          </span>
                        ) : product.status === "out_of_stock" ? (
                          <span className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                            Hết hàng
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                            Nháp
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/products/view/${product.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white" title="Xem chi tiết">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white" title="Chỉnh sửa">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-400" 
                            title="Xóa sản phẩm"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-500">
                      {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                        ? "Không tìm thấy sản phẩm phù hợp"
                        : "Chưa có sản phẩm nào"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-800 p-4">
            <p className="text-sm text-gray-400">
              Hiển thị {filteredProducts.length} / {products.length} sản phẩm
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled className="border-gray-800 bg-transparent text-gray-400">
                Trước
              </Button>
              <Button variant="outline" size="sm" className="border-gray-800 bg-blue-600 text-white">
                1
              </Button>
              <Button variant="outline" size="sm" disabled className="border-gray-800 bg-transparent text-gray-400">
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}