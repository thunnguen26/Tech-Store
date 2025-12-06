// services/OrderService.ts

import {
  CheckoutFormData,
  OrderResponse,
  UserOrder,
  UserOrderDetail,
  AdminOrder,
  OrderStatus,
} from '@/models/Order.model';

const API_BASE_URL = 'http://localhost/techstore-api';

export class OrderService {
  private static getUserId(): number | null {
    if (typeof window === 'undefined') return null;
    const userDataString = localStorage.getItem('techstore_user');
    if (!userDataString) return null;
    try {
      return JSON.parse(userDataString).id || null;
    } catch (e) {
      return null;
    }
  }

  /** (FRONTEND) Tạo đơn hàng */
  static async createOrder(formData: CheckoutFormData): Promise<OrderResponse> {
    const userId = this.getUserId();
    if (!userId)
      return { success: false, message: 'Lỗi: Người dùng chưa đăng nhập.' };

    const orderData = { ...formData, user_id: userId };

    try {
      const response = await fetch(`${API_BASE_URL}/create_order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      if (!response.ok)
        return { success: false, message: data.message || 'Đặt hàng thất bại' };

      return {
        success: true,
        message: data.message,
        order_code: data.order_code,
        order_id: data.order_id,
      };
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  /** (FRONTEND) Lấy Lịch sử đơn hàng */
  static async getUserOrders(): Promise<UserOrder[]> {
    const userId = this.getUserId();
    if (!userId) return [];
    try {
      const response = await fetch(
        `${API_BASE_URL}/get_user_orders.php?user_id=${userId}`,
      );
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Lỗi đơn hàng người dùng:', error);
      return [];
    }
  }

  /** (FRONTEND) Lấy chi tiết đơn hàng */
  static async getUserOrderDetails(
    orderId: string,
  ): Promise<UserOrderDetail | null> {
    const userId = this.getUserId();
    if (!userId) return null;
    try {
      const response = await fetch(
        `${API_BASE_URL}/get_order_details.php?order_id=${orderId}&user_id=${userId}`,
      );
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Lỗi chi tiết đơn hàng:', error);
      return null;
    }
  }

  /** (ADMIN) Lấy tất cả đơn hàng */
  static async getAdminOrders(): Promise<AdminOrder[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/admin_orders_get.php`,
      );
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Lỗi Admin Orders:', error);
      return [];
    }
  }

  /** (ADMIN) Lấy chi tiết đơn hàng */
  static async getAdminOrderDetails(
    orderId: string,
  ): Promise<UserOrderDetail | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/admin_order_details_get.php?order_id=${orderId}`,
      );
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Lỗi chi tiết đơn hàng Admin:', error);
      return null;
    }
  }

  /** (ADMIN) Cập nhật trạng thái đơn hàng */
  static async updateOrderStatus(
    orderId: number,
    newStatus: OrderStatus,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/admin_order_update_status.php`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: orderId, status: newStatus }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        return { success: false, message: data.message || 'Cập nhật thất bại' };
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  /** === HÀM MỚI: HỦY ĐƠN HÀNG === */
  static async cancelOrder(
    orderId: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_cancel_order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });

      // Xử lý trường hợp API trả về lỗi HTML thay vì JSON
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Server trả về không phải JSON:', text);
        return { success: false, message: 'Lỗi server (Kiểm tra file PHP).' };
      }

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Hủy thất bại' };
      }
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Lỗi hủy đơn:', error);
      return { success: false, message: 'Lỗi kết nối đến máy chủ.' };
    }
  }
}
