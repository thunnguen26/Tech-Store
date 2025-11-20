// app/admin/products/view/[id]/page.tsx
'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, AlertCircle, Package, DollarSign, Box, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"

import { ProductService, AdminProductDetails } from "@/services/ProductService"

export default function ViewProductPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [productData, setProductData] = useState<AdminProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      router.push("/admin/products");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await ProductService.getAdminProductDetails(id);
        if (data) {
          setProductData(data);
        } else {
          setError("Không tìm thấy sản phẩm.");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="space-y-6">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <div className="text-center py-20 text-red-400">
          <AlertCircle className="mx-auto h-10 w-10 mb-4" />
          <p className="text-lg mb-2">{error || "Không tìm thấy sản phẩm"}</p>
        </div>
      </div>
    );
  }

  const { product, variants, images } = productData;
  
  // Tính toán thống kê
  const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);
  const minPrice = Math.min(...variants.map(v => v.price));
  const maxPrice = Math.max(...variants.map(v => v.price));
  const avgPrice = variants.reduce((sum, v) => sum + v.price, 0) / variants.length;
  
  // Parse features
  const features = typeof product.features === 'string' 
    ? JSON.parse(product.features) 
    : product.features || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
            <p className="text-gray-400 mt-1">Chi tiết sản phẩm</p>
          </div>
        </div>
        <Link href={`/admin/products/edit/${product.id}`}>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-950 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Tổng tồn kho</div>
              <div className="text-2xl font-bold text-white">{totalStock}</div>
            </div>
          </div>
        </Card>
        
        <Card className="border-gray-800 bg-gray-950 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/10 p-3">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Giá trung bình</div>
              <div className="text-2xl font-bold text-white">{avgPrice.toLocaleString('vi-VN')}₫</div>
            </div>
          </div>
        </Card>
        
        <Card className="border-gray-800 bg-gray-950 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-3">
              <Box className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Số biến thể</div>
              <div className="text-2xl font-bold text-white">{variants.length}</div>
            </div>
          </div>
        </Card>
        
        <Card className="border-gray-800 bg-gray-950 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-500/10 p-3">
              <TrendingUp className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Trạng thái</div>
              <div className="mt-1">
                {product.status === "active" ? (
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Đang bán</Badge>
                ) : product.status === "draft" ? (
                  <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Nháp</Badge>
                ) : (
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Hết hàng</Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          <Card className="border-gray-800 bg-gray-950 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Hình ảnh sản phẩm</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
                  <Image 
                    src={img} 
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-blue-600 text-white">Ảnh chính</Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Product Description */}
          <Card className="border-gray-800 bg-gray-950 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Mô tả sản phẩm</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </Card>

          {/* Variants Table */}
          <Card className="border-gray-800 bg-gray-950 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Các biến thể ({variants.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                    <th className="pb-3 font-medium">Màu sắc</th>
                    <th className="pb-3 font-medium">Dung lượng</th>
                    <th className="pb-3 font-medium">Giá bán</th>
                    <th className="pb-3 font-medium">Giá gốc</th>
                    <th className="pb-3 font-medium">Tồn kho</th>
                    <th className="pb-3 font-medium">SKU</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => (
                    <tr key={variant.id} className="border-b border-gray-800/50 text-sm">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-5 w-5 rounded border border-gray-700"
                            style={{ backgroundColor: variant.color_hex || '#000' }}
                          />
                          <span className="text-white">{variant.color_name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-300">{variant.size}</td>
                      <td className="py-3 font-medium text-white">
                        {variant.price.toLocaleString('vi-VN')}₫
                      </td>
                      <td className="py-3 text-gray-400 line-through">
                        {variant.original_price ? `${variant.original_price.toLocaleString('vi-VN')}₫` : '-'}
                      </td>
                      <td className="py-3">
                        <span className={`font-medium ${
                          variant.stock_quantity === 0 ? 'text-red-400' : 
                          variant.stock_quantity < 10 ? 'text-yellow-400' : 
                          'text-green-400'
                        }`}>
                          {variant.stock_quantity}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 font-mono text-xs">
                        {variant.sku || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-700">
                    <td colSpan={4} className="pt-3 text-right font-semibold text-white">
                      Tổng tồn kho:
                    </td>
                    <td className="pt-3 font-bold text-green-400 text-lg">
                      {totalStock}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="border-gray-800 bg-gray-950 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Thông tin cơ bản</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400">Thương hiệu</div>
                <div className="mt-1 text-white font-medium">{product.brand}</div>
              </div>
              {product.model && (
                <div>
                  <div className="text-sm text-gray-400">Model</div>
                  <div className="mt-1 text-white font-medium">{product.model}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-400">Danh mục</div>
                <div className="mt-1">
                  <Badge variant="outline" className="border-gray-700 text-gray-300">
                    {product.category_name}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Khoảng giá</div>
                <div className="mt-1 text-white font-medium">
                  {minPrice === maxPrice 
                    ? `${minPrice.toLocaleString('vi-VN')}₫`
                    : `${minPrice.toLocaleString('vi-VN')}₫ - ${maxPrice.toLocaleString('vi-VN')}₫`
                  }
                </div>
              </div>
            </div>
          </Card>

          {/* Technical Specs */}
          {Object.keys(features).length > 0 && (
            <Card className="border-gray-800 bg-gray-950 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Thông số kỹ thuật</h3>
              <div className="space-y-3">
                {features.processor && (
                  <div>
                    <div className="text-sm text-gray-400">Bộ xử lý</div>
                    <div className="mt-1 text-white">{features.processor}</div>
                  </div>
                )}
                {features.ram && (
                  <div>
                    <div className="text-sm text-gray-400">RAM</div>
                    <div className="mt-1 text-white">{features.ram}</div>
                  </div>
                )}
                {features.storage && (
                  <div>
                    <div className="text-sm text-gray-400">Bộ nhớ</div>
                    <div className="mt-1 text-white">{features.storage}</div>
                  </div>
                )}
                {features.screen && (
                  <div>
                    <div className="text-sm text-gray-400">Màn hình</div>
                    <div className="mt-1 text-white">{features.screen}</div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Stock Alert */}
          {totalStock < 20 && (
            <Card className="border-yellow-800 bg-yellow-950/20 p-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-1">
                    Cảnh báo tồn kho thấp
                  </h4>
                  <p className="text-sm text-yellow-300/80">
                    Sản phẩm sắp hết hàng. Vui lòng nhập thêm để tránh thiếu hàng.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}