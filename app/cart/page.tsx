// app/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  Shield,
  Package,
  CheckSquare,
  Square,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { StockWarningModal } from '@/components/StockWarningModal';

import { CartService } from '@/services/CartService';
import { CartItem, StockWarningState } from '@/models/Cart.model';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  // Thêm state warning stock
  const [stockWarning, setStockWarning] = useState<StockWarningState | null>(
    null,
  );
  const router = useRouter();

  // Hàm tải giỏ hàng
  const fetchCart = async () => {
    setIsLoading(true);
    const items = await CartService.getCart();
    // SẮP XẾP
    const sortedItems = [...items].sort((a, b) => {
      return b.cart_item_id - a.cart_item_id; // Giảm dần
    });
    setCartItems(sortedItems);
    // setSelectedItems(new Set(items.map((item) => item.cart_item_id)));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Hàm toggle chọn item
  const toggleSelectItem = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // Hàm chọn/bỏ chọn tất cả
  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.cart_item_id)));
    }
  };

  // Cập nhật số lượng
  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.cart_item_id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );

    const result = await CartService.updateQuantity(id, newQuantity);
    if (!result.success) {
      alert(result.message);
      fetchCart();
    }
  };

  // Xóa sản phẩm
  const removeItem = async (id: number) => {
    setCartItems(cartItems.filter((item) => item.cart_item_id !== id));

    const newSelected = new Set(selectedItems);
    newSelected.delete(id);
    setSelectedItems(newSelected);

    const result = await CartService.removeItem(id);
    if (!result.success) {
      alert(result.message);
      fetchCart();
    }
  };

  const handleCheckout = async () => {
    const selectedIds = Array.from(selectedItems);

    if (selectedIds.length === 0) {
      alert('Bạn chưa chọn sản phẩm nào để thanh toán.');
      return;
    }

    // KIỂM TRA TỒN KHO - Sửa lỗi undefined
    for (const item of selectedCartItems) {
      const stockQty = item.stock_quantity ?? 0; // Xử lý undefined

      if (item.quantity > stockQty) {
        setStockWarning({
          isOpen: true,
          productName: `${item.name} (${item.size || 'N/A'}, ${
            item.color_name || 'N/A'
          })`,
          requestedQty: item.quantity,
          availableQty: stockQty,
        });
        return; // Dừng lại, không cho checkout
      }
    }

    localStorage.setItem('techstore_selected_ids', JSON.stringify(selectedIds));
    router.push('/checkout');
  };
  // Tính tiền các items được chọn
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.has(item.cart_item_id),
  );
  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 500000 ? 0 : subtotal > 0 ? 30000 : 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground text-lg">
              Đang tải giỏ hàng...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ShoppingBag className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Giỏ hàng trống</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm
              công nghệ của chúng tôi!
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="h-12 px-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Tiếp tục mua sắm
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Cart with Items
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 py-16 border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Giỏ hàng của bạn
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Bạn có{' '}
              <span className="font-semibold text-primary">
                {cartItems.length}
              </span>{' '}
              sản phẩm trong giỏ hàng
              {selectedItems.size > 0 &&
                selectedItems.size < cartItems.length && (
                  <span className="ml-2">
                    • Đã chọn{' '}
                    <span className="font-semibold text-primary">
                      {selectedItems.size}
                    </span>{' '}
                    sản phẩm
                  </span>
                )}
            </p>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Select All Checkbox */}
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    {selectedItems.size === cartItems.length ? (
                      <CheckSquare className="h-5 w-5 text-primary" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                    <span>Chọn tất cả ({cartItems.length} sản phẩm)</span>
                  </button>
                  {selectedItems.size > 0 && (
                    <span className="text-sm text-muted-foreground ml-auto">
                      Đã chọn: {selectedItems.size}
                    </span>
                  )}
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.cart_item_id}
                    className={`flex gap-4 p-5 border-2 rounded-2xl bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group ${
                      selectedItems.has(item.cart_item_id)
                        ? 'border-primary/50 shadow-md'
                        : 'border-border/50'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="flex items-start pt-1">
                      <button
                        onClick={() => toggleSelectItem(item.cart_item_id)}
                        className="hover:scale-110 transition-transform"
                      >
                        {selectedItems.has(item.cart_item_id) ? (
                          <CheckSquare className="h-6 w-6 text-primary" />
                        ) : (
                          <Square className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                        )}
                      </button>
                    </div>

                    <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-muted shadow-md group-hover:shadow-lg transition-shadow">
                      <Image
                        src={item.base_image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.product_id}`}>
                            <h3 className="font-bold text-base hover:text-primary transition-colors line-clamp-2 mb-2">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            {item.size && (
                              <span className="px-2 py-1 bg-muted rounded-md font-medium">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color_name && (
                              <span className="px-2 py-1 bg-muted rounded-md font-medium">
                                Màu: {item.color_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.cart_item_id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1 hover:bg-destructive/10 rounded-lg"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xl text-primary">
                            {item.price.toLocaleString('vi-VN')}₫
                          </span>
                          {item.original_price && item.original_price > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                              {item.original_price.toLocaleString('vi-VN')}₫
                            </span>
                          )}
                        </div>

                        <div className="flex items-center border-2 border-border rounded-lg overflow-hidden shadow-sm">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.cart_item_id,
                                item.quantity - 1,
                              )
                            }
                            className="px-3 py-2 hover:bg-primary/10 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-5 py-2 border-x-2 border-border min-w-[60px] text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.cart_item_id,
                                item.quantity + 1,
                              )
                            }
                            className="px-3 py-2 hover:bg-primary/10 transition-colors"
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
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 hover:border-primary/50 hover:bg-primary/5 bg-transparent"
                    >
                      <ArrowRight className="mr-2 h-5 w-5 rotate-180" />
                      Tiếp tục mua sắm
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-4">
                  {/* Summary Card */}
                  <div className="border-2 border-border/50 rounded-2xl p-6 bg-card/80 backdrop-blur-sm shadow-xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Tóm tắt đơn hàng
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-base">
                        <span className="text-muted-foreground">
                          Sản phẩm đã chọn:
                        </span>
                        <span className="font-semibold">
                          {selectedItems.size} sản phẩm
                        </span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-muted-foreground">Tạm tính:</span>
                        <span className="font-semibold">
                          {subtotal.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-muted-foreground">
                          Phí vận chuyển:
                        </span>
                        <span className="font-semibold">
                          {shipping === 0 ? (
                            <span className="text-green-600">Miễn phí</span>
                          ) : (
                            `${shipping.toLocaleString('vi-VN')}₫`
                          )}
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-base text-green-600">
                          <span>Giảm giá:</span>
                          <span className="font-semibold">
                            -{discount.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      )}

                      <div className="border-t-2 border-border pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">
                            Tổng cộng:
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {total.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Coupon Input */}
                    <div className="mb-6">
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        Mã giảm giá
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nhập mã"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="h-11 border-2 focus:border-primary"
                        />
                        <Button
                          variant="outline"
                          className="h-11 border-2 hover:border-primary/50 bg-transparent"
                        >
                          Áp dụng
                        </Button>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                      disabled={selectedItems.size === 0}
                      onClick={handleCheckout}
                    >
                      {selectedItems.size === 0 ? (
                        'Vui lòng chọn sản phẩm'
                      ) : (
                        <>
                          Thanh toán ({selectedItems.size})
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Benefits Card */}
                  <div className="border-2 border-border/50 rounded-2xl p-5 bg-gradient-to-br from-primary/5 to-primary/3 backdrop-blur-sm">
                    <h3 className="font-semibold mb-4 text-sm">
                      Mua sắm an toàn
                    </h3>
                    <div className="space-y-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>Thanh toán bảo mật 100%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span>Miễn phí vận chuyển từ 500k</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-orange-600 flex-shrink-0" />
                        <span>Đổi trả trong 30 ngày</span>
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
      {/* Modal cảnh báo */}
      {stockWarning && (
        <StockWarningModal
          isOpen={stockWarning.isOpen}
          onClose={() => setStockWarning(null)}
          productName={stockWarning.productName}
          requestedQty={stockWarning.requestedQty}
          availableQty={stockWarning.availableQty}
        />
      )}
    </div>
  );
}
