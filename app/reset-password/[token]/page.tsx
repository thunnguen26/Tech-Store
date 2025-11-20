// app/reset-password/[token]/page.tsx
'use client'

import type React from "react"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation" 
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { AuthService } from "@/services/AuthService" 

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); 
  const router = useRouter()
  const params = useParams(); 

  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!token) {
      setError("Thiếu token xác thực. Vui lòng thử lại từ email.");
      return;
    }

    setIsLoading(true)
    
    const result = await AuthService.resetPassword(token, password);

    setIsLoading(false)

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-4 shadow-lg">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Đặt lại mật khẩu</h1>
            <p className="text-muted-foreground text-lg">Nhập mật khẩu mới cho tài khoản của bạn</p>
          </div>

          <div className="border-2 border-border/50 rounded-2xl p-8 bg-card/80 backdrop-blur-xl shadow-2xl">
            {success ? (
              // PHẦN HIỂN THỊ KHI THÀNH CÔNG
              <div className="text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-600 mb-4">{success}</p>
                <p className="text-muted-foreground">Đang chuyển hướng về trang đăng nhập...</p>
                <Button variant="link" asChild className="mt-4">
                  <Link href="/login">Đăng nhập ngay</Link>
                </Button>
              </div>
            ) : (
              // PHẦN FORM NHẬP MẬT KHẨU
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold">Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="pr-10 h-11 border-2"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold">Xác nhận mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="pr-10 h-11 border-2"
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {/* DÒNG LỖI ĐÃ BỊ XÓA */}
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-12 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                </Button>
              </form>
            )}
      _Dòng này đã bị xóa_   </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}