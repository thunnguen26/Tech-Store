// services/AdminService.ts

const API_BASE_URL = 'http://localhost/techstore-api';

// Interfaces cho dữ liệu Khách hàng trả về
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

//INTERFACE ADMIN ADD CUSTOMER
export interface AdminAddCustomerData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }


  // INTERFACE CHO KẾT QUẢ
export interface AdminResponse {
  success: boolean;
  message: string;
}


// Chỉnh sửa, không cần mật khẩu
export interface AdminCustomerDetails {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }
  
// DỮ LIỆU CẬP NHẬT
export interface AdminUpdateCustomerData {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password?: string; 
  }


  // === DASHBOARD ===
interface KpiData {
    totalRevenue: number;
    revenueChange: number;
    totalOrders: number;
    ordersChange: number;
    totalProducts: number;
    totalCustomers: number;
    customerChange: number;
  }
  interface ChartItem {
    month?: string;
    day?: string;
    revenue?: number;
    orders?: number;
  }
  interface TopProduct {
    name: string;
    sold: number;
    revenue: number;
  }
  export interface DashboardStats {
    kpi: KpiData;
    revenueChart: ChartItem[];
    ordersChart: ChartItem[];
    topProducts: TopProduct[];
  }

export class AdminService {

  /**
   *  Lấy tất cả khách hàng cho trang Admin
   */
  static async getAdminCustomers(): Promise<AdminCustomer[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin_customers_get.php`);
      
      if (!response.ok) {
        console.error("Lỗi khi fetch khách hàng Admin:", response.status);
        return [];
      }

      const customers: AdminCustomer[] = await response.json();
      return customers;

    } catch (error) {
      console.error("Lỗi khi gọi API Admin Customers:", error);
      return [];
    }
  }

  /**
   *  Xóa một khách hàng
   */
  static async deleteCustomer(userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin_customer_delete.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Lỗi 400, 404, 500
        return { success: false, message: data.message || 'Xóa thất bại' };
      }

      return { success: true, message: data.message };

    } catch (error) {
      console.error("Lỗi khi gọi API xóa khách hàng:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }

  /**
   *  Thêm một khách hàng mới từ admin
   */
  static async addCustomer(customerData: AdminAddCustomerData): Promise<AdminResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admin_customer_add.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Lỗi 400, 409, 500
        return { success: false, message: data.message || 'Thêm thất bại' };
      }

      return { success: true, message: data.message };

    } catch (error) {
      console.error("Lỗi khi gọi API thêm khách hàng:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }


/**
   *  Lấy chi tiết 1 khách hàng bằng ID
   */
static async getCustomerById(id: number): Promise<AdminCustomerDetails | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/admin_customer_get_details.php?id=${id}`);
    
    if (!response.ok) {
      console.error("Lỗi khi fetch chi tiết khách hàng:", response.status);
      return null;
    }
    
    const data: AdminCustomerDetails = await response.json();
    return data;

  } catch (error) {
    console.error("Lỗi khi gọi API chi tiết khách hàng:", error);
    return null;
  }
}


/**
   *  Cập nhật thông tin 1 khách hàng
   */
static async updateCustomer(customerData: AdminUpdateCustomerData): Promise<AdminResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/admin_customer_update.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật thất bại' };
    }
    return { success: true, message: data.message };

  } catch (error) {
    console.error("Lỗi khi gọi API cập nhật khách hàng:", error);
    return { success: false, message: 'Không thể kết nối đến máy chủ.' };
  }
}


/**
   * HÀM MỚI (ADMIN): Lấy dữ liệu cho Dashboard
   */
static async getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/admin_dashboard_stats.php`);
    
    if (!response.ok) {
      console.error("Lỗi khi fetch stats dashboard:", response.status);
      return null;
    }
    
    const data: DashboardStats = await response.json();
    return data;

  } catch (error) {
    console.error("Lỗi khi gọi API Dashboard Stats:", error);
    return null;
  }
}


}