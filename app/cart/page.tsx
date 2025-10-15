
"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const initialCartItems = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 29990000,
    originalPrice: 34990000,
    image: "/iphone-15-pro-max.jpg",
    size: "256GB",
    color: "Titan Tự Nhiên",
    quantity: 1,
  },
  {
    id: "3",
    name: "MacBook Pro M3 14 inch",
    price: 42990000,
    originalPrice: 49990000,
    image: "/macbook-pro-m3.jpg",
    size: "16GB/512GB",
    color: "Xám Không Gian",
    quantity: 1,
  },
  {
    id: "6",
    name: "AirPods Pro 2",
    price: 5990000,
    originalPrice: 7490000,
    image: "/airpods-pro-2.jpg",
    size: "Standard",
    color: "Trắng",
    quantity: 2,
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [couponCode, setCouponCode] = useState("")

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 500000 ? 0 : 30000
  const discount = 0 // Would be calculated based on coupon
  const total = subtotal + shipping - discount

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
            <p className="text-muted-foreground mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm công nghệ của chúng tôi!
            </p>
            <Link href="/products">
              <Button size="lg">
                Tiếp tục mua sắm
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
            <h1 className="text-4xl font-bold mb-2">Giỏ hàng của bạn</h1>
            <p className="text-muted-foreground">Bạn có {cartItems.length} sản phẩm trong giỏ hàng</p>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-border rounded-lg bg-card">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.id}`}>
                            <h3 className="font-semibold hover:text-accent transition-colors line-clamp-1">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span>Size: {item.size}</span>
                            <span>•</span>
                            <span>Màu: {item.color}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{item.price.toLocaleString("vi-VN")}₫</span>
                          {item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {item.originalPrice.toLocaleString("vi-VN")}₫
                            </span>
                          )}
                        </div>

                        <div className="flex items-center border border-border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1.5 hover:bg-muted transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-1.5 border-x border-border min-w-[50px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 hover:bg-muted transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Continue Shopping */}
                <div className="pt-4">
                  <Link href="/products">
                    <Button variant="outline" className="bg-transparent">
                      Tiếp tục mua sắm
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-20 space-y-6">
                  <div className="border border-border rounded-lg p-6 bg-card">
                    <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span className="font-medium">{subtotal.toLocaleString("vi-VN")}₫</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Phí vận chuyển</span>
                        <span className="font-medium">
                          {shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString("vi-VN")}₫`}
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Giảm giá</span>
                          <span className="font-medium text-green-600">-{discount.toLocaleString("vi-VN")}₫</span>
                        </div>
                      )}
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Tổng cộng</span>
                          <span className="text-2xl font-bold">{total.toLocaleString("vi-VN")}₫</span>
                        </div>
                      </div>
                    </div>

                    <Link href="/checkout">
                      <Button size="lg" className="w-full mb-4">
                        Thanh toán
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>

                    {subtotal < 500000 && (
                      <p className="text-xs text-center text-muted-foreground">
                        Mua thêm {(500000 - subtotal).toLocaleString("vi-VN")}₫ để được miễn phí vận chuyển
                      </p>
                    )}
                  </div>

                  {/* Coupon Code */}
                  <div className="border border-border rounded-lg p-6 bg-card">
                    <h3 className="font-semibold mb-4">Mã giảm giá</h3>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button variant="outline" className="bg-transparent">
                        Áp dụng
                      </Button>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="border border-border rounded-lg p-6 bg-card space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Thanh toán an toàn</p>
                        <p className="text-xs text-muted-foreground">Bảo mật thông tin 100%</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Đổi trả miễn phí</p>
                        <p className="text-xs text-muted-foreground">Trong vòng 30 ngày</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
