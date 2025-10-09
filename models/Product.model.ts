import type { IProduct, IProductDetail, ProductCategory } from "@/types/product.types"

export class Product implements IProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: ProductCategory
  rating: number
  reviews?: number
  description?: string
  inStock?: boolean
  sku?: string

  constructor(data: IProduct) {
    this.id = data.id
    this.name = data.name
    this.price = data.price
    this.originalPrice = data.originalPrice
    this.image = data.image
    this.category = data.category
    this.rating = data.rating
    this.reviews = data.reviews
    this.description = data.description
    this.inStock = data.inStock ?? true
    this.sku = data.sku
  }

  // Business logic methods
  getDiscount(): number {
    if (!this.originalPrice) return 0
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
  }

  getFormattedPrice(): string {
    return this.price.toLocaleString("vi-VN") + "₫"
  }

  getFormattedOriginalPrice(): string {
    return this.originalPrice ? this.originalPrice.toLocaleString("vi-VN") + "₫" : ""
  }

  isOnSale(): boolean {
    return !!this.originalPrice && this.originalPrice > this.price
  }

  isAvailable(): boolean {
    return this.inStock ?? true
  }
}

export class ProductDetail extends Product implements IProductDetail {
  images: string[]
  features: string[]
  sizes?: string[]
  colors?: Array<{ name: string; value: string }>

  constructor(data: IProductDetail) {
    super(data)
    this.images = data.images
    this.features = data.features
    this.sizes = data.sizes
    this.colors = data.colors
  }
}
