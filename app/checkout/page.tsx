"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Wallet, Building2, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const cartItems = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 29990000,
    image: "/iphone-15-pro-max.jpg",
    size: "256GB",
    color: "Titan Tự Nhiên",
    quantity: 1,
  },
  {
    id: "6",
    name: "AirPods Pro 2",
    price: 5990000,
    image: "/airpods-pro-2.jpg",
    size: "Standard",
    color: "Trắng",
    quantity: 1,
  },
]

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 30000
  const total = subtotal + shipping

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setOrderComplete(true)
    }, 2000)
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h2>
            <p className="text-muted-foreground mb-2">Cảm ơn bạn đã mua hàng tại TechStore</p>
            <p className="text-muted-foreground mb-8">
              Mã đơn hàng: <span className="font-semibold text-foreground">#ORD-{Date.now()}</span>
            </p>
            <div className="space-y-3">
              <Link href="/products">
                <Button size="lg" className="w-full">
                  Tiếp tục mua sắm
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full bg-transparent">
                Xem đơn hàng
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/30 py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">Thanh toán</h1>
            <p className="text-muted-foreground">Hoàn tất đơn hàng của bạn</p>
          </div>
        </section>

        {/* Checkout Form */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Contact Information */}
                  <div className="border border-border rounded-lg p-6 bg-card">
                    <h2 className="text-xl font-bold mb-6">Thông tin liên hệ</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Họ *</Label>
                          <Input id="firstName" placeholder="Nguyễn" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Tên *</Label>
                          <Input id="lastName" placeholder="Văn A" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="email@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input id="phone" type="tel" placeholder="0912 345 678" required />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="border border-border rounded-lg p-6 bg-card">
                    <h2 className="text-xl font-bold mb-6">Địa chỉ giao hàng</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ *</Label>
                        <Input id="address" placeholder="123 Đường ABC" required />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">Thành phố *</Label>
                          <Input id="city" placeholder="Hồ Chí Minh" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="district">Quận/Huyện *</Label>
                          <Input id="district" placeholder="Quận 1" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú đơn hàng (tùy chọn)</Label>
                        <textarea
                          id="notes"
                          className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                          placeholder="Ghi chú về đơn hàng, ví dụ: thời gian giao hàng..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="border border-border rounded-lg p-6 bg-card">
                    <h2 className="text-xl font-bold mb-6">Phương thức thanh toán</h2>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Thẻ tín dụng / Thẻ ghi nợ</p>
                            <p className="text-xs text-muted-foreground">Visa, Mastercard, JCB</p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                        <RadioGroupItem value="ewallet" id="ewallet" />
                        <Label htmlFor="ewallet" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Wallet className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Ví điện tử</p>
                            <p className="text-xs text-muted-foreground">MoMo, ZaloPay, VNPay</p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                            <p className="text-xs text-muted-foreground">Thanh toán bằng tiền mặt</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <div className="mt-6 space-y-4 p-4 bg-muted/30 rounded-lg">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Số thẻ *</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Ngày hết hạn *</Label>
                            <Input id="expiry" placeholder="MM/YY" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input id="cvv" placeholder="123" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Tên trên thẻ *</Label>
                          <Input id="cardName" placeholder="NGUYEN VAN A" required />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      Tôi đã đọc và đồng ý với{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Điều khoản dịch vụ
                      </Link>{" "}
                      và{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Chính sách bảo mật
                      </Link>
                    </Label>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="sticky top-20 space-y-6">
                    <div className="border border-border rounded-lg p-6 bg-card">
                      <h2 className="text-xl font-bold mb-6">Đơn hàng của bạn</h2>

                      {/* Cart Items */}
                      <div className="space-y-4 mb-6 pb-6 border-b border-border">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                                {item.quantity}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.size} • {item.color}
                              </p>
                              <p className="text-sm font-semibold mt-1">{item.price.toLocaleString("vi-VN")}₫</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Total */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tạm tính</span>
                          <span className="font-medium">{subtotal.toLocaleString("vi-VN")}₫</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Phí vận chuyển</span>
                          <span className="font-medium">{shipping.toLocaleString("vi-VN")}₫</span>
                        </div>
                        <div className="pt-3 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Tổng cộng</span>
                            <span className="text-2xl font-bold">{total.toLocaleString("vi-VN")}₫</span>
                          </div>
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full mt-6" disabled={isProcessing}>
                        {isProcessing ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
                      </Button>
                    </div>

                    {/* Security Badge */}
                    <div className="border border-border rounded-lg p-4 bg-card">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Thanh toán bảo mật</p>
                          <p className="text-xs text-muted-foreground">Thông tin được mã hóa SSL</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
