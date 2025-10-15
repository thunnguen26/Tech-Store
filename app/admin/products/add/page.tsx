"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AddProduct() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    router.push("/admin/products")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Thêm sản phẩm mới</h1>
          <p className="text-gray-400">Điền thông tin sản phẩm bên dưới</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-800 bg-gray-950 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Thông tin cơ bản</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">
                    Tên sản phẩm
                  </Label>
                  <Input
                    id="name"
                    placeholder="VD: iPhone 15 Pro Max"
                    className="border-gray-800 bg-black text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">
                    Mô tả
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết về sản phẩm..."
                    rows={6}
                    className="border-gray-800 bg-black text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="brand" className="text-gray-300">
                      Thương hiệu
                    </Label>
                    <Input
                      id="brand"
                      placeholder="VD: Apple"
                      className="border-gray-800 bg-black text-white placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="model" className="text-gray-300">
                      Model
                    </Label>
                    <Input
                      id="model"
                      placeholder="VD: A2849"
                      className="border-gray-800 bg-black text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-gray-800 bg-gray-950 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Hình ảnh sản phẩm</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Product ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-900 hover:border-gray-600">
                    <Upload className="h-8 w-8 text-gray-500" />
                    <span className="mt-2 text-sm text-gray-500">Tải ảnh lên</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
            </Card>

            <Card className="border-gray-800 bg-gray-950 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Thông số kỹ thuật</h3>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="processor" className="text-gray-300">
                      Bộ xử lý
                    </Label>
                    <Input
                      id="processor"
                      placeholder="VD: Apple A17 Pro"
                      className="border-gray-800 bg-black text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ram" className="text-gray-300">
                      RAM
                    </Label>
                    <Input
                      id="ram"
                      placeholder="VD: 8GB"
                      className="border-gray-800 bg-black text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="storage" className="text-gray-300">
                      Bộ nhớ
                    </Label>
                    <Input
                      id="storage"
                      placeholder="VD: 256GB"
                      className="border-gray-800 bg-black text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="screen" className="text-gray-300">
                      Màn hình
                    </Label>
                    <Input
                      id="screen"
                      placeholder="VD: 6.7 inch"
                      className="border-gray-800 bg-black text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-gray-800 bg-gray-950 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Giá & Kho</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price" className="text-gray-300">
                    Giá bán (₫)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    className="border-gray-800 bg-black text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="compare_price" className="text-gray-300">
                    Giá so sánh (₫)
                  </Label>
                  <Input
                    id="compare_price"
                    type="number"
                    placeholder="0"
                    className="border-gray-800 bg-black text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="stock" className="text-gray-300">
                    Số lượng tồn kho
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    className="border-gray-800 bg-black text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sku" className="text-gray-300">
                    SKU
                  </Label>
                  <Input
                    id="sku"
                    placeholder="VD: IP15PM-256-BLK"
                    className="border-gray-800 bg-black text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            </Card>

            <Card className="border-gray-800 bg-gray-950 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Phân loại</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category" className="text-gray-300">
                    Danh mục
                  </Label>
                  <select
                    id="category"
                    className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-white"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="phone">Điện thoại</option>
                    <option value="laptop">Laptop</option>
                    <option value="tablet">Máy tính bảng</option>
                    <option value="accessory">Phụ kiện</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="status" className="text-gray-300">
                    Trạng thái
                  </Label>
                  <select
                    id="status"
                    className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-white"
                  >
                    <option value="active">Đang bán</option>
                    <option value="draft">Nháp</option>
                    <option value="archived">Lưu trữ</option>
                  </select>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Thêm sản phẩm
              </Button>
              <Link href="/admin/products" className="flex-1">
                <Button type="button" variant="outline" className="w-full border-gray-800 text-gray-300 bg-transparent">
                  Hủy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
