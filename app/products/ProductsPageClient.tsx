// app/products/ProductsPageClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';

// 1. IMPORT CHUẨN MVC
import { ProductService } from '@/services/ProductService';
import { Product, ProductVariant, CategoryInfo } from '@/models/Product.model';

const ITEMS_PER_PAGE = 10; //Tổng sp

export default function ProductsPageClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  // State này dùng mảng chuỗi ["Tất cả", "Điện thoại", ...] để hiển thị bộ lọc
  const [categories, setCategories] = useState<string[]>(['Tất cả']);
  const [brands, setBrands] = useState<string[]>(['Tất cả']);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : ['Tất cả'],
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Tất cả']);
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          ProductService.getAllProducts(),
          ProductService.getCategories(),
        ]);
        setAllProducts(productsData);

        if (productsData.length > 0) {
          // 2. LOGIC MAP DỮ LIỆU: Chuyển CategoryInfo[] -> string[]
          // API trả về: [{id: 1, name: 'Phone', count: 5}, ...]
          // Bộ lọc cần: ["Tất cả", "Phone", ...]
          const categoryNames = [
            'Tất cả',
            ...categoriesData.map((c: CategoryInfo) => c.name),
          ];

          // Fallback: Nếu API danh mục lỗi, tự lấy từ danh sách sản phẩm
          if (categoryNames.length === 1) {
            const fallbackCats = [
              'Tất cả',
              ...new Set(productsData.map((p) => p.category_name)),
            ];
            setCategories(fallbackCats);
          } else {
            setCategories(categoryNames);
          }

          const uniqueBrands = new Set(
            productsData
              .map((p) => p.brand)
              .filter(Boolean)
              .map((b) => b!.trim()),
          );
          setBrands(['Tất cả', ...Array.from(uniqueBrands).sort()]);

          const maxP = productsData.reduce((max, product) => {
            const productMax = product.variants.reduce(
              (vMax, v) => Math.max(vMax, v.price),
              0,
            );
            return Math.max(max, productMax);
          }, 0);
          if (maxP > 0) {
            setMaxPrice(maxP);
            setPriceRange([0, maxP]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ... (Phần còn lại của file giữ nguyên không đổi: handleCategoryChange, filter, pagination...)
  const handleCategoryChange = (category: string) => {
    setCurrentPage(1);
    if (category === 'Tất cả') {
      setSelectedCategories(['Tất cả']);
    } else {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories.filter((c) => c !== 'Tất cả'), category];
      setSelectedCategories(
        newCategories.length === 0 ? ['Tất cả'] : newCategories,
      );
    }
  };

  const handleBrandChange = (brand: string) => {
    setCurrentPage(1);
    if (brand === 'Tất cả') {
      setSelectedBrands(['Tất cả']);
    } else {
      const newBrands = selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands.filter((b) => b !== 'Tất cả'), brand];
      setSelectedBrands(newBrands.length === 0 ? ['Tất cả'] : newBrands);
    }
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setSelectedCategories(['Tất cả']);
    setSelectedBrands(['Tất cả']);
    setPriceRange([0, maxPrice]);
  };

  const getProductMinPrice = (variants: ProductVariant[]): number => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce(
      (min, v) => Math.min(min, v.price),
      variants[0].price,
    );
  };

  const filteredProducts = allProducts.filter((product) => {
    const categoryMatch =
      selectedCategories.includes('Tất cả') ||
      selectedCategories.includes(product.category_name);
    const brandMatch =
      selectedBrands.includes('Tất cả') ||
      (product.brand && selectedBrands.includes(product.brand));
    const minPrice = getProductMinPrice(product.variants);
    const priceMatch = minPrice >= priceRange[0] && minPrice <= priceRange[1];
    return categoryMatch && brandMatch && priceMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = getProductMinPrice(a.variants);
    const priceB = getProductMinPrice(b.variants);
    switch (sortBy) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">
              {selectedCategories.includes('Tất cả')
                ? 'Tất cả sản phẩm'
                : selectedCategories.join(', ')}
            </h1>
            <p className="text-muted-foreground">
              Khám phá bộ sưu tập công nghệ đầy đủ của chúng tôi
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-20 space-y-6">
                  {/* Categories Filter */}
                  <div>
                    <h3 className="font-semibold mb-4">Danh mục</h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`desktop-cat-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() =>
                              handleCategoryChange(category)
                            }
                          />
                          <Label
                            htmlFor={`desktop-cat-${category}`}
                            className="text-sm cursor-pointer"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Thương hiệu</h3>
                    <div className="space-y-3">
                      {brands.map((brand) => (
                        <div
                          key={brand}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`desktop-brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => handleBrandChange(brand)}
                          />
                          <Label
                            htmlFor={`desktop-brand-${brand}`}
                            className="text-sm cursor-pointer"
                          >
                            {brand}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Khoảng giá</h3>
                    <div className="space-y-4">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={maxPrice}
                        step={500000}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{priceRange[0].toLocaleString('vi-VN')}₫</span>
                        <span>{priceRange[1].toLocaleString('vi-VN')}₫</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={clearFilters}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </aside>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-6 gap-4">
                  {/* Toolbar */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden bg-transparent"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" /> Bộ lọc
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Hiển thị {startIndex + 1}-
                      {Math.min(endIndex, sortedProducts.length)} trong{' '}
                      {sortedProducts.length} sản phẩm
                    </p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Nổi bật</SelectItem>
                      <SelectItem value="price-asc">
                        Giá: Thấp đến cao
                      </SelectItem>
                      <SelectItem value="price-desc">
                        Giá: Cao đến thấp
                      </SelectItem>
                      <SelectItem value="name">Tên: A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile Filters */}
                {showFilters && (
                  <div className="lg:hidden mb-6 p-4 border border-border rounded-lg bg-card space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Bộ lọc</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowFilters(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id.toString()}
                        name={product.name}
                        price={getProductMinPrice(product.variants)}
                        image={product.base_image || '/placeholder.svg'}
                        category={product.category_name}
                        rating={product.rating}
                        reviewCount={product.review_count}
                        variants={product.variants}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">
                        Không tìm thấy sản phẩm phù hợp
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </Button>
                      ),
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
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
  );
}
