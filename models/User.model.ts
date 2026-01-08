// src/models/User.model.ts

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  name?: string;
  email?: string;
  role: 'admin' | 'customer';
}

export interface FullUserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  role: 'admin' | 'customer';
}

// === Dữ liệu Form Auth ===
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

// === Dữ liệu Quản lý Khách hàng (Admin) ===

// Hiển thị danh sách
export interface AdminCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

// Form Thêm khách hàng
export interface AdminAddCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

// Lấy chi tiết để sửa
export interface AdminCustomerDetails {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

// Gửi dữ liệu cập nhật
export interface AdminUpdateCustomerData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password?: string;
}

// Phản hồi chung
export interface AdminResponse {
  success: boolean;
  message: string;
}
