// app/account/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Mail, Phone, Calendar, Package } from "lucide-react"
import Link from "next/link"

import { AuthService, FullUserData } from "@/services/AuthService"

export default function AccountPage() {
  const [user, setUser] = useState<FullUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await AuthService.getUserDetails();
      
      if (!data) {
        router.push('/login');
      } else {
        setUser(data);
        setIsLoading(false);
      }
    };
    
    fetchDetails();
  }, [router]);

  if (isLoading || !user) { // Kết hợp check isLoading và user
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {user.first_name} {user.last_name}
                  </CardTitle>
                  <CardDescription>
                    Quản lý thông tin tài khoản và xem lịch sử mua hàng.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 divide-y divide-border">
              
              {/* Phần Lịch sử đơn hàng */}
              <div className="space-y-3 pt-6">
                <h3 className="text-lg font-semibold">Đơn hàng của tôi</h3>
                <Link href="/account/orders" passHref>
                  <Button variant="outline" className="w-full justify-start gap-3 text-base py-6">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    Lịch sử mua hàng
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground">Xem tất cả các đơn hàng bạn đã đặt.</p>
              </div>

              {/* Phần Thông tin cá nhân */}
              <div className="space-y-4 pt-6">
                <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Họ</Label>
                    <Input id="firstName" value={user.first_name || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
                    <Input id="lastName" value={user.last_name || ''} disabled />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input id="email" value={user.email || ''} disabled />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Số điện thoại
                  </Label>
                  <Input id="phone" value={user.phone || ''} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joinDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Ngày tham gia
                  </Label>
                  <Input id="joinDate" value={new Date(user.created_at).toLocaleDateString('vi-VN')} disabled />
                </div>

                {/* === KHỐI NÚT BẤM ĐÃ BỊ XÓA === */}
                {/* <div className="flex gap-4 pt-4">
                  <Button disabled>Chỉnh sửa thông tin</Button>
                  <Button variant="outline" disabled>Đổi mật khẩu</Button>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}