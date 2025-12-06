// src/models/Cart.model.ts

export interface CartItem {
  cart_item_id: number;
  variant_id: number;
  product_id: number;
  name: string;
  base_image: string | null;
  size: string | null;
  color_name: string | null;
  price: number;
  original_price: number | null;
  quantity: number;
  stock_quantity?: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
}