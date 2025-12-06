// services/AuthService.ts

import { 
  User, 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  FullUserData 
} from "@/models/User.model";

const API_BASE_URL = 'http://localhost/techstore-api';

export class AuthService {
  
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData), 
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Đã xảy ra lỗi' };
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  static async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Đăng nhập thất bại' };

      if (typeof window !== 'undefined' && data.user) {
        localStorage.setItem('techstore_user', JSON.stringify(data.user));
      }
      return { success: true, message: data.message, user: data.user };
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('techstore_user');
    }
  }

  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }), 
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Lỗi gửi mail' };
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Lỗi quên mật khẩu:", error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  static async resetPassword(token: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }), 
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.message || 'Lỗi đặt lại mật khẩu' };
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Lỗi reset mật khẩu:", error);
      return { success: false, message: 'Lỗi kết nối.' };
    }
  }

  static async getUserDetails(): Promise<FullUserData | null> {
    const userDataString = localStorage.getItem('techstore_user');
    if (!userDataString) return null;
    
    let userId: number | null = null;
    try { userId = JSON.parse(userDataString).id; } catch (e) { return null; }
    if (!userId) return null;
  
    try {
      const response = await fetch(`${API_BASE_URL}/get_user_details.php?user_id=${userId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Lỗi chi tiết người dùng:", error);
      return null;
    }
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('techstore_user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
  
  static isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }
}