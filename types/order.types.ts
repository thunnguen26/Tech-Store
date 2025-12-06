//types/oder.types.ts
import type { ICartItem } from "./cart.types"

export interface IOrder {
  id: string
  userId: string
  items: ICartItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  shippingAddress: IShippingAddress
  createdAt: Date
  updatedAt: Date
}

export interface IShippingAddress {
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  district: string
  ward: string
  notes?: string
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPING = "shipping",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  COD = "cod",
  CREDIT_CARD = "credit_card",
  BANK_TRANSFER = "bank_transfer",
}
