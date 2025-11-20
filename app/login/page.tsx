// app/login/page.tsx
'use client'

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, AlertCircle, LogIn, Mail, Lock, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/AuthService"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Thêm state loading

  // 2. THÊM useEffect ĐỂ KIỂM TRA ĐĂNG NHẬP
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('techstore_user');
      if (user) {
        // Nếu đã đăng nhập, đẩy về trang chủ
        router.push('/');
      } else {
        // Nếu chưa đăng nhập, cho phép hiển thị trang
        setIsCheckingAuth(false);
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null);
        setIsLoading(true)
    
        const result = await AuthService.login({ email, password });
        
        setIsLoading(false)
    
       if (result.success && result.user) {
      // 3. LƯU VÀO localStorage
      localStorage.setItem('techstore_user', JSON.stringify(result.user));
      // Tải lại trang để Header cập nhật (cách đơn giản)
      window.location.href = '/'; 
      // Hoặc router.push('/'); (nhưng header có thể không cập nhật ngay)
    } else {
      setError(result.message);
    }
  }

    // 4. HIỂN THỊ LOADING KHI ĐANG KIỂM TRA
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/30 to-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-4 shadow-lg">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Đăng nhập
            </h1>
            <p className="text-muted-foreground text-lg">Chào mừng bạn quay trở lại</p>
          </div>

          {/* Form Card */}
          <div className="border-2 border-border/50 rounded-2xl p-8 bg-card/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-2 focus:border-primary transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pr-10 h-11 border-2 focus:border-primary transition-all"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="data-[state=checked]:bg-primary" />
                  <Label htmlFor="remember" className="text-sm cursor-pointer font-medium">
                    Ghi nhớ đăng nhập
                  </Label>
                </div>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline font-semibold transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Đang đăng nhập...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Đăng nhập
                  </div>
                )}
              </Button>
            </form>

            {/* Features Info */}
            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Lợi ích khi đăng nhập</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Theo dõi đơn hàng dễ dàng</li>
                    <li>• Lưu sản phẩm yêu thích</li>
                    <li>• Nhận ưu đãi độc quyền</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Link 
                  href="/register" 
                  className="text-primary font-semibold hover:underline inline-flex items-center gap-1 group"
                >
                  Đăng ký ngay
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Thông tin của bạn được bảo mật và mã hóa
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )


  
}