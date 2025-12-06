// app/admin/customers/edit/[id]/page.tsx
'use client'

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, AlertCircle, Eye, EyeOff, CheckCircle2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

import { AdminService } from "@/services/AdminService"
import { AdminCustomerDetails, AdminUpdateCustomerData } from "@/models/User.model" 
// Component con để quản lý form
function EditCustomerForm({ customer }: { customer: AdminCustomerDetails }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // State cho các trường form
  const [firstName, setFirstName] = useState(customer.first_name);
  const [lastName, setLastName] = useState(customer.last_name);
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Kiểm tra họ tên
    if (!firstName || firstName.trim().length < 2) {
      setError("Họ phải có ít nhất 2 ký tự.");
      setIsSubmitting(false);
      return;
    }

    if (!lastName || lastName.trim().length < 2) {
      setError("Tên phải có ít nhất 2 ký tự.");
      setIsSubmitting(false);
      return;
    }

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      setIsSubmitting(false);
      return;
    }

    // Kiểm tra số điện thoại (10-11 số)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      setError("Số điện thoại phải có 10-11 chữ số.");
      setIsSubmitting(false);
      return;
    }

    // Kiểm tra độ dài mật khẩu (nếu có nhập)
    if (password.length > 0 && password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      setIsSubmitting(false);
      return;
    }

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setIsSubmitting(false);
      return;
    }
    
    try {
        // 2. TẠO DỮ LIỆU GỬI ĐI (DÙNG snake_case)
        const updateData: AdminUpdateCustomerData = {
          id: customer.id, 
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          ...(password && { password: password }) // Thêm mật khẩu nếu có
        };
        
        // 3. GỌI API THẬT (BỎ COMMENT)
        const result = await AdminService.updateCustomer(updateData);
        setIsSubmitting(false);
  
        if (result.success) {
          alert(result.message);
          router.push("/admin/customers"); // Quay về trang danh sách
        } else {
          setError(result.message); // Hiển thị lỗi (ví dụ: Email trùng lặp)
        }
        
      } catch (err) {
        setError("Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại.");
        setIsSubmitting(false);
      }
    }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Thông tin cá nhân */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white border-b border-gray-800 pb-3">
          Thông tin cá nhân
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-300">
              Họ <span className="text-red-400">*</span>
            </Label>
            <Input 
              id="firstName" 
              name="firstName" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nguyễn"
              required 
              minLength={2}
              className="h-11 border-gray-700 bg-gray-950 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-300">
              Tên <span className="text-red-400">*</span>
            </Label>
            <Input 
              id="lastName" 
              name="lastName" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Văn A"
              required 
              minLength={2}
              className="h-11 border-gray-700 bg-gray-950 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Thông tin liên hệ */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white border-b border-gray-800 pb-3">
          Thông tin liên hệ
        </h3>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email <span className="text-red-400">*</span>
          </Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required 
            className="h-11 border-gray-700 bg-gray-950 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">Địa chỉ email sẽ dùng để đăng nhập</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-300">
            Số điện thoại <span className="text-red-400">*</span>
          </Label>
          <Input 
            id="phone" 
            name="phone" 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0912345678"
            required 
            pattern="[0-9]{10,11}"
            className="h-11 border-gray-700 bg-gray-950 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">Nhập 10-11 chữ số, không có dấu cách</p>
        </div>
      </div>

      {/* Mật khẩu */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white border-b border-gray-800 pb-3">
          Đặt lại mật khẩu
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-300">
              Mật khẩu mới
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="h-11 pr-10 border-gray-700 bg-gray-950 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
              Xác nhận mật khẩu
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              className="h-11 border-gray-700 bg-gray-950 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-blue-950/30 border border-blue-800/30 p-3">
          <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-300">
            Bỏ trống nếu không muốn thay đổi mật khẩu. Mật khẩu mới phải có ít nhất 6 ký tự.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-800">
        <Button 
          type="submit" 
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 font-medium" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang xử lý...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Lưu thay đổi
            </span>
          )}
        </Button>
        <Link href="/admin/customers" className="flex-1">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-11 border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white font-medium"
          >
            Hủy
          </Button>
        </Link>
      </div>
    </form>
  );
}

// Component chính - Loader
export default function EditCustomerPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [customer, setCustomer] = useState<AdminCustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      router.push("/admin/customers");
      return;
    }

    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const data = await AdminService.getCustomerById(Number(id));
        if (data) {
          setCustomer(data);
        } else {
          setError("Không tìm thấy khách hàng.");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center text-red-400">
          <AlertCircle className="mx-auto h-10 w-10 mb-4" />
          <p className="text-lg mb-2">{error || "Không tìm thấy khách hàng"}</p>
          <Button asChild variant="link" className="text-blue-400 hover:text-blue-300">
            <Link href="/admin/customers">Quay lại danh sách</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/customers">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Chỉnh sửa khách hàng</h1>
            <p className="text-sm text-gray-400 mt-1">Cập nhật thông tin cho {customer.email}</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg bg-red-950/50 border border-red-800/50 p-4">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400">Lỗi</p>
              <p className="text-sm text-red-300 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <Card className="border-gray-800 bg-gray-900">
          <div className="p-6">
            <EditCustomerForm customer={customer} />
          </div>
        </Card>
      </div>
    </div>
  );
}