// services/AuthService.ts

const API_BASE_URL = 'http://localhost/techstore-api';

// === 1. CÁC INTERFACE ===

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

// Đổi tên UserData -> User để dễ dùng chung
export interface User {
  id: number;
  firstName: string; // Hoặc 'name' tùy API trả về
  lastName: string;
  name?: string; // Thêm trường này để tương thích nếu API trả về 'name' gộp
  role: 'admin' | 'customer'; // QUAN TRỌNG: Thêm role
  email?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User; 
}

export interface FullUserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}


// === 2. CLASS AUTHSERVICE ===

export class AuthService {

  /**
   * Đăng ký
   */
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), 
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Đã xảy ra lỗi' };
      }

      return { success: true, message: data.message };

    } catch (error) {
      console.error("Lỗi khi gọi API đăng ký:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }

  /**
   * Đăng nhập 
   */
  static async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Đăng nhập thất bại' };
      }

      // Lưu user vào localStorage
      if (typeof window !== 'undefined' && data.user) {
        localStorage.setItem('techstore_user', JSON.stringify(data.user));
      }

      return { success: true, message: data.message, user: data.user };

    } catch (error) {
      console.error("Lỗi khi gọi API đăng nhập:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }

  /**
   * Đăng xuất (THÊM MỚI)
   */
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('techstore_user');
    }
  }

  /**
   * Quên mật khẩu
   */
  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }), 
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Đã xảy ra lỗi' };
      }

      return { success: true, message: data.message };

    } catch (error) {
      console.error("Lỗi khi gọi API quên mật khẩu:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }

  /**
   * Đặt lại mật khẩu
   */
  static async resetPassword(token: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }), 
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { success: false, message: data.message || 'Đã xảy ra lỗi' };
      }
  
      return { success: true, message: data.message };
  
    } catch (error) {
      console.error("Lỗi khi gọi API đặt lại mật khẩu:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }


  /**
   * Lấy thông tin chi tiết (Full Info)
   */
  static async getUserDetails(): Promise<FullUserData | null> {
    const userDataString = localStorage.getItem('techstore_user');
    if (!userDataString) return null;
    
    let userId: number | null = null;
    try {
      userId = JSON.parse(userDataString).id;
    } catch (e) { return null; }
  
    if (!userId) return null;
  
    try {
      const response = await fetch(`${API_BASE_URL}/get_user_details.php?user_id=${userId}`);
      if (!response.ok) return null;
  
      const data: FullUserData = await response.json();
      return data;
  
    } catch (error) {
      console.error("Lỗi khi gọi API chi tiết người dùng:", error);
      return null;
    }
  }

  /**
   * Lấy thông tin cơ bản từ localStorage (User có role)
   */
  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('techstore_user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
  
  /**
   * Kiểm tra quyền Admin
   */
  static isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

}