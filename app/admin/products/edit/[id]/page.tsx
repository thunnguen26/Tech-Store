// app/admin/products/edit/[id]/page.tsx
'use client'

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, X, AlertCircle, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"

// IMPORT TỪ MODEL VÀ SERVICE
import { 
  ProductService 
} from "@/services/ProductService"
import { 
  AdminProductDetails, 
  VariantFormData, 
  UpdateProductFormData 
} from "@/models/Product.model" 

// === COMPONENT CON: FORM CHỈNH SỬA ===
function EditProductForm({ initialData }: { initialData: AdminProductDetails }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { product, variants: initialVariants, images: initialImages } = initialData;

  // State cho ảnh
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialImages)

  // State cho biến thể
  const [variants, setVariants] = useState<VariantFormData[]>(
    initialVariants.map((v, i) => ({
      id: v.id || Date.now() + i,
      color_name: v.color_name || '',
      color_hex: v.color_hex || '#000000',
      size: v.size || '',
      price: v.price || 0,
      original_price: v.original_price || 0,
      stock_quantity: v.stock_quantity || 0,
      sku: v.sku || ''
    }))
  );

  // === SỬA LỖI: LOGIC XỬ LÝ THÔNG SỐ KỸ THUẬT (SPECS) ===
  // 1. Tạo biến chứa dữ liệu chuẩn
  let specs = {
    processor: '',
    ram: '',
    storage: '',
    screen: ''
  };

  // 2. Xử lý dữ liệu đầu vào (bất kể nó là gì)
  const featuresData = product.features;

  // Trường hợp A: Dữ liệu là Mảng chuỗi (VD: ["RAM: 8GB", "CPU: M3"])
  if (Array.isArray(featuresData)) {
    featuresData.forEach((item: any) => {
      const str = String(item);
      const sep = str.indexOf(':');
      if (sep !== -1) {
        const key = str.substring(0, sep).trim().toLowerCase();
        const val = str.substring(sep + 1).trim();
        
        if (key.includes('xử lý') || key.includes('cpu') || key.includes('chip')) specs.processor = val;
        else if (key.includes('ram')) specs.ram = val;
        else if (key.includes('nhớ') || key.includes('rom') || key.includes('dung lượng')) specs.storage = val;
        else if (key.includes('hình') || key.includes('display')) specs.screen = val;
      }
    });
  }
  // Trường hợp B: Dữ liệu là JSON String (VD: "{\"processor\":\"M3\"}")
  else if (typeof featuresData === 'string') {
    try {
      const parsed = JSON.parse(featuresData);
      if (!Array.isArray(parsed)) {
         // Nếu parse ra object -> gộp vào specs
         specs = { ...specs, ...parsed };
      } else {
         // Nếu parse ra mảng -> chạy lại logic mảng (giống trường hợp A)
         parsed.forEach((item: any) => {
            const str = String(item);
            const sep = str.indexOf(':');
            if (sep !== -1) {
                const key = str.substring(0, sep).trim().toLowerCase();
                const val = str.substring(sep + 1).trim();
                if (key.includes('xử lý') || key.includes('cpu')) specs.processor = val;
                else if (key.includes('ram')) specs.ram = val;
                else if (key.includes('nhớ') || key.includes('storage')) specs.storage = val;
                else if (key.includes('hình')) specs.screen = val;
            }
         });
      }
    } catch (e) {}
  }
  // Trường hợp C: Dữ liệu là Object thuần (Do Admin vừa update)
  else if (typeof featuresData === 'object' && featuresData !== null) {
     // Ép kiểu về any để tránh lỗi TypeScript, sau đó gộp vào specs
     specs = { ...specs, ...(featuresData as any) };
  }

  // 3. Tạo biến finalSpecs để dùng cho defaultValue của Input
  // (Ưu tiên lấy từ các cột riêng nếu CSDL bạn có, nếu không thì lấy từ specs vừa xử lý)
  const finalSpecs = {
    processor: (product as any).processor || specs.processor,
    ram: (product as any).ram || specs.ram,
    storage: (product as any).storage || specs.storage,
    screen: (product as any).screen || specs.screen
  };
  // ======================================================

  // === XỬ LÝ BIẾN THỂ ===
  const addVariant = () => {
    setVariants([...variants, {
      id: Date.now(),
      color_name: '',
      color_hex: '#000000',
      size: '',
      price: 0,
      original_price: 0,
      stock_quantity: 0,
      sku: ''
    }]);
  };

  const removeVariant = (id: number) => {
    if (variants.length <= 1) {
      alert("Phải có ít nhất 1 biến thể!");
      return;
    }
    setVariants(variants.filter(v => v.id !== id));
  };

  const handleVariantChange = (id: number, field: keyof VariantFormData, value: string | number) => {
    setVariants(variants.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  // === XỬ LÝ ẢNH ===
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setImageFiles([...imageFiles, ...newFiles]);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };
  
  const removeImage = (index: number) => {
    const imageToRemove = imagePreviews[index];
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));

    // Nếu là ảnh mới (File object)
    const fileIndex = imageFiles.findIndex(f => URL.createObjectURL(f) === imageToRemove);
    if (fileIndex > -1) {
      setImageFiles(imageFiles.filter((_, i) => i !== fileIndex));
      URL.revokeObjectURL(imageToRemove);
    }
  };

  // === XỬ LÝ SUBMIT ===
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // Validation
    if (variants.length === 0) {
      setError("Phải có ít nhất 1 biến thể!");
      setIsSubmitting(false);
      return;
    }

    if (imagePreviews.length === 0) {
      setError("Phải có ít nhất 1 hình ảnh!");
      setIsSubmitting(false);
      return;
    }

    // Kiểm tra giá trị của variants
    for (const v of variants) {
      if (!v.color_name || !v.size || v.price <= 0 || v.stock_quantity < 0) {
        setError("Vui lòng điền đầy đủ thông tin biến thể!");
        setIsSubmitting(false);
        return;
      }
    }

    // Gửi dữ liệu Update (bao gồm cả specs riêng lẻ)
    const productData: UpdateProductFormData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      brand: formData.get("brand") as string,
      model: formData.get("model") as string || undefined,
      category: formData.get("category") as string,
      status: formData.get("status") as string,
      
      // Gửi các thông số kỹ thuật
      processor: formData.get("processor") as string || undefined,
      ram: formData.get("ram") as string || undefined,
      storage: formData.get("storage") as string || undefined,
      screen: formData.get("screen") as string || undefined,
      
      images: imageFiles,
      existingImages: imagePreviews.filter(url => url.startsWith('http')),
      variants: variants.map(({ id, ...rest }) => rest)
    };
    
    try {
      const result = await ProductService.updateProduct(product.id, productData);
      
      if (result.success) {
        alert(result.message);
        router.push("/admin/products");
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi cập nhật sản phẩm.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 rounded-lg border border-red-800 bg-red-950/50 p-4 text-red-400">
          <AlertCircle className="inline mr-2 h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Info */}
          <Card className="border-gray-800 bg-gray-950 p-6">
            <h3 className="text-lg font-semibold text-white mb-5">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Tên sản phẩm *</Label>
                <Input id="name" name="name" defaultValue={product.name} required
                  className="mt-1.5 h-11 border-gray-800 bg-black text-white" />
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-300">Mô tả *</Label>
                <Textarea id="description" name="description" defaultValue={product.description || ''} required
                  className="mt-1.5 border-gray-800 bg-black text-white" rows={5} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="brand" className="text-gray-300">Thương hiệu *</Label>
                  <Input id="brand" name="brand" defaultValue={product.brand || ''} required
                    className="mt-1.5 h-11 border-gray-800 bg-black text-white" />
                </div>
                <div>
                  <Label htmlFor="model" className="text-gray-300">Model</Label>
                  <Input id="model" name="model" defaultValue={product.model || ''}
                    className="mt-1.5 h-11 border-gray-800 bg-black text-white" />
                </div>
              </div>
            </div>
          </Card>

          {/* Variants Section */}
          <Card className="border-gray-800 bg-gray-950 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">Phiên bản sản phẩm</h3>
              <Button type="button" onClick={addVariant} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Thêm biến thể
              </Button>
            </div>
            
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={variant.id} className="rounded-lg border border-gray-800 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-400">Biến thể #{index + 1}</span>
                    {variants.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeVariant(variant.id!)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label className="text-gray-300 text-sm">Màu sắc *</Label>
                      <Input 
                        value={variant.color_name}
                        onChange={(e) => handleVariantChange(variant.id!, 'color_name', e.target.value)}
                        placeholder="VD: Xanh dương"
                        className="mt-1 h-10 border-gray-800 bg-black text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Mã màu *</Label>
                      <div className="flex gap-2 mt-1">
                        <Input 
                          type="color"
                          value={variant.color_hex}
                          onChange={(e) => handleVariantChange(variant.id!, 'color_hex', e.target.value)}
                          className="h-10 w-16 border-gray-800 bg-black p-1"
                        />
                        <Input 
                          value={variant.color_hex}
                          onChange={(e) => handleVariantChange(variant.id!, 'color_hex', e.target.value)}
                          placeholder="#000000"
                          className="h-10 flex-1 border-gray-800 bg-black text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <Label className="text-gray-300 text-sm">Dung lượng *</Label>
                      <Input 
                        value={variant.size}
                        onChange={(e) => handleVariantChange(variant.id!, 'size', e.target.value)}
                        placeholder="VD: 256GB"
                        className="mt-1 h-10 border-gray-800 bg-black text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Giá bán (₫) *</Label>
                      <Input 
                        type="number"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(variant.id!, 'price', Number(e.target.value))}
                        className="mt-1 h-10 border-gray-800 bg-black text-white"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Giá gốc (₫)</Label>
                      <Input 
                        type="number"
                        value={variant.original_price}
                        onChange={(e) => handleVariantChange(variant.id!, 'original_price', Number(e.target.value))}
                        className="mt-1 h-10 border-gray-800 bg-black text-white"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label className="text-gray-300 text-sm">Số lượng *</Label>
                      <Input 
                        type="number"
                        value={variant.stock_quantity}
                        onChange={(e) => handleVariantChange(variant.id!, 'stock_quantity', Number(e.target.value))}
                        className="mt-1 h-10 border-gray-800 bg-black text-white"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Mã SKU</Label>
                      <Input 
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(variant.id!, 'sku', e.target.value)}
                        placeholder="VD: IP15-BL-256"
                        className="mt-1 h-10 border-gray-800 bg-black text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Images */}
          <Card className="border-gray-800 bg-gray-950 p-6">
            <h3 className="text-lg font-semibold text-white mb-5">Hình ảnh sản phẩm</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg border border-gray-800 bg-gray-900 overflow-hidden group">
                    <Image 
                      src={preview} 
                      alt={`Product ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-800 bg-gray-900 hover:border-gray-700 hover:bg-gray-900/50">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-400">Tải ảnh lên</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-400">
                Ảnh đầu tiên sẽ là ảnh đại diện. Chấp nhận: JPG, PNG, WebP (tối đa 5MB/ảnh)
              </p>
            </div>
          </Card>

        
         {/* Specs - Thông số kỹ thuật (SỬA: Dùng finalSpecs) */}
         <Card className="border-gray-800 bg-gray-950 p-6">
            <h3 className="text-lg font-semibold text-white mb-5">Thông số kỹ thuật</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="processor" className="text-gray-300">Bộ xử lý</Label>
                <Input 
                  id="processor" 
                  name="processor" 
                  defaultValue={finalSpecs.processor} 
                  placeholder="VD: Apple M4"
                  className="mt-1.5 h-11 border-gray-800 bg-black text-white" 
                />
              </div>
              <div>
                <Label htmlFor="ram" className="text-gray-300">RAM</Label>
                <Input 
                  id="ram" 
                  name="ram" 
                  defaultValue={finalSpecs.ram}
                  placeholder="VD: 8GB"
                  className="mt-1.5 h-11 border-gray-800 bg-black text-white" 
                />
              </div>
              <div>
                <Label htmlFor="storage" className="text-gray-300">Bộ nhớ</Label>
                <Input 
                  id="storage" 
                  name="storage" 
                  defaultValue={finalSpecs.storage} 
                  placeholder="VD: 256GB"
                  className="mt-1.5 h-11 border-gray-800 bg-black text-white" 
                />
              </div>
              <div>
                <Label htmlFor="screen" className="text-gray-300">Màn hình</Label>
                <Input 
                  id="screen" 
                  name="screen" 
                  defaultValue={finalSpecs.screen} 
                  placeholder="VD: 11 inch Ultra Retina XDR"
                  className="mt-1.5 h-11 border-gray-800 bg-black text-white" 
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-gray-800 bg-gray-950 p-6">
            <h3 className="text-lg font-semibold text-white mb-5">Phân loại</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category" className="text-gray-300">Danh mục *</Label>
                <select
                  id="category"
                  name="category"
                  defaultValue={
                    product.category_name.toLowerCase() === 'điện thoại' ? 'phone' :
                    product.category_name.toLowerCase() === 'máy tính bảng' ? 'tablet' :
                    product.category_name.toLowerCase() === 'phụ kiện' ? 'accessory' :
                    'laptop'
                  }
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
                  defaultValue={product.status}
                  className="mt-1.5 w-full h-11 rounded-lg border border-gray-800 bg-black px-3 text-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="active">Đang bán (Active)</option>
                  <option value="draft">Nháp (Draft)</option>
                  <option value="archived">Lưu trữ (Archived)</option>
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
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
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
  );
}

// === COMPONENT CHÍNH - LOADER ===
export default function EditProductPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Chỉnh sửa sản phẩm</h1>
          <p className="text-gray-400 mt-1">Cập nhật thông tin cho {productData.product.name}</p>
        </div>
      </div>
      
      <EditProductForm initialData={productData} />
    </div>
  );
}