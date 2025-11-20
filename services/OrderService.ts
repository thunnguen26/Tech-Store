// services/OrderService.ts

const API_BASE_URL = 'http://localhost/techstore-api';

// === INTERFACE CHO THANH TOÁN ===
export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  paymentMethod: string;
  notes?: string;
  itemIds: number[]; // Danh sách ID sản phẩm đã chọn
}

// === INTERFACE CHO KẾT QUẢ TRẢ VỀ ===
interface OrderResponse {
    success: boolean;
    message: string;
    order_code?: string;
    order_id?: number; 
  }

// === INTERFACE CHO ĐƠN HÀNG (ADMIN) ===
// (Dùng cho trang app/admin/orders/page.tsx)
export interface AdminOrder {
  id: number;
  order_code: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  user_full_name: string;
  customer_email: string;
  item_count: number;
  created_at: string;
}

// === INTERFACES CHO ĐƠN HÀNG (USER) ===

// 1. SỬA LỖI: CẬP NHẬT 'UserOrder' ĐỂ CÓ ĐỦ CÁC TRƯỜNG
// (Dùng cho cả trang danh sách và trang chi tiết của người dùng)
export interface UserOrder {
  id: number;
  user_id?: number;
  order_code: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  item_count: number; // (Từ API get_user_orders.php)
  created_at: string;
  
  // THÊM CÁC TRƯỜNG CHI TIẾT (từ get_order_details.php)
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_district: string;
  payment_method: string;
  order_notes: string | null;
}

// Chi tiết của một món hàng trong đơn
export interface OrderItemDetail {
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  name: string;
  base_image: string | null;
  size: string | null;
  color_name: string | null;
}

// Toàn bộ chi tiết đơn hàng (details giờ đã khớp)
export interface UserOrderDetail {
  details: UserOrder; 
  items: OrderItemDetail[];
}








export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
// === CLASS SERVICE ===
export class OrderService {

  /**
   * Lấy user_id từ localStorage (hàm nội bộ)
   */
  private static getUserId(): number | null {
    // Đảm bảo code chỉ chạy ở client
    if (typeof window === 'undefined') {
      return null;
    }
    const userDataString = localStorage.getItem('techstore_user');
    if (!userDataString) return null;
    try {
      return JSON.parse(userDataString).id || null;
    } catch (e) {
      return null;
    }
  }

  /**
   * (FRONTEND) Gọi API create_order.php
   */
  static async createOrder(formData: CheckoutFormData): Promise<OrderResponse> { // 2. SỬA Kiểu trả về
      const userId = this.getUserId();
      if (!userId) {
        return { success: false, message: "Lỗi: Người dùng chưa đăng nhập." };
      }
  
      const orderData = { ...formData, user_id: userId };
  
      try {
        const response = await fetch(`${API_BASE_URL}/create_order.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
  
        const data = await response.json();
        if (!response.ok) {
          return { success: false, message: data.message || 'Đặt hàng thất bại' };
        }
        
        // 3. TRẢ VỀ THÊM order_id
        return { 
          success: true, 
          message: data.message, 
          order_code: data.order_code,
          order_id: data.order_id // <-- THÊM DÒNG NÀY
        };
  
      } catch (error) {
        console.error("Lỗi khi gọi API tạo đơn hàng:", error);
        return { success: false, message: 'Không thể kết nối đến máy chủ.' };
      }
    }

  /**
   * (FRONTEND) Lấy Lịch sử đơn hàng
   */
  static async getUserOrders(): Promise<UserOrder[]> {
    const userId = this.getUserId();
    if (!userId) return []; 

    try {
      const response = await fetch(`${API_BASE_URL}/get_user_orders.php?user_id=${userId}`);
      if (!response.ok) {
        console.error("Lỗi khi fetch đơn hàng người dùng:", response.status);
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi gọi API đơn hàng người dùng:", error);
      return [];
    }
  }

  /**
   * (FRONTEND) Lấy chi tiết MỘT đơn hàng
   */
  static async getUserOrderDetails(orderId: string): Promise<UserOrderDetail | null> {
    const userId = this.getUserId();
    if (!userId) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/get_order_details.php?order_id=${orderId}&user_id=${userId}`);
      if (!response.ok) {
        console.error("Lỗi khi fetch chi tiết đơn hàng:", response.status);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi gọi API chi tiết đơn hàng:", error);
      return null;
    }
  }
  
  /**
   * (ADMIN) Lấy TẤT CẢ đơn hàng
   */
  static async getAdminOrders(): Promise<AdminOrder[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin_orders_get.php`); 
      if (!response.ok) {
        console.error("Lỗi khi fetch đơn hàng Admin:", response.status);
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi gọi API Admin Orders:", error);
      return [];
    }
  }


/**
   * HÀM MỚI (ADMIN): Lấy chi tiết MỘT đơn hàng
   */
static async getAdminOrderDetails(orderId: string): Promise<UserOrderDetail | null> {
  // (Chúng ta có thể tái sử dụng interface 'UserOrderDetail' vì cấu trúc dữ liệu trả về là như nhau)
  try {
    // Gọi API mới trong thư mục /admin/
    const response = await fetch(`${API_BASE_URL}/admin/admin_order_details_get.php?order_id=${orderId}`);
    
    if (!response.ok) {
      console.error("Lỗi khi fetch chi tiết đơn hàng Admin:", response.status);
      return null;
    }

    const data: UserOrderDetail = await response.json();
    return data;

  } catch (error) {
    console.error("Lỗi khi gọi API chi tiết đơn hàng Admin:", error);
    return null;
  }
}

/**
   * HÀM MỚI (ADMIN): Cập nhật trạng thái của MỘT đơn hàng
   */
static async updateOrderStatus(orderId: number, newStatus: OrderStatus): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/admin_order_update_status.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order_id: orderId, status: newStatus }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật thất bại' };
    }
    
    return { success: true, message: data.message };

  } catch (error) {
    console.error("Lỗi khi gọi API cập nhật trạng thái:", error);
    return { success: false, message: 'Không thể kết nối đến máy chủ.' };
  }
}

}