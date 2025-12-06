// src/models/Product.model.ts

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

export interface Review {
  rating: number;
  comment: string | null;
  created_at: string;
  user_name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  features: string | string[] | null | any;
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

// Dữ liệu hiển thị bảng Admin
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

// Dữ liệu Form Thêm/Sửa
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

export interface ReviewFormData {
  user_id: number;
  product_id: number;
  order_id: number;
  rating: number;
  comment: string;
}
// === Thêm Interface cho Tìm kiếm ===
export interface SearchProduct {
  id: number;
  name: string;
  base_image: string;
  price: number;
  category_name: string;
}