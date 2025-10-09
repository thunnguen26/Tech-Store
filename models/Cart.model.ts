import type { ICartItem, ICartSummary } from "@/types/cart.types"

export class Cart {
  private items: ICartItem[] = []
  private readonly freeShippingThreshold = 500000
  private readonly shippingFee = 30000

  constructor(initialItems: ICartItem[] = []) {
    this.items = initialItems
  }

  // Getters
  getItems(): ICartItem[] {
    return [...this.items]
  }

  getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0)
  }

  // Cart operations
  addItem(item: ICartItem): void {
    const existingItem = this.items.find((i) => i.id === item.id)
    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      this.items.push({ ...item })
    }
  }

  removeItem(itemId: string): void {
    this.items = this.items.filter((item) => item.id !== itemId)
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.items.find((i) => i.id === itemId)
    if (item && quantity > 0) {
      item.quantity = quantity
    }
  }

  clearCart(): void {
    this.items = []
  }

  // Calculations
  calculateSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  calculateShipping(): number {
    const subtotal = this.calculateSubtotal()
    return subtotal >= this.freeShippingThreshold ? 0 : this.shippingFee
  }

  calculateTotal(discount = 0): number {
    return this.calculateSubtotal() + this.calculateShipping() - discount
  }

  getSummary(discount = 0): ICartSummary {
    return {
      subtotal: this.calculateSubtotal(),
      shipping: this.calculateShipping(),
      discount,
      total: this.calculateTotal(discount),
    }
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }
}
