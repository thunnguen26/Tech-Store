import { Cart } from "@/models/Cart.model"
import type { ICartItem } from "@/types/cart.types"

export class CartService {
  private static instance: CartService
  private cart: Cart

  private constructor() {
    // Initialize with mock data or load from localStorage
    this.cart = new Cart(this.loadFromStorage())
  }

  // Singleton pattern
  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService()
    }
    return CartService.instance
  }

  // Storage operations
  private loadFromStorage(): ICartItem[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem("cart")
    return stored ? JSON.parse(stored) : []
  }

  private saveToStorage(): void {
    if (typeof window === "undefined") return
    localStorage.setItem("cart", JSON.stringify(this.cart.getItems()))
  }

  // Cart operations
  getCart(): Cart {
    return this.cart
  }

  addToCart(item: ICartItem): void {
    this.cart.addItem(item)
    this.saveToStorage()
  }

  removeFromCart(itemId: string): void {
    this.cart.removeItem(itemId)
    this.saveToStorage()
  }

  updateQuantity(itemId: string, quantity: number): void {
    this.cart.updateQuantity(itemId, quantity)
    this.saveToStorage()
  }

  clearCart(): void {
    this.cart.clearCart()
    this.saveToStorage()
  }

  getItemCount(): number {
    return this.cart.getItemCount()
  }
}
