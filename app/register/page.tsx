// app/register/page.tsx
'use client'

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, UserPlus, Mail, Phone, Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/AuthService";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true)
    
    const result = await AuthService.register({
      firstName,
      lastName,
      email,
      phone,
      password
    });

    setIsLoading(false)

    if (result.success) {
      alert(result.message);
      router.push("/login");
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/30 to-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-4 shadow-lg">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Đăng ký tài khoản
            </h1>
            <p className="text-muted-foreground text-lg">Tạo tài khoản mới để bắt đầu mua sắm</p>
          </div>

          {/* Form Card */}
          <div className="border-2 border-border/50 rounded-2xl p-8 bg-card/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold">Họ</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Nguyễn" 
                    required 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-11 border-2 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold">Tên</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Văn A" 
                    required 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-11 border-2 focus:border-primary transition-all"
                  />
                </div>
              </div>

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

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Số điện thoại
                </Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="0912 345 678" 
                  required 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
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
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 className={`h-3 w-3 ${password.length >= 8 ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <p className="text-xs text-muted-foreground">Mật khẩu phải có ít nhất 8 ký tự</p>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pr-10 h-11 border-2 focus:border-primary transition-all"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="flex items-center gap-2 mt-1">
                    {password === confirmPassword ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <p className="text-xs text-green-600">Mật khẩu khớp</p>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 text-orange-500" />
                        <p className="text-xs text-orange-600">Mật khẩu chưa khớp</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                <Checkbox id="terms" required className="mt-0.5" />
                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  Tôi đồng ý với{" "}
                  <Link href="/terms" className="text-primary font-semibold hover:underline">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link href="/privacy" className="text-primary font-semibold hover:underline">
                    Chính sách bảo mật
                  </Link>
                </Label>
              </div>

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
                    Đang đăng ký...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Đăng ký
                  </div>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline inline-flex items-center gap-1 group">
                  Đăng nhập
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}