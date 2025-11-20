// services/CartService.ts

// URL trỏ đến backend PHP của bạn
const API_BASE_URL = 'http://localhost/techstore-api';

// Định nghĩa kiểu cho kết quả trả về
interface CartResponse {
  success: boolean;
  message: string;
}
export interface CartItem {
  cart_item_id: number;
  quantity: number;
  variant_id: number;
  size: string | null;
  color_name: string | null;
  price: number;
  original_price: number | null;
  product_id: number;
  name: string;
  base_image: string | null;
}

export class CartService {

  /**
   * Lấy thông tin người dùng từ localStorage
   */
  private static getUserData(): { id: number } | null {
    const userDataString = localStorage.getItem('techstore_user');
    if (!userDataString) {
      return null; // Người dùng chưa đăng nhập
    }
    try {
      return JSON.parse(userDataString);
    } catch (e) {
      console.error("Lỗi parse JSON người dùng:", e);
      return null;
    }
  }

  /**
   * Gọi API cart_add.php
   */
  static async addItem(variant_id: number, quantity: number): Promise<CartResponse> {
    const userData = this.getUserData();

    if (!userData) {
      // Bắt lỗi nếu người dùng chưa đăng nhập
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return { success: false, message: "Người dùng chưa đăng nhập." };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cart_add.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.id, // Lấy id từ người dùng đã đăng nhập
          variant_id: variant_id,
          quantity: quantity
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Đã xảy ra lỗi' };
      }

      // Thêm thành công
      return { success: true, message: data.message };

    } catch (error) {
      console.error("Lỗi khi gọi API thêm vào giỏ:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }

  /**
   *  Gọi API cart_get.php
   */
  static async getCart(): Promise<CartItem[]> {
    const userData = this.getUserData();

    if (!userData) {
      // Người dùng chưa đăng nhập, trả về giỏ hàng trống
      return []; 
    }

    try {
      // Gọi API bằng GET, gửi user_id qua URL
      const response = await fetch(`${API_BASE_URL}/cart_get.php?user_id=${userData.id}`);
      
      if (!response.ok) {
        console.error("Lỗi khi lấy giỏ hàng:", response.status);
        return [];
      }

      const data: CartItem[] = await response.json();
      return data;

    } catch (error) {
      console.error("Lỗi khi gọi API lấy giỏ hàng:", error);
      return [];
    }
  }

  
  /**
   *  Gọi API cart_update_quantity.php
   */
  static async updateQuantity(cart_item_id: number, quantity: number): Promise<CartResponse> {
    // Lấy user_id chỉ để kiểm tra đăng nhập, API này không cần
    const userData = this.getUserData();
    if (!userData) {
      return { success: false, message: "Người dùng chưa đăng nhập." };
    }

    if (quantity <= 0) {
      // Nếu số lượng là 0, chúng ta nên gọi hàm xóa
      return this.removeItem(cart_item_id);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cart_update_quantity.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_item_id: cart_item_id,
          quantity: quantity
        }),
      });

      const data = await response.json();
      return { success: response.ok, message: data.message };

    } catch (error) {
      console.error("Lỗi khi gọi API cập nhật số lượng:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }

  /**
   *  Gọi API cart_remove_item.php
   */
  static async removeItem(cart_item_id: number): Promise<CartResponse> {
    const userData = this.getUserData();
    if (!userData) {
      return { success: false, message: "Người dùng chưa đăng nhập." };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cart_remove_item.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_item_id: cart_item_id
        }),
      });

      const data = await response.json();
      return { success: response.ok, message: data.message };

    } catch (error) {
      console.error("Lỗi khi gọi API xóa sản phẩm:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }


}