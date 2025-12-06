// app/checkout/page.tsx
'use client'

import React, { useState, useEffect } from "react" // Thêm React
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Wallet, Building2, CheckCircle2, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// 1. IMPORT SERVICE VÀ MODEL (QUAN TRỌNG)
import { CartService } from "@/services/CartService"
import { OrderService } from "@/services/OrderService"
import { CheckoutFormData } from "@/models/Order.model"
import { CartItem } from "@/models/Cart.model" // Để sửa lỗi 'item' implicitly has an 'any' type

export default function CheckoutPage() {
  // State
  const [cartItems, setCartItems] = useState<CartItem[]>([]) // Định nghĩa kiểu CartItem[]
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderCode, setOrderCode] = useState<string | null>(null)
  
  const [orderId, setOrderId] = useState<number | null>(null)  
  const [error, setError] = useState<string | null>(null)     

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true)

      // Get all items from database
      const allItems = await CartService.getCart()

      // Get selected IDs from localStorage
      const selectedIdsJson = localStorage.getItem("techstore_selected_ids")
      let idsToCheckout: Set<number> = new Set()

      if (selectedIdsJson) {
        try {
           idsToCheckout = new Set(JSON.parse(selectedIdsJson))
           setSelectedIds(idsToCheckout)
        } catch (e) {
           console.error("Error reading selected_ids:", e)
           // Fallback: Chọn tất cả nếu lỗi
           idsToCheckout = new Set(allItems.map(item => item.cart_item_id));
           setSelectedIds(idsToCheckout);
        }
      } else {
         // Nếu không có selectedIds (mua ngay), chọn tất cả
         idsToCheckout = new Set(allItems.map(item => item.cart_item_id));
         setSelectedIds(idsToCheckout);
      }

      // Filter items to only include selected ones
      const itemsToCheckout = allItems.filter((item) => idsToCheckout.has(item.cart_item_id))

      setCartItems(itemsToCheckout)
      setIsLoading(false)
    }
    fetchCart()
  }, [])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 500000 ? 0 : subtotal > 0 ? 30000 : 0
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsProcessing(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const data: CheckoutFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      district: formData.get("district") as string,
      notes: formData.get("notes") as string,
      paymentMethod: paymentMethod,
      itemIds: Array.from(selectedIds),
    }

    const result = await OrderService.createOrder(data)
    setIsProcessing(false)

    if (result.success) {
      setOrderCode(result.order_code || null)   
      setOrderId(result.order_id || null) 
      setOrderComplete(true)
      // Xóa danh sách đã chọn
      localStorage.removeItem("techstore_selected_ids")
      // Cập nhật giỏ hàng (để xóa icon trên header)
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } else {
      setError(result.message) 
    }
  }

  // Success Screen
  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Đặt hàng thành công!</h2>
            <p className="text-muted-foreground mb-2">Cảm ơn bạn đã mua hàng tại TechStore</p>
            <p className="text-muted-foreground mb-8">
              Mã đơn hàng: <span className="font-semibold text-foreground">{orderCode || `#${Date.now()}`}</span>
            </p>
            <div className="space-y-3">
              <Link href="/products">
                <Button size="lg" className="w-full">
                  Tiếp tục mua sắm
                </Button>
              </Link>
              <Button asChild size="lg" variant="outline" className="w-full" disabled={!orderId}>
                <Link href={orderId ? `/account/orders/${orderId}` : '#'}>
                  Xem đơn hàng
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Đang tải giỏ hàng...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Main Checkout UI
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/50 py-12 border-b">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">Thanh toán</h1>
            <p className="text-muted-foreground">Hoàn tất đơn hàng của bạn</p>
          </div>
        </section>

        {/* Checkout Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Forms */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Information */}
                  <div className="border rounded-lg p-6 bg-card">
                    <h2 className="text-xl font-semibold mb-6">Thông tin liên hệ</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Họ *</Label>
                          <Input id="firstName" name="firstName" placeholder="Nguyễn" required className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Tên *</Label>
                          <Input id="lastName" name="lastName" placeholder="Văn A" required className="h-11" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="email@example.com"
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="0912 345 678"
                          required
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="border rounded-lg p-6 bg-card">
                    <h2 className="text-xl font-semibold mb-6">Địa chỉ giao hàng</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ *</Label>
                        <Input id="address" name="address" placeholder="123 Đường ABC" required className="h-11" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">Thành phố *</Label>
                          <Input id="city" name="city" placeholder="Hồ Chí Minh" required className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="district">Quận/Huyện *</Label>
                          <Input id="district" name="district" placeholder="Quận 1" required className="h-11" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú đơn hàng (tùy chọn)</Label>
                        <textarea
                          id="notes"
                          name="notes"
                          className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                          placeholder="Ghi chú về đơn hàng..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="border rounded-lg p-6 bg-card">
                    <h2 className="text-xl font-semibold mb-6">Phương thức thanh toán</h2>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                      <div
                        className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 flex items-center gap-3 cursor-pointer">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">Thanh toán khi nhận hàng (COD)</p>
                            <p className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                  <div className="sticky top-20">
                    <div className="border rounded-lg p-6 bg-card">
                      <h2 className="text-xl font-semibold mb-6">Đơn hàng của bạn</h2>

                      {/* Cart Items */}
                      <div className="space-y-4 mb-6 pb-6 border-b">
                        {cartItems.map((item) => (
                          <div key={item.cart_item_id} className="flex gap-3">
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                              <Image
                                src={item.base_image || "/placeholder.svg"}
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
                                {item.size} • {item.color_name}
                              </p>
                              <p className="text-sm font-semibold mt-1">{item.price.toLocaleString("vi-VN")}₫</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Total */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tạm tính</span>
                          <span className="font-medium">{subtotal.toLocaleString("vi-VN")}₫</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Phí vận chuyển</span>
                          <span className="font-medium">
                            {shipping === 0 ? (
                              <span className="text-green-600">Miễn phí</span>
                            ) : (
                              `${shipping.toLocaleString("vi-VN")}₫`
                            )}
                          </span>
                        </div>
                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Tổng cộng</span>
                            <span className="text-2xl font-bold">{total.toLocaleString("vi-VN")}₫</span>
                          </div>
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
                          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                          <p className="text-sm text-destructive">{error}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isProcessing || cartItems.length === 0}
                      >
                        {isProcessing ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Đang xử lý...
                          </span>
                        ) : (
                          "Hoàn tất đơn hàng"
                        )}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-4">Thanh toán an toàn & bảo mật</p>
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