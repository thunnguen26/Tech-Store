"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "Điện thoại",
    price: 29990000,
    stock: 45,
    sold: 234,
    status: "active",
    image: "/iphone-15-pro-max.jpg",
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    category: "Laptop",
    price: 39990000,
    stock: 23,
    sold: 156,
    status: "active",
    image: "/macbook-pro-m3.jpg",
  },
  {
    id: 3,
    name: "Samsung S24 Ultra",
    category: "Điện thoại",
    price: 24990000,
    stock: 67,
    sold: 189,
    status: "active",
    image: "/samsung-s24-ultra.jpg",
  },
  {
    id: 4,
    name: "Dell XPS 15",
    category: "Laptop",
    price: 29990000,
    stock: 12,
    sold: 98,
    status: "active",
    image: "/dell-xps-15.jpg",
  },
  {
    id: 5,
    name: "iPad Pro M2",
    category: "Máy tính bảng",
    price: 24990000,
    stock: 34,
    sold: 145,
    status: "active",
    image: "/ipad-pro-m2.jpg",
  },
  {
    id: 6,
    name: "AirPods Pro 2",
    category: "Phụ kiện",
    price: 5990000,
    stock: 0,
    sold: 312,
    status: "out_of_stock",
    image: "/airpods-pro-2.jpg",
  },
]

export default function ProductsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products] = useState(mockProducts)

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
          <select className="rounded-lg border border-gray-800 bg-black px-4 py-2 text-white">
            <option>Tất cả danh mục</option>
            <option>Điện thoại</option>
            <option>Laptop</option>
            <option>Máy tính bảng</option>
            <option>Phụ kiện</option>
          </select>
          <select className="rounded-lg border border-gray-800 bg-black px-4 py-2 text-white">
            <option>Tất cả trạng thái</option>
            <option>Đang bán</option>
            <option>Hết hàng</option>
          </select>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="border-gray-800 bg-gray-950">
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
              {filteredProducts.map((product) => (
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
                      className={`${
                        product.stock === 0 ? "text-red-400" : product.stock < 20 ? "text-yellow-400" : "text-green-400"
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
                    ) : (
                      <span className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                        Hết hàng
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-800 p-4">
          <p className="text-sm text-gray-400">Hiển thị 1-6 trong tổng số 6 sản phẩm</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="border-gray-800 text-gray-400 bg-transparent">
              Trước
            </Button>
            <Button variant="outline" size="sm" className="border-gray-800 bg-blue-600 text-white">
              1
            </Button>
            <Button variant="outline" size="sm" disabled className="border-gray-800 text-gray-400 bg-transparent">
              Sau
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
