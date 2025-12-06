// src/models/Order.model.ts

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

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
  itemIds: number[];
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order_code?: string;
  order_id?: number;
}

// Đơn hàng Admin
export interface AdminOrder {
  id: number;
  order_code: string;
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  status: OrderStatus;
  user_full_name: string;
  customer_email: string;
  item_count: number;
  created_at: string;
}

// Đơn hàng User
export interface UserOrder {
  id: number;
  user_id?: number;
  order_code: string;
  total_amount: number;
  status: OrderStatus;
  item_count: number;
  created_at: string;
  
  
  // Chi tiết
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

export interface OrderItemDetail {
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  name: string;
  base_image: string | null;
  size: string | null;
  color_name: string | null;
}

export interface UserOrderDetail {
  details: UserOrder;
  items: OrderItemDetail[];
}

// Dữ liệu Thống kê Dashboard (Đặt ở đây vì liên quan nhiều đến Order)
export interface DashboardStats {
  kpi: {
    totalRevenue: number;
    revenueChange: number;
    totalOrders: number;
    ordersChange: number;
    totalProducts: number;
    totalCustomers: number;
    customerChange: number;
  };
  revenueChart: { month: string; revenue: number }[];
  ordersChart: { day: string; orders: number }[];
  topProducts: { name: string; sold: number; revenue: number }[];
}