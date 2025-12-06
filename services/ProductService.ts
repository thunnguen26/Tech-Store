// services/ProductService.ts - SỬA LẠI ĐỂ HIỂN THỊ ĐÚNG SỐ LƯỢNG ĐÃ BÁN

import {
  Product,
  AdminProduct,
  AddProductFormData,
  UpdateProductFormData,
  AdminProductDetails,
  CategoryInfo,
  ReviewFormData,
  ProductVariant,
} from '@/models/Product.model';

const API_BASE_URL = 'http://localhost/techstore-api';

export class ProductService {
  /** Lấy tất cả sản phẩm (Cho khách hàng) */
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products.php`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi fetch sản phẩm:', error);
      return [];
    }
  }

  /** Lấy chi tiết sản phẩm theo ID */
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product_detail.php?id=${id}`,
      );
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error(`Lỗi khi fetch sản phẩm ${id}:`, error);
      return null;
    }
  }

  /** (ADMIN) Lấy danh sách sản phẩm - ✅ ĐÃ SỬA */
  static async getAdminProducts(): Promise<AdminProduct[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/admin_products_get.php`,
      );
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const products: Product[] = await response.json();

      if (!products || products.length === 0) return [];

      return products.map((p): AdminProduct => {
        const totalStock = p.variants.reduce(
          (sum: number, v: ProductVariant) => sum + v.stock_quantity,
          0,
        );
        const displayPrice = p.variants.length > 0 ? p.variants[0].price : 0;
        const displayOriginalPrice =
          p.variants.length > 0 ? p.variants[0].original_price : 0;

        let status: AdminProduct['status'] = 'draft';
        if (p.status === 'active') {
          status = totalStock > 0 ? 'active' : 'out_of_stock';
        } else if (p.status === 'archived' || p.status === 'draft') {
          status = 'draft';
        }

        return {
          id: p.id,
          name: p.name,
          category: p.category_name,
          price: displayPrice,
          originalPrice: displayOriginalPrice || undefined,
          stock: totalStock,

          // ✅ SỬA: Lấy từ trường 'sold' do PHP trả về
          sold: (p as any).sold || 0,

          status: status,
          image: p.base_image || '/placeholder.svg',
        };
      });
    } catch (error) {
      console.error('Lỗi khi gọi API Admin Products:', error);
      return [];
    }
  }

  /** (ADMIN) Xóa sản phẩm */
  static async deleteProduct(
    productId: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/admin_product_delete.php`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        return { success: false, message: data.message || 'Xóa thất bại' };
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Lỗi khi gọi API xóa sản phẩm:', error);
      return { success: false, message: 'Không thể kết nối.' };
    }
  }

  /** (ADMIN) Thêm sản phẩm */
  static async addProduct(
    productData: AddProductFormData,
  ): Promise<{ success: boolean; message: string; productId?: number }> {
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

      const response = await fetch(
        `${API_BASE_URL}/admin/admin_product_add.php`,
        {
          method: 'POST',
          body: formData,
        },
      );
      const data = await response.json();

      if (!response.ok)
        return { success: false, message: data.message || 'Thêm thất bại.' };
      return {
        success: true,
        message: data.message,
        productId: data.product_id,
      };
    } catch (error: any) {
      console.error('Lỗi thêm sản phẩm:', error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  /** (ADMIN) Cập nhật sản phẩm */
  static async updateProduct(
    productId: number,
    productData: UpdateProductFormData,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const formData = new FormData();
      formData.append('product_id', productId.toString());

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
      formData.append(
        'existing_images',
        JSON.stringify(productData.existingImages),
      );

      productData.images.forEach((file) => {
        formData.append('images[]', file, file.name);
      });

      const response = await fetch(
        `${API_BASE_URL}/admin/admin_product_update.php`,
        {
          method: 'POST',
          body: formData,
        },
      );
      const data = await response.json();

      if (!response.ok)
        return {
          success: false,
          message: data.message || 'Cập nhật thất bại.',
        };
      return { success: true, message: data.message };
    } catch (error: any) {
      console.error('Lỗi cập nhật sản phẩm:', error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  /** (ADMIN) Lấy chi tiết 1 sản phẩm */
  static async getAdminProductDetails(
    id: string | number,
  ): Promise<AdminProductDetails | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/admin_product_get_details.php?id=${id}`,
      );
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Lỗi chi tiết sản phẩm Admin:', error);
      return null;
    }
  }

  /** (KHÁCH HÀNG) Gửi đánh giá */
  static async submitReview(
    reviewData: ReviewFormData,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/submit_review.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await response.json();

      if (!response.ok)
        return { success: false, message: data.message || 'Gửi thất bại' };
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Lỗi gửi đánh giá:', error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  /** Lấy danh sách danh mục */
  static async getCategories(): Promise<CategoryInfo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/get_categories_info.php`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Lỗi fetch categories:', error);
      return [];
    }
  }
}
