import { Product, ProductDetail } from "@/models/Product.model"
import type { IProduct, IProductDetail, ProductCategory } from "@/types/product.types"

export class ProductService {
  private static instance: ProductService
  private products: Product[] = []

  private constructor() {
    this.initializeMockData()
  }

  // Singleton pattern
  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService()
    }
    return ProductService.instance
  }

  // Initialize with mock data
  private initializeMockData(): void {
    const mockProducts: IProduct[] = [
      {
        id: "1",
        name: "iPhone 15 Pro Max",
        price: 29990000,
        originalPrice: 34990000,
        image: "/iphone-15-pro-max.jpg",
        category: "Điện thoại",
        rating: 4.9,
        reviews: 328,
      },
      {
        id: "2",
        name: "Samsung Galaxy S24 Ultra",
        price: 27990000,
        originalPrice: 32990000,
        image: "/samsung-s24-ultra.jpg",
        category: "Điện thoại",
        rating: 4.8,
        reviews: 245,
      },
      {
        id: "3",
        name: "MacBook Pro M3 14 inch",
        price: 42990000,
        originalPrice: 49990000,
        image: "/macbook-pro-m3.jpg",
        category: "Laptop",
        rating: 5,
        reviews: 256,
      },
      {
        id: "4",
        name: "Dell XPS 15",
        price: 35990000,
        originalPrice: 42990000,
        image: "/dell-xps-15.jpg",
        category: "Laptop",
        rating: 4.7,
        reviews: 189,
      },
      {
        id: "5",
        name: "iPad Pro 12.9 inch M2",
        price: 28990000,
        originalPrice: 34990000,
        image: "/ipad-pro-m2.jpg",
        category: "Máy tính bảng",
        rating: 4.8,
        reviews: 167,
      },
      {
        id: "6",
        name: "AirPods Pro 2",
        price: 5990000,
        originalPrice: 7490000,
        image: "/airpods-pro-2.jpg",
        category: "Phụ kiện",
        rating: 4.9,
        reviews: 412,
      },
      {
        id: "7",
        name: "Apple Watch Series 9",
        price: 10990000,
        originalPrice: 12990000,
        image: "/apple-watch-9.jpg",
        category: "Phụ kiện",
        rating: 4.7,
        reviews: 298,
      },
      {
        id: "8",
        name: "Sony WH-1000XM5",
        price: 7990000,
        originalPrice: 9990000,
        image: "/sony-wh1000xm5.jpg",
        category: "Phụ kiện",
        rating: 4.9,
        reviews: 356,
      },
    ]

    this.products = mockProducts.map((p) => new Product(p))
  }

  // CRUD operations
  getAllProducts(): Product[] {
    return [...this.products]
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id)
  }

  getProductsByCategory(category: ProductCategory): Product[] {
    return this.products.filter((p) => p.category === category)
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase()
    return this.products.filter((p) => p.name.toLowerCase().includes(lowerQuery))
  }

  filterProducts(filters: {
    categories?: ProductCategory[]
    minPrice?: number
    maxPrice?: number
    minRating?: number
  }): Product[] {
    return this.products.filter((product) => {
      if (filters.categories && filters.categories.length > 0) {
        if (!filters.categories.includes(product.category)) return false
      }
      if (filters.minPrice !== undefined && product.price < filters.minPrice) return false
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false
      if (filters.minRating !== undefined && product.rating < filters.minRating) return false
      return true
    })
  }

  sortProducts(products: Product[], sortBy: "price-asc" | "price-desc" | "name" | "rating"): Product[] {
    const sorted = [...products]
    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price)
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating)
      default:
        return sorted
    }
  }

  // Mock method to get product details (in real app, this would fetch from API)
  getProductDetail(id: string): ProductDetail | undefined {
    const product = this.getProductById(id)
    if (!product) return undefined

    // Mock detailed data
    const detailData: IProductDetail = {
      ...product,
      images: [product.image, product.image, product.image],
      features: [
        "Hiệu năng vượt trội với chip mới nhất",
        "Màn hình chất lượng cao",
        "Pin lâu dài",
        "Thiết kế cao cấp",
        "Bảo hành chính hãng 12 tháng",
      ],
      sizes: product.category === "Điện thoại" ? ["128GB", "256GB", "512GB"] : undefined,
      colors:
        product.category === "Điện thoại" || product.category === "Laptop"
          ? [
              { name: "Đen", value: "#000000" },
              { name: "Trắng", value: "#FFFFFF" },
              { name: "Xám", value: "#808080" },
            ]
          : undefined,
    }

    return new ProductDetail(detailData)
  }
}
