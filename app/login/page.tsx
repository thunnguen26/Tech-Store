// app/login/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, AlertCircle, LogIn, Mail, Lock, Sparkles, ArrowLeft, Loader2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// Import Service
import { AuthService } from "@/services/AuthService"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // State quản lý form
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // 1. KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
  useEffect(() => {
    const checkAuth = () => {
      const user = AuthService.getUser();
      if (user) {
        // Nếu đã đăng nhập, điều hướng dựa trên quyền
        if (user.role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/');
        }
      } else {
        setIsCheckingAuth(false); // Chưa đăng nhập -> Hiện form
      }
    };
    checkAuth();
  }, [router]);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  // 2. XỬ LÝ SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Gọi API đăng nhập
      const result = await AuthService.login({ 
          email: formData.email, 
          password: formData.password 
      });

      if (result.success && result.user) {
        // === LOGIC ĐIỀU HƯỚNG ===
        if (result.user.role === 'admin') {
           router.push('/admin')
        } else {
           router.push('/')
        }
      } else {
        setError(result.message || "Đăng nhập thất bại")
      }
    } catch (err) {
      setError("Đã xảy ra lỗi kết nối")
    } finally {
      setIsLoading(false)
    }
  }

  // Màn hình Loading khi đang kiểm tra đăng nhập
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      {/* Nút Quay lại */}
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Về trang chủ
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md border-border/50 shadow-xl bg-card/80 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <LogIn className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Đăng nhập
          </h1>
          <CardDescription>
            Chào mừng bạn quay trở lại
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20 animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9 h-11"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-9 pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground cursor-pointer"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <Link 
                href="/forgot-password" 
                className="text-sm font-medium text-primary hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
            
            {/* Features Info */}
            <div className="w-full p-4 rounded-lg bg-primary/5 border border-primary/10 mt-2">
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

            <div className="text-center text-sm text-muted-foreground pt-2">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline inline-flex items-center gap-1 group">
                Đăng ký ngay
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      
      {/* Security Badge */}
      <div className="absolute bottom-8 text-center w-full">
         <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
           <Lock className="h-3 w-3" />
           Thông tin của bạn được bảo mật và mã hóa
         </p>
      </div>
    </div>
  )
}