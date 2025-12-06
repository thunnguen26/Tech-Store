// services/CartService.ts

import { CartItem, CartResponse } from "@/models/Cart.model";

const API_BASE_URL = 'http://localhost/techstore-api';

export class CartService {

  private static getUserData(): { id: number } | null {
    const userDataString = localStorage.getItem('techstore_user');
    if (!userDataString) return null;
    try { return JSON.parse(userDataString); } 
    catch (e) { return null; }
  }

  static async addItem(variant_id: number, quantity: number): Promise<CartResponse> {
    const userData = this.getUserData();
    if (!userData) {
      // (Có thể redirect hoặc alert ở đây nếu muốn)
      return { success: false, message: "Người dùng chưa đăng nhập." };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cart_add.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userData.id,
          variant_id: variant_id,
          quantity: quantity
        }),
      });

      const data = await response.json();
      return { success: response.ok, message: data.message };

    } catch (error) {
      console.error("Lỗi thêm vào giỏ:", error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  static async getCart(): Promise<CartItem[]> {
    const userData = this.getUserData();
    if (!userData) return [];

    try {
      const response = await fetch(`${API_BASE_URL}/cart_get.php?user_id=${userData.id}`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
      
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
      return [];
    }
  }

  static async updateQuantity(cart_item_id: number, quantity: number): Promise<CartResponse> {
    if (quantity <= 0) return this.removeItem(cart_item_id);

    try {
      const response = await fetch(`${API_BASE_URL}/cart_update_quantity.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_item_id, quantity }),
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
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
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }
}