// services/ProductService.ts

// === INTERFACES DỮ LIỆU CHUNG ===
export interface ProductVariant {
  id: number;
  product_id: number;
  size: string | null;
  color_name: string | null;
  color_hex: string | null;
  price: number;
  original_price: number | null;
  sku: string | null;
  stock_quantity: number;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  features: string | null | any;
  brand: string | null;
  model: string | null;
  base_image: string | null;
  category_name: string;
  status: string;
  variants: ProductVariant[];
  images: string[];
  rating: number;
  review_count: number;
  reviews: Review[];
}

// === INTERFACE CHO ADMIN ===
export interface AdminProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sold: number;
  status: 'active' | 'out_of_stock' | 'draft';
  image: string;
}

// === INTERFACE CHO FORM ADD/EDIT PRODUCT ===
export interface VariantFormData {
  id?: number;
  color_name: string;
  color_hex: string;
  size: string;
  price: number;
  original_price: number;
  stock_quantity: number;
  sku: string;
}

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

export interface UpdateProductFormData {
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
  existingImages: string[];
  variants: Omit<VariantFormData, 'id'>[];
}

// === ĐÁNH GIÁ ===
export interface ReviewFormData {
  user_id: number;
  product_id: number;
  order_id: number;
  rating: number;
  comment: string;
}

export interface Review {
  rating: number;
  comment: string | null;
  created_at: string;
  user_name: string;
}

// Dữ liệu chi tiết cho trang Edit
export interface AdminProductDetails {
  product: Product;
  variants: ProductVariant[];
  images: string[];
}


export interface CategoryInfo {
  id: number;
  name: string;
  count: number;
}

const API_BASE_URL = 'http://localhost/techstore-api';

export class ProductService {
  /** Lấy tất cả sản phẩm */
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products.php`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi fetch sản phẩm:", error);
      return [];
    }
  }

  /** Lấy chi tiết sản phẩm theo ID */
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/product_detail.php?id=${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error(`Lỗi khi fetch sản phẩm ${id}:`, error);
      return null;
    }
  }

  /** Lấy danh sách sản phẩm cho trang Admin */
  static async getAdminProducts(): Promise<AdminProduct[]> {
    try {
      // GỌI ĐÚNG API ADMIN (admin_products_get.php)
      const response = await fetch(`${API_BASE_URL}/admin/admin_products_get.php`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const products: Product[] = await response.json();
      
      if (!products || products.length === 0) {
        return [];
      }

      const adminProducts = products.map((p): AdminProduct => {
        // Tính tổng tồn kho từ TẤT CẢ các biến thể
        const totalStock = p.variants && p.variants.length > 0 
          ? p.variants.reduce((sum: number, v: ProductVariant) => {
              return sum + (Number(v.stock_quantity) || 0);
            }, 0)
          : 0;
        
        // Lấy giá từ biến thể đầu tiên hoặc giá thấp nhất
        const displayPrice = p.variants && p.variants.length > 0 
          ? Math.min(...p.variants.map(v => Number(v.price) || 0))
          : 0;
        
        const displayOriginalPrice = p.variants && p.variants.length > 0 && p.variants[0].original_price
          ? Number(p.variants[0].original_price)
          : null;

        // Xác định status dựa trên tồn kho và status trong DB
        let status: 'active' | 'out_of_stock' | 'draft';
        if (p.status === 'draft' || p.status === 'archived') {
          status = 'draft';
        } else if (totalStock === 0) {
          status = 'out_of_stock';
        } else {
          status = 'active';
        }

        return {
          id: p.id,
          name: p.name,
          category: p.category_name,
          price: displayPrice,
          originalPrice: displayOriginalPrice || undefined,
          stock: totalStock, // Tổng tồn kho từ tất cả biến thể
          sold: p.review_count * 5,
          status: status,
          image: p.base_image || '/placeholder.svg'
        };
      });

      return adminProducts;

    } catch (error) {
      console.error("Lỗi khi gọi API Admin Products:", error);
      return [];
    }
  }

  /** Xóa (archive) một sản phẩm */
  static async deleteProduct(productId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin_product_delete.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Xóa thất bại' };
      }

      return { success: true, message: data.message };

    } catch (error) {
      console.error("Lỗi khi gọi API xóa sản phẩm:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }

  /** Thêm sản phẩm mới với nhiều variants */
  static async addProduct(productData: AddProductFormData): Promise<{ success: boolean; message: string; productId?: number }> {
    try {
      const formData = new FormData();
      
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('brand', productData.brand);
      formData.append('model', productData.model || '');
      formData.append('category', productData.category);
      formData.append('status', productData.status);
      formData.append('processor', productData.processor || '');
      formData.append('ram', productData.ram || '');
      formData.append('storage', productData.storage || '');
      formData.append('screen', productData.screen || '');

      formData.append('variants', JSON.stringify(productData.variants));

      productData.images.forEach((file) => {
        formData.append('images[]', file, file.name);
      });

      const response = await fetch(`${API_BASE_URL}/admin/admin_product_add.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Thêm sản phẩm thất bại.' };
      }

      return { success: true, message: data.message, productId: data.product_id };

    } catch (error: any) {
      console.error("Lỗi khi gọi API thêm sản phẩm:", error);
      if (error.message.includes('JSON')) {
        return { success: false, message: 'Lỗi nghiêm trọng từ server PHP.' };
      }
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }

  /** CẬP NHẬT sản phẩm */
  static async updateProduct(
    productId: number, 
    productData: UpdateProductFormData
  ): Promise<{ success: boolean; message: string }> {
    try {
      const formData = new FormData();
      
      // Thêm product_id
      formData.append('product_id', productId.toString());
      
      // Thêm các trường cơ bản
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('brand', productData.brand);
      formData.append('model', productData.model || '');
      formData.append('category', productData.category);
      formData.append('status', productData.status);
      formData.append('processor', productData.processor || '');
      formData.append('ram', productData.ram || '');
      formData.append('storage', productData.storage || '');
      formData.append('screen', productData.screen || '');

      // Thêm variants (JSON)
      formData.append('variants', JSON.stringify(productData.variants));

      // Thêm existing images (JSON)
      formData.append('existing_images', JSON.stringify(productData.existingImages));

      // Thêm ảnh mới (nếu có)
      productData.images.forEach((file) => {
        formData.append('images[]', file, file.name);
      });

      // Gửi request
      const response = await fetch(`${API_BASE_URL}/admin/admin_product_update.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Cập nhật sản phẩm thất bại.' };
      }

      return { success: true, message: data.message };

    } catch (error: any) {
      console.error("Lỗi khi gọi API cập nhật sản phẩm:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }

  /** Gửi đánh giá sản phẩm */
  static async submitReview(reviewData: ReviewFormData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/submit_review.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Gửi thất bại' };
      }
      return { success: true, message: data.message };

    } catch (error) {
      console.error("Lỗi khi gọi API gửi đánh giá:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }

  /** Lấy chi tiết 1 sản phẩm (Admin) */
  static async getAdminProductDetails(id: string | number): Promise<AdminProductDetails | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin_product_get_details.php?id=${id}`);
      
      if (!response.ok) {
        console.error("Lỗi khi fetch chi tiết sản phẩm Admin:", response.status);
        return null;
      }
      
      const data: AdminProductDetails = await response.json();
      return data;

    } catch (error) {
      console.error("Lỗi khi gọi API chi tiết sản phẩm Admin:", error);
      return null;
    }
  }

/**  Lấy thông tin danh mục */
static async getCategories(): Promise<CategoryInfo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/get_categories_info.php`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi fetch categories:", error);
    return [];
  }
}

}