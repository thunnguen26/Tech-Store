// services/AdminService.ts

// 1. IMPORT TỪ MODEL (Thay vì khai báo tại chỗ)
import { 
  AdminCustomer, 
  AdminAddCustomerData, 
  AdminCustomerDetails, 
  AdminUpdateCustomerData, 
  AdminResponse 
} from "@/models/User.model";

import { DashboardStats } from "@/models/Order.model";

const API_BASE_URL = 'http://localhost/techstore-api';

export class AdminService {

  /** Lấy danh sách khách hàng */
  static async getAdminCustomers(): Promise<AdminCustomer[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin_customers_get.php`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Lỗi fetch customers:", error);
      return [];
    }
  }

  /** Xóa khách hàng */
  static async deleteCustomer(customerId: number): Promise<AdminResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin_customer_delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Xóa thất bại' };
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Lỗi xóa customer:", error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  /** Thêm khách hàng mới */
  static async addCustomer(customerData: AdminAddCustomerData): Promise<AdminResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin_customer_add.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Thêm thất bại' };
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Lỗi thêm customer:", error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  /** Lấy chi tiết khách hàng */
  static async getCustomerById(id: number): Promise<AdminCustomerDetails | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin_customer_get_details.php?id=${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Lỗi chi tiết khách hàng:", error);
      return null;
    }
  }

  /** Cập nhật khách hàng */
  static async updateCustomer(customerData: AdminUpdateCustomerData): Promise<AdminResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin_customer_update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Cập nhật thất bại' };
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Lỗi cập nhật khách hàng:", error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  /** Lấy thống kê Dashboard */
  static async getDashboardStats(): Promise<DashboardStats | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin_dashboard_stats.php`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Lỗi Dashboard Stats:", error);
      return null;
    }
  }
}

export type { AdminCustomer };
