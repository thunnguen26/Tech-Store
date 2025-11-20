// app/forgot-password/page.tsx
'use client'

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, AlertCircle } from "lucide-react" // Thêm AlertCircle
import Link from "next/link"

// 1. IMPORT AUTHSERVICE
import { AuthService } from "@/services/AuthService"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState(""); // State cho email
  const [error, setError] = useState<string | null>(null); // State báo lỗi
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State báo thành công

  // 2. CẬP NHẬT HÀM handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true)
    
    // Gọi AuthService
    const result = await AuthService.forgotPassword(email);
    
    setIsLoading(false)

    if (result.success) {
      // Thành công!
      setEmailSent(true);
      // Hiển thị thông báo từ API
      setSuccessMessage(result.message);
    } else {
      // Thất bại
      setError(result.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {!emailSent ? (
            // === PHẦN FORM CHƯA GỬI ===
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Quên mật khẩu?</h1>
                <p className="text-muted-foreground">
                  Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
                </p>
              </div>

              <div className="border border-border rounded-lg p-8 bg-card">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {/* 3. KẾT NỐI STATE VỚI INPUT */}
                    <Input id="email" type="email" placeholder="email@example.com" required 
                          value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                    {/* HIỂN THỊ LỖI (NẾU CÓ) */}
                    {error && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}

                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? "Đang gửi..." : "Gửi hướng dẫn"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </div>
            </>
          ) : (
            // === PHẦN ĐÃ GỬI THÀNH CÔNG ===
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Kiểm tra email của bạn</h1>
                {/* Hiển thị thông báo thành công từ API */}
                <p className="text-muted-foreground">{successMessage || "Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn"}</p>
              </div>

              <div className="border border-border rounded-lg p-8 bg-card text-center space-y-6">
                <p className="text-sm text-muted-foreground">Không nhận được email? Kiểm tra thư mục spam hoặc</p>
                <Button variant="outline" onClick={() => setEmailSent(false)} className="bg-transparent">
                  Thử lại với email khác
                </Button>

                <div className="pt-4 border-t border-border">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}