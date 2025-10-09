export interface ICartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  size?: string
  color?: string
  quantity: number
}

export interface ICartSummary {
  subtotal: number
  shipping: number
  discount: number
  total: number
}
