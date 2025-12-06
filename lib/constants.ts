//lib/constans.ts
export const APP_CONFIG = {
  APP_NAME: "TechStore",
  APP_DESCRIPTION: "Cửa hàng công nghệ hàng đầu Việt Nam",
  FREE_SHIPPING_THRESHOLD: 500000,
  SHIPPING_FEE: 30000,
  CURRENCY: "₫",
  LOCALE: "vi-VN",
} as const

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
} as const

export const CATEGORIES = ["Tất cả", "Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện"] as const
