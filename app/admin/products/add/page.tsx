// app/admin/products/add/page.tsx
'use client'

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, X, AlertCircle, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Import service
import { ProductService } from "@/services/ProductService"

// Interface cho Variant
export interface VariantFormData {
  id: number; // ID tạm thời ở frontend
  color_name: string;
  color_hex: string;
  size: string;
  price: number;
  original_price: number;
  stock_quantity: number;
  sku: string;
}

// Interface cho Form Data
export interface AddProductFormData {
  name: string;
  description: string;
  brand: string;
  model?: string;
  category: string;
  status: string;
  processor?: string;
  ram?: string;
  storage?: string;
  screen?: string;
  images: File[];
  variants: Omit<VariantFormData, 'id'>[];
}

export default function AddProduct() {
  const router = useRouter()
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State cho các biến thể
  const [variants, setVariants] = useState<VariantFormData[]>([
    { 
      id: 1, 
      color_name: '', 
      color_hex: '#000000',
      size: '', 
      price: 0, 
      original_price: 0,
      stock_quantity: 0, 
      sku: '' 
    }
  ]);

  // Hàm thêm một biến thể mới
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now(),
        color_name: '',
        color_hex: '#000000',
        size: '',
        price: 0,
        original_price: 0,
        stock_quantity: 0,
        sku: ''
      }
    ]);
  };

  // Hàm xóa một biến thể
  const removeVariant = (id: number) => {
    if (variants.length <= 1) {
      alert("Sản phẩm phải có ít nhất một phiên bản.");
      return;
    }
    setVariants(variants.filter(v => v.id !== id));
  };

  // Hàm cập nhật dữ liệu cho một biến thể
  const handleVariantChange = (id: number, field: keyof VariantFormData, value: string | number) => {
    setVariants(variants.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    // Kiểm tra nếu chưa chọn danh mục
    const category = formData.get("category") as string;
    if (!category) {
      setError("Vui lòng chọn danh mục cho sản phẩm.");
      setIsSubmitting(false);
      return;
    }

    // Kiểm tra các biến thể (variants)
    for (const v of variants) {
      if (!v.color_name || !v.size) {
        setError(`Vui lòng điền đầy đủ Màu sắc và Dung lượng cho tất cả phiên bản.`);
        setIsSubmitting(false);
        return;
      }
      if (v.price <= 0) {
        setError(`Phiên bản (${v.color_name}/${v.size}) phải có Giá bán > 0.`);
        setIsSubmitting(false);
        return;
      }
      if (v.stock_quantity < 0) {
        setError(`Phiên bản (${v.color_name}/${v.size}) phải có Tồn kho >= 0.`);
        setIsSubmitting(false);
        return;
      }
    }
    
    const productData: AddProductFormData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      brand: formData.get("brand") as string,
      model: formData.get("model") as string || undefined,
      category: category,
      status: formData.get("status") as string,
      processor: formData.get("processor") as string || undefined,
      ram: formData.get("ram") as string || undefined,
      storage: formData.get("storage") as string || undefined,
      screen: formData.get("screen") as string || undefined,
      images: imageFiles,
      variants: variants.map(({ id, ...rest }) => rest)
    };
    
    const result = await ProductService.addProduct(productData)
    setIsSubmitting(false)

    if (result.success) {
      imagePreviews.forEach(url => URL.revokeObjectURL(url))
      alert(result.message)
      router.push("/admin/products")
    } else {
      setError(result.message)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
      
      setImageFiles([...imageFiles, ...newFiles])
      setImagePreviews([...imagePreviews, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index])
    setImageFiles(imageFiles.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
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
          <p className="text-gray-400 mt-1">Điền thông tin chung và các phiên bản của sản phẩm</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-red-950/50 border border-red-900 p-4">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-400">Có lỗi xảy ra</p>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="border-gray-800 bg-gray-950 p-6">
              <h3 className="text-lg font-semibold text-white mb-5">Thông tin cơ bản</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Tên sản phẩm *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="VD: iPhone 15 Pro Max"
                    className="mt-1.5 h-11 border-gray-800 bg-black text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">Mô tả *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Mô tả chi tiết về sản phẩm..."
                    rows={5}
                    className="mt-1.5 border-gray-800 bg-black text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="brand" className="text-gray-300">Thương hiệu *</Label>
                    <Input
                      id="brand"
                      name="brand"
                      placeholder="VD: Apple"
                      className="mt-1.5 h-11 border-gray-800 bg-black text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model" className="text-gray-300">Model</Label>
                    <Input
                      id="model"
                      name="model"
                      placeholder="VD: A2849"
                      className="mt-1.5 h-11 border-gray-800 bg-black text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Variants Section */}
            <Card className="border-gray-800 bg-gray-950 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-white">Phiên bản sản phẩm</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addVariant}
                  className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phiên bản
                </Button>
              </div>

              <div className="space-y-6">
                {variants.map((variant, index) => (
                  <div key={variant.id} className="p-4 rounded-lg border border-gray-800 bg-gray-900 relative">
                    {/* Nút Xóa phiên bản */}
                    {variants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -top-3 -right-3 h-7 w-7 rounded-full bg-red-600 text-white hover:bg-red-700"
                        onClick={() => removeVariant(variant.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Màu sắc */}
                      <div className="space-y-2">
                        <Label htmlFor={`color-${variant.id}`} className="text-gray-300">Màu sắc *</Label>
                        <Input
                          id={`color-${variant.id}`}
                          placeholder="VD: Titan Xanh"
                          value={variant.color_name}
                          onChange={(e) => handleVariantChange(variant.id, 'color_name', e.target.value)}
                          className="h-11 border-gray-700 bg-black text-white"
                          required
                        />
                      </div>

                      {/* Mã màu Hex */}
                      <div className="space-y-2">
                        <Label htmlFor={`color-hex-${variant.id}`} className="text-gray-300">Mã màu (Hex)</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`color-hex-${variant.id}`}
                            type="color"
                            value={variant.color_hex}
                            onChange={(e) => handleVariantChange(variant.id, 'color_hex', e.target.value)}
                            className="h-11 w-16 border-gray-700 bg-black p-1"
                          />
                          <Input
                            type="text"
                            value={variant.color_hex}
                            onChange={(e) => handleVariantChange(variant.id, 'color_hex', e.target.value)}
                            placeholder="#000000"
                            className="h-11 flex-1 border-gray-700 bg-black text-white"
                          />
                        </div>
                      </div>

                      {/* Dung lượng (Size) */}
                      <div className="space-y-2">
                        <Label htmlFor={`size-${variant.id}`} className="text-gray-300">Dung lượng *</Label>
                        <Input
                          id={`size-${variant.id}`}
                          placeholder="VD: 256GB"
                          value={variant.size}
                          onChange={(e) => handleVariantChange(variant.id, 'size', e.target.value)}
                          className="h-11 border-gray-700 bg-black text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      {/* Giá bán */}
                      <div className="space-y-2">
                        <Label htmlFor={`price-${variant.id}`} className="text-gray-300">Giá bán (₫) *</Label>
                        <Input
                          id={`price-${variant.id}`}
                          type="number"
                          placeholder="0"
                          min="0"
                          step="1000"
                          value={variant.price || ''}
                          onChange={(e) => handleVariantChange(variant.id, 'price', parseFloat(e.target.value) || 0)}
                          required
                          className="h-11 border-gray-700 bg-black text-white [color-scheme:dark]"
                        />
                      </div>

                      {/* Giá gốc */}
                      <div className="space-y-2">
                        <Label htmlFor={`original-price-${variant.id}`} className="text-gray-300">Giá gốc (₫)</Label>
                        <Input
                          id={`original-price-${variant.id}`}
                          type="number"
                          placeholder="0"
                          min="0"
                          step="1000"
                          value={variant.original_price || ''}
                          onChange={(e) => handleVariantChange(variant.id, 'original_price', parseFloat(e.target.value) || 0)}
                          className="h-11 border-gray-700 bg-black text-white [color-scheme:dark]"
                        />
                      </div>

                      {/* Tồn kho */}
                      <div className="space-y-2">
                        <Label htmlFor={`stock-${variant.id}`} className="text-gray-300">Tồn kho *</Label>
                        <Input
                          id={`stock-${variant.id}`}
                          type="number"
                          placeholder="0"
                          min="0"
                          value={variant.stock_quantity || ''}
                          onChange={(e) => handleVariantChange(variant.id, 'stock_quantity', parseInt(e.target.value) || 0)}
                          required
                          className="h-11 border-gray-700 bg-black text-white [color-scheme:dark]"
                        />
                      </div>

                      {/* SKU */}
                      <div className="space-y-2">
                        <Label htmlFor={`sku-${variant.id}`} className="text-gray-300">SKU</Label>
                        <Input
                          id={`sku-${variant.id}`}
                          placeholder="VD: IP15PM-256-NAT"
                          value={variant.sku}
                          onChange={(e) => handleVariantChange(variant.id, 'sku', e.target.value)}
                          className="h-11 border-gray-700 bg-black text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Images */}
            <Card className="border-gray-800 bg-gray-950 p-6">
              <h3 className="text-lg font-semibold text-white mb-5">Hình ảnh</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-900 border border-gray-800 group">
                      <img
                        src={preview}
                        alt={`Ảnh ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-900 hover:border-gray-600 transition-colors">
                    <Upload className="h-8 w-8 text-gray-500" />
                    <span className="mt-2 text-sm text-gray-500">Thêm ảnh</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  💡 Tải lên tối đa 10 ảnh. Ảnh đầu tiên là ảnh đại diện.
                </p>
              </div>
            </Card>

            {/* Specs */}
            <Card className="border-gray-800 bg-gray-950 p-6">
              <h3 className="text-lg font-semibold text-white mb-5">Thông số kỹ thuật</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="processor" className="text-gray-300">Bộ xử lý</Label>
                  <Input
                    id="processor"
                    name="processor"
                    placeholder="VD: Apple A17 Pro"
                    className="mt-1.5 h-11 border-gray-800 bg-black text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="ram" className="text-gray-300">RAM</Label>
                  <Input
                    id="ram"
                    name="ram"
                    placeholder="VD: 8GB"
                    className="mt-1.5 h-11 border-gray-800 bg-black text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="storage" className="text-gray-300">Bộ nhớ</Label>
                  <Input
                    id="storage"
                    name="storage"
                    placeholder="VD: 256GB"
                    className="mt-1.5 h-11 border-gray-800 bg-black text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="screen" className="text-gray-300">Màn hình</Label>
                  <Input
                    id="screen"
                    name="screen"
                    placeholder="VD: 6.7 inch OLED"
                    className="mt-1.5 h-11 border-gray-800 bg-black text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <Card className="border-gray-800 bg-gray-950 p-6">
              <h3 className="text-lg font-semibold text-white mb-5">Phân loại</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category" className="text-gray-300">Danh mục *</Label>
                  <select
                    id="category"
                    name="category"
                    className="mt-1.5 w-full h-11 rounded-lg border border-gray-800 bg-black px-3 text-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
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
                  <Label htmlFor="status" className="text-gray-300">Trạng thái</Label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1.5 w-full h-11 rounded-lg border border-gray-800 bg-black px-3 text-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="active">Đang bán</option>
                    <option value="archived">Lưu trữ</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 h-11" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang thêm...
                  </span>
                ) : (
                  'Thêm sản phẩm'
                )}
              </Button>
              <Link href="/admin/products" className="flex-1">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-11 border-gray-800 text-gray-300 hover:bg-gray-900 hover:text-white"
                >
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