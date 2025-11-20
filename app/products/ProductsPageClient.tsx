// app/products/ProductClient.tsx
'use client'

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react"
import { ProductService, Product, ProductVariant } from "@/services/ProductService"

const ITEMS_PER_PAGE = 8

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')

  // States cho dữ liệu
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(["Tất cả"])
  const [brands, setBrands] = useState<string[]>(["Tất cả"])
  const [isLoading, setIsLoading] = useState(true)

  // States cho bộ lọc
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Tất cả"])
  const [selectedBrands, setSelectedBrands] = useState<string[]>(["Tất cả"])
  const [priceRange, setPriceRange] = useState([0, 50000000])
  const [maxPrice, setMaxPrice] = useState(50000000)
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      
      const data = await ProductService.getAllProducts()
      setAllProducts(data)

      if (data.length > 0) {
        // Lấy danh sách Categories
        const allCats = ["Tất cả", ...new Set(data.map(p => p.category_name))]
        setCategories(allCats)
        
        // Lấy danh sách Brands - LỌC VÀ SẮP XẾP
        const uniqueBrands = new Set(
          data
            .map(p => p.brand)
            .filter(Boolean) // Loại bỏ null/undefined
            .map(b => b!.trim()) // Trim whitespace và assert non-null
        )
        
        // Sắp xếp brands theo alphabet
        const sortedBrands = Array.from(uniqueBrands).sort((a, b) => 
          a.localeCompare(b, 'vi', { sensitivity: 'base' })
        )
        
        setBrands(["Tất cả", ...sortedBrands])
        
        // Tìm giá cao nhất
        const maxP = data.reduce((max, product) => {
          const productMax = product.variants.reduce((vMax, v) => Math.max(vMax, v.price), 0)
          return Math.max(max, productMax)
        }, 0)
        
        setMaxPrice(maxP > 0 ? maxP : 50000000)
        setPriceRange([0, maxP > 0 ? maxP : 50000000])
      }
      
      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  // === XỬ LÝ CATEGORY TỪ URL ===
  useEffect(() => {
    // Khi có category từ URL và danh sách categories đã load xong
    if (categoryFromUrl && categories.length > 1) {
      // Kiểm tra xem category có tồn tại trong danh sách không
      const categoryExists = categories.includes(categoryFromUrl)
      
      if (categoryExists) {
        // Tự động chọn category từ URL
        setSelectedCategories([categoryFromUrl])
        setCurrentPage(1)
        console.log("Auto-selected category from URL:", categoryFromUrl)
      } else {
        console.warn("Category from URL not found:", categoryFromUrl)
      }
    }
  }, [categoryFromUrl, categories])

  // Reset trang khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategories, selectedBrands, priceRange, sortBy])

  // Xử lý lọc Category
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

  // Xử lý lọc Brand
  const handleBrandChange = (brand: string) => {
    if (brand === "Tất cả") {
      setSelectedBrands(["Tất cả"])
    } else {
      const newBrands = selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands.filter((b) => b !== "Tất cả"), brand]
      setSelectedBrands(newBrands.length === 0 ? ["Tất cả"] : newBrands)
    }
  }

  // Xóa tất cả bộ lọc
  const clearFilters = () => {
    setSelectedCategories(["Tất cả"])
    setSelectedBrands(["Tất cả"])
    setPriceRange([0, maxPrice])
    setCurrentPage(1)
  }

  // Lấy giá thấp nhất của sản phẩm
  const getProductMinPrice = (variants: ProductVariant[]): number => {
    if (!variants || variants.length === 0) return 0
    return variants.reduce((min, v) => Math.min(min, v.price), variants[0].price)
  }

  // Lọc sản phẩm
  const filteredProducts = allProducts.filter((product) => {
    const categoryMatch = selectedCategories.includes("Tất cả") || selectedCategories.includes(product.category_name)
    const brandMatch = selectedBrands.includes("Tất cả") || (product.brand && selectedBrands.includes(product.brand))
    const minPrice = getProductMinPrice(product.variants)
    const priceMatch = minPrice >= priceRange[0] && minPrice <= priceRange[1]
    
    return categoryMatch && brandMatch && priceMatch
  })

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = getProductMinPrice(a.variants)
    const priceB = getProductMinPrice(b.variants)

    switch (sortBy) {
      case "price-asc":
        return priceA - priceB
      case "price-desc":
        return priceB - priceA
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  // Tính toán pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/30 py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">
              {categoryFromUrl && selectedCategories[0] !== "Tất cả" 
                ? `${selectedCategories[0]}` 
                : "Tất cả sản phẩm"}
            </h1>
            <p className="text-muted-foreground">
              {categoryFromUrl && selectedCategories[0] !== "Tất cả"
                ? `Khám phá các sản phẩm ${selectedCategories[0].toLowerCase()} chất lượng cao`
                : "Khám phá bộ sưu tập công nghệ đầy đủ của chúng tôi"}
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filter (Desktop) */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-20 space-y-6">
                  {/* Categories Filter */}
                  <div>
                    <h3 className="font-semibold mb-4">Danh mục</h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`desktop-cat-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryChange(category)}
                          />
                          <Label htmlFor={`desktop-cat-${category}`} className="text-sm cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Brands Filter */}
                  <div>
                    <h3 className="font-semibold mb-4">Thương hiệu</h3>
                    <div className="space-y-3">
                      {brands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={`desktop-brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => handleBrandChange(brand)}
                          />
                          <Label htmlFor={`desktop-brand-${brand}`} className="text-sm cursor-pointer">
                            {brand}
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
                        max={maxPrice}
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
                  <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
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
                    <p className="text-sm text-muted-foreground">
                      Hiển thị {paginatedProducts.length} / {sortedProducts.length} sản phẩm
                      {categoryFromUrl && selectedCategories[0] !== "Tất cả" && (
                        <span className="font-medium text-foreground ml-1">
                          • {selectedCategories[0]}
                        </span>
                      )}
                    </p>
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
                          <div key={`mobile-cat-${category}`} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-cat-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <Label htmlFor={`mobile-cat-${category}`} className="text-sm cursor-pointer">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Brand Filter */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm">Thương hiệu</h4>
                      <div className="space-y-3">
                        {brands.map((brand) => (
                          <div key={`mobile-brand-${brand}`} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-brand-${brand}`}
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={() => handleBrandChange(brand)}
                            />
                            <Label htmlFor={`mobile-brand-${brand}`} className="text-sm cursor-pointer">
                              {brand}
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
                          max={maxPrice}
                          step={1000000}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{priceRange[0].toLocaleString("vi-VN")}₫</span>
                          <span>{priceRange[1].toLocaleString("vi-VN")}₫</span>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
                      Xóa bộ lọc
                    </Button>
                  </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <ProductCard 
                        key={product.id}
                        id={product.id.toString()}
                        name={product.name}
                        price={getProductMinPrice(product.variants)}
                        image={product.images?.[0] || product.base_image || "/placeholder.svg"}
                        category={product.category_name}
                        rating={product.rating}
                        reviewCount={product.review_count}
                        variants={product.variants}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">Không tìm thấy sản phẩm phù hợp</p>
                      <Button variant="outline" className="mt-4" onClick={clearFilters}>
                        Xóa bộ lọc
                      </Button>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {sortedProducts.length > 0 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="bg-transparent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "" : "bg-transparent"}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="bg-transparent"
                    >
                      <ChevronRight className="h-4 w-4" />
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