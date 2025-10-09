"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal, X } from "lucide-react"

const allProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 29990000,
    originalPrice: 34990000,
    image: "/iphone-15-pro-max.jpg",
    category: "Điện thoại",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    price: 27990000,
    originalPrice: 32990000,
    image: "/samsung-s24-ultra.jpg",
    category: "Điện thoại",
    rating: 4.8,
  },
  {
    id: "3",
    name: "MacBook Pro M3 14 inch",
    price: 42990000,
    originalPrice: 49990000,
    image: "/macbook-pro-m3.jpg",
    category: "Laptop",
    rating: 5,
  },
  {
    id: "4",
    name: "Dell XPS 15",
    price: 35990000,
    originalPrice: 42990000,
    image: "/dell-xps-15.jpg",
    category: "Laptop",
    rating: 4.7,
  },
  {
    id: "5",
    name: "iPad Pro 12.9 inch M2",
    price: 28990000,
    originalPrice: 34990000,
    image: "/ipad-pro-m2.jpg",
    category: "Máy tính bảng",
    rating: 4.8,
  },
  {
    id: "6",
    name: "AirPods Pro 2",
    price: 5990000,
    originalPrice: 7490000,
    image: "/airpods-pro-2.jpg",
    category: "Phụ kiện",
    rating: 4.9,
  },
  {
    id: "7",
    name: "Apple Watch Series 9",
    price: 10990000,
    originalPrice: 12990000,
    image: "/apple-watch-9.jpg",
    category: "Phụ kiện",
    rating: 4.7,
  },
  {
    id: "8",
    name: "Sony WH-1000XM5",
    price: 7990000,
    originalPrice: 9990000,
    image: "/sony-wh1000xm5.jpg",
    category: "Phụ kiện",
    rating: 4.9,
  },
  {
    id: "9",
    name: "Xiaomi 14 Pro",
    price: 19990000,
    originalPrice: 24990000,
    image: "/xiaomi-14-pro.jpg",
    category: "Điện thoại",
    rating: 4.6,
  },
  {
    id: "10",
    name: "ASUS ROG Zephyrus G14",
    price: 38990000,
    originalPrice: 45990000,
    image: "/asus-rog-g14.jpg",
    category: "Laptop",
    rating: 4.8,
  },
  {
    id: "11",
    name: "Samsung Galaxy Tab S9",
    price: 18990000,
    originalPrice: 23990000,
    image: "/samsung-tab-s9.jpg",
    category: "Máy tính bảng",
    rating: 4.7,
  },
  {
    id: "12",
    name: "Logitech MX Master 3S",
    price: 2490000,
    originalPrice: 2990000,
    image: "/logitech-mx-master.jpg",
    category: "Phụ kiện",
    rating: 4.8,
  },
]

const categories = ["Tất cả", "Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện"]

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Tất cả"])
  const [priceRange, setPriceRange] = useState([0, 45990000])
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  const handleCategoryChange = (category: string) => {
    if (category === "Tất cả") {
      setSelectedCategories(["Tất cả"])
    } else {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories.filter((c) => c !== "Tất cả"), category]
      setSelectedCategories(newCategories.length === 0 ? ["Tất cả"] : newCategories)
    }
  }

  const filteredProducts = allProducts.filter((product) => {
    const categoryMatch = selectedCategories.includes("Tất cả") || selectedCategories.includes(product.category)
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    return categoryMatch && priceMatch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/30 py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">Tất cả sản phẩm</h1>
            <p className="text-muted-foreground">Khám phá bộ sưu tập công nghệ đầy đủ của chúng tôi</p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar - Desktop */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-20 space-y-6">
                  {/* Categories Filter */}
                  <div>
                    <h3 className="font-semibold mb-4">Danh mục</h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryChange(category)}
                          />
                          <Label htmlFor={category} className="text-sm cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h3 className="font-semibold mb-4">Khoảng giá</h3>
                    <div className="space-y-4">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={45990000}
                        step={1000000}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{priceRange[0].toLocaleString("vi-VN")}₫</span>
                        <span>{priceRange[1].toLocaleString("vi-VN")}₫</span>
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setSelectedCategories(["Tất cả"])
                      setPriceRange([0, 45990000])
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden bg-transparent"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Bộ lọc
                    </Button>
                    <p className="text-sm text-muted-foreground">Hiển thị {sortedProducts.length} sản phẩm</p>
                  </div>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Nổi bật</SelectItem>
                      <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                      <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                      <SelectItem value="name">Tên: A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile Filters */}
                {showFilters && (
                  <div className="lg:hidden mb-6 p-4 border border-border rounded-lg bg-card space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Bộ lọc</h3>
                      <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Categories Filter */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm">Danh mục</h4>
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <Label htmlFor={`mobile-${category}`} className="text-sm cursor-pointer">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm">Khoảng giá</h4>
                      <div className="space-y-4">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={45990000}
                          step={1000000}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{priceRange[0].toLocaleString("vi-VN")}₫</span>
                          <span>{priceRange[1].toLocaleString("vi-VN")}₫</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => {
                        setSelectedCategories(["Tất cả"])
                        setPriceRange([0, 45990000])
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                )}

                {/* Products Grid */}
                {sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {sortedProducts.map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">Không tìm thấy sản phẩm nào</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategories(["Tất cả"])
                        setPriceRange([0, 45990000])
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
