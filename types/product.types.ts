export interface IProduct {
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
}

export interface IProductDetail extends IProduct {
  images: string[]
  features: string[]
  sizes?: string[]
  colors?: IProductColor[]
}

export interface IProductColor {
  name: string
  value: string
}

export type ProductCategory = "Điện thoại" | "Laptop" | "Máy tính bảng" | "Phụ kiện"

export enum ProductCategoryEnum {
  PHONE = "Điện thoại",
  LAPTOP = "Laptop",
  TABLET = "Máy tính bảng",
  ACCESSORY = "Phụ kiện",
}
