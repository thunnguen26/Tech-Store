// services/CartService.ts

import { CartItem, CartResponse } from '@/models/Cart.model';

const API_BASE_URL = 'http://localhost/techstore-api';

export class CartService {
  private static getUserData(): { id: number } | null {
    const userDataString = localStorage.getItem('techstore_user');
    if (!userDataString) return null;
    try {
      return JSON.parse(userDataString);
    } catch (e) {
      return null;
    }
  }

  static async addItem(
    variant_id: number,
    quantity: number,
  ): Promise<CartResponse> {
    const userData = this.getUserData();
    if (!userData) {
      return { success: false, message: 'Người dùng chưa đăng nhập.' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cart_add.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userData.id,
          variant_id: variant_id,
          quantity: quantity,
        }),
      });

      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      console.error('Lỗi thêm vào giỏ:', error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  static async getCart(): Promise<CartItem[]> {
    const userData = this.getUserData();
    if (!userData) return [];

    try {
      const response = await fetch(
        `${API_BASE_URL}/cart_get.php?user_id=${userData.id}`,
      );
      if (!response.ok) return [];

      const data = await response.json();

      // ✅ THÊM: Đảm bảo data có đúng kiểu
      if (!Array.isArray(data)) return [];

      // ✅ THÊM: Parse và validate từng item
      const items: CartItem[] = data.map((item: any) => ({
        cart_item_id: item.cart_item_id,
        variant_id: item.variant_id,
        product_id: item.product_id,
        name: item.name,
        base_image: item.base_image || null,
        size: item.size || null,
        color_name: item.color_name || null,
        price: Number(item.price) || 0,
        original_price: item.original_price
          ? Number(item.original_price)
          : null,
        quantity: Number(item.quantity) || 1,
        stock_quantity: Number(item.stock_quantity) || 0, // ✅ QUAN TRỌNG
      }));

      return items;
    } catch (error) {
      console.error('Lỗi lấy giỏ hàng:', error);
      return [];
    }
  }

  static async updateQuantity(
    cart_item_id: number,
    quantity: number,
  ): Promise<CartResponse> {
    if (quantity <= 0) return this.removeItem(cart_item_id);

    try {
      const response = await fetch(`${API_BASE_URL}/cart_update_quantity.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_item_id, quantity }),
      });

      if (!response.ok) {
        return { success: false, message: 'Lỗi cập nhật số lượng.' };
      }

      const data = await response.json();
      return { success: true, message: data.message || 'Cập nhật thành công.' };
    } catch (error) {
      console.error('Lỗi cập nhật số lượng:', error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  static async removeItem(cart_item_id: number): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart_remove_item.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_item_id }),
      });

      if (!response.ok) {
        return { success: false, message: 'Lỗi xóa sản phẩm.' };
      }

      const data = await response.json();
      return { success: true, message: data.message || 'Xóa thành công.' };
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }
}
