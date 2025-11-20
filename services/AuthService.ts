// services/AuthService.ts

// URL trỏ đến backend PHP của bạn
const API_BASE_URL = 'http://localhost/techstore-api';

// === CÁC INTERFACE CHO ĐĂNG KÝ ===
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

// === CÁC INTERFACE MỚI CHO ĐĂNG NHẬP ===
export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
}

// === INTERFACE TRẢ VỀ (ĐÃ CẬP NHẬT) ===
// Giờ nó có thể chứa thông tin 'user'
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserData; // Thêm trường user (tùy chọn)
}

// THÊM INTERFACE MỚI CHO DỮ LIỆU ĐẦY ĐỦ
export interface FullUserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}


export class AuthService {

  /**
   * HÀM ĐĂNG KÝ
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
   * HÀM ĐĂNG NHẬP 
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
        // Lỗi (400, 401, 404, 500...)
        return { success: false, message: data.message || 'Đăng nhập thất bại' };
      }

      // Đăng nhập thành công (response 200)
      // data.user sẽ chứa thông tin người dùng
      return { success: true, message: data.message, user: data.user };

    } catch (error) {
      console.error("Lỗi khi gọi API đăng nhập:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }

  /**
   *Gọi API forgot-password.php
   */
  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }), // Gửi email
      });

      const data = await response.json();

      if (!response.ok) {
        // Lỗi 400, 500...
        return { success: false, message: data.message || 'Đã xảy ra lỗi' };
      }

      // Thành công (response 200)
      return { success: true, message: data.message };

    } catch (error) {
      console.error("Lỗi khi gọi API quên mật khẩu:", error);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  }

/**
   *  Gọi API reset-password.php
   */
static async resetPassword(token: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/reset-password.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }), // Gửi token và mật khẩu mới
    });

    const data = await response.json();

    if (!response.ok) {
      // Lỗi 400 (Token hết hạn), 500...
      return { success: false, message: data.message || 'Đã xảy ra lỗi' };
    }

    // Thành công (response 200)
    return { success: true, message: data.message };

  } catch (error) {
    console.error("Lỗi khi gọi API đặt lại mật khẩu:", error);
    return { success: false, message: 'Không thể kết nối đến máy chủ.' };
  }
}


/**
   *  Lấy thông tin chi tiết của người dùng đã đăng nhập
   */
static async getUserDetails(): Promise<FullUserData | null> {
  // 1. Lấy user_id từ localStorage
  const userDataString = localStorage.getItem('techstore_user');
  if (!userDataString) {
    return null; // Chưa đăng nhập
  }
  
  let userId: number | null = null;
  try {
    userId = JSON.parse(userDataString).id;
  } catch (e) {
    return null;
  }

  if (!userId) {
    return null;
  }

  // 2. Gọi API mới
  try {
    const response = await fetch(`${API_BASE_URL}/get_user_details.php?user_id=${userId}`);
    
    if (!response.ok) {
      console.error("Lỗi khi lấy chi tiết người dùng:", response.status);
      return null;
    }

    const data: FullUserData = await response.json();
    return data;

  } catch (error) {
    console.error("Lỗi khi gọi API chi tiết người dùng:", error);
    return null;
  }
}

}