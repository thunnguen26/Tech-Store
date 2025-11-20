// components/header.tsx
'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, LogIn, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
}

interface Category {
  id: number;
  name: string;
  count: number;
}

interface SearchProduct {
  id: number;
  name: string;
  base_image: string;
  price: number;
  category_name: string;
}

export function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userDataString = localStorage.getItem('techstore_user');
      if (userDataString) {
        try {
          setUser(JSON.parse(userDataString));
        } catch (e) {
          console.error("Lỗi đọc dữ liệu người dùng:", e);
          localStorage.removeItem('techstore_user');
        }
      }
    }
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Import ProductService để dùng API có sẵn
        const { ProductService } = await import('@/services/ProductService');
        const data = await ProductService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
        // Fallback với danh mục mặc định nếu API lỗi
        setCategories([
          { id: 1, name: 'Điện thoại', count: 0 },
          { id: 2, name: 'Laptop', count: 0 },
          { id: 3, name: 'Máy tính bảng', count: 0 },
          { id: 4, name: 'Phụ kiện', count: 0 }
        ]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const { CartService } = await import('@/services/CartService');
        const cartItems = await CartService.getCart();
        setCartCount(cartItems.length);
      } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
      }
    };

    fetchCartCount();

    // Lắng nghe sự kiện cập nhật giỏ hàng
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Search products with debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const { ProductService } = await import('@/services/ProductService');
        const allProducts = await ProductService.getAllProducts();
        
        // Lọc sản phẩm theo từ khóa tìm kiếm
        const filtered = allProducts
          .filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5) // Giới hạn 5 kết quả
          .map(product => ({
            id: product.id,
            name: product.name,
            base_image: product.base_image || '/placeholder.svg',
            price: product.variants[0]?.price || 0,
            category_name: product.category_name
          }));

        setSearchResults(filtered);
        setShowSearchResults(filtered.length > 0);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Debounce 300ms

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('techstore_user');
    setUser(null);
    setIsMenuOpen(false);
    router.push('/');
    alert("Bạn đã đăng xuất thành công!");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  const handleProductClick = (productId: number) => {
    setShowSearchResults(false);
    setSearchQuery('');
    router.push(`/products/${productId}`);
  };

  const handleMouseEnterCategory = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    setShowCategoryDropdown(true);
  };

  const handleMouseLeaveCategory = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setShowCategoryDropdown(false);
    }, 200);
  };

  return (
    <header className={`sticky top-0 z-50 w-full  transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/30 backdrop-blur-md shadow-lg border-gray-800' 
        : 'bg-black/95 backdrop-blur-sm shadow-md border-gray-800'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="/icon/title.png"  
              alt="TechStore Logo" 
              className="w-9 h-9 rounded-xl"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
              TechStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-semibold text-gray-300 hover:text-white transition-all hover:scale-105">
              Sản phẩm
            </Link>
            
            {/* Danh mục với Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleMouseEnterCategory}
              onMouseLeave={handleMouseLeaveCategory}
            >
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-300 hover:text-white transition-all hover:scale-105 cursor-pointer">
                Danh mục
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </div>
              
              {/* Dropdown Menu */}
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.name}`}
                      className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors border-b border-gray-800 last:border-b-0"
                      onClick={() => setShowCategoryDropdown(false)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-xs text-gray-500">{category.count}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="text-sm font-semibold text-gray-300 hover:text-white transition-all hover:scale-105">
              Về chúng tôi
            </Link>
          </nav>

          {/* Desktop Search Bar with Autocomplete */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div ref={searchRef} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                placeholder="Tìm kiếm..."
                className="w-full px-4 py-2.5 pl-11 text-sm font-semibold border-2 border-gray-400 rounded-2xl 
             focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 
             bg-gray-100 text-gray-900 placeholder-gray-500 shadow-md hover:border-blue-200 transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-96 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <img 
                            src={product.base_image} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 text-left">
                            <p className="font-medium text-gray-900 text-sm line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.category_name}</p>
                          </div>
                          <span className="text-sm font-bold text-blue-600 flex-shrink-0">
                            {product.price.toLocaleString('vi-VN')}₫
                          </span>
                        </button>
                      ))}
                      <button
                        onClick={handleSearch}
                        className="w-full p-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                      >
                        Xem tất cả kết quả →
                      </button>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </form>

          {/* Desktop Icons & User */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/cart" className="relative text-gray-300 hover:text-white transition-all hover:scale-110">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-red-400 ">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/account" className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-800 transition-all">
                  <div className="w-9 h-9 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-gray-600 hover:border-gray-500 transition-all">
                    {user.firstName.charAt(0)}
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white hover:bg-gray-800 font-semibold rounded-xl"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-700">
                  <LogIn className="h-4 w-4 mr-2" />
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Icons */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/search" className="text-gray-300">
              <Search className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="relative text-gray-300">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold animate-pulse">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <nav className="py-4 space-y-1">
              <Link
                href="/products"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
              >
                Sản phẩm
              </Link>

              {/* Mobile Danh mục */}
              <div className="px-4 py-2">
                <div className="text-sm font-semibold text-gray-400 mb-2">Danh mục</div>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.name}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                  >
                    {category.name} ({category.count})
                  </Link>
                ))}
              </div>

              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
              >
                Về chúng tôi
              </Link>

              <div className="border-t border-gray-800 pt-4 mt-4">
                {user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-white font-semibold border-2 border-gray-600">
                        {user.firstName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-100">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-400">Xem tài khoản</div>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                  >
                    <LogIn className="h-5 w-5" />
                    <span className="font-medium">Đăng nhập</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}