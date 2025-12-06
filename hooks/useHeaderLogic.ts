'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// 1. Lấy 'User' từ User.model.ts (thay vì UserData từ types)
import { User } from '@/models/User.model';
// 2. Lấy 'CategoryInfo' từ Product.model.ts (thay vì Category từ types)
import { CategoryInfo } from '@/models/Product.model';

export function useHeaderLogic() {
  // Cập nhật kiểu dữ liệu cho state
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<CategoryInfo[]>([]); // Dùng CategoryInfo
  const [cartCount, setCartCount] = useState(0);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // 1. Auth Logic (User)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userDataString = localStorage.getItem('techstore_user');
      if (userDataString) {
        try {
          setUser(JSON.parse(userDataString));
        } catch (e) {
          console.error('Lỗi đọc user:', e);
          localStorage.removeItem('techstore_user');
        }
      }
    }
  }, []);

  const handleLogout = () => {
    // Xóa thông tin trong LocalStorage
    localStorage.removeItem('techstore_user');
    setUser(null);
    setIsMenuOpen(false);
    router.push('/');

    router.refresh();
  };
  // 2. Category Logic
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { ProductService } = await import('@/services/ProductService');
        const data = await ProductService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Lỗi tải danh mục:', error);
        setCategories([
          { id: 1, name: 'Điện thoại', count: 0 },
          { id: 2, name: 'Laptop', count: 0 },
          { id: 3, name: 'Máy tính bảng', count: 0 },
          { id: 4, name: 'Phụ kiện', count: 0 },
        ]);
      }
    };
    fetchCategories();
  }, []);

  // 3. Cart Logic
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const { CartService } = await import('@/services/CartService');
        const cartItems = await CartService.getCart();
        setCartCount(cartItems.length);
      } catch (error) {
        console.error('Lỗi tải giỏ hàng:', error);
      }
    };

    fetchCartCount();
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  // 4. UI Logic (Scroll & Resize)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 5. Dropdown handlers
  const handleMouseEnterCategory = () => {
    if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
    setShowCategoryDropdown(true);
  };

  const handleMouseLeaveCategory = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setShowCategoryDropdown(false);
    }, 200);
  };

  return {
    user,
    handleLogout,
    cartCount,
    categories,
    isScrolled,
    isMenuOpen,
    setIsMenuOpen,
    showCategoryDropdown,
    setShowCategoryDropdown,
    handleMouseEnterCategory,
    handleMouseLeaveCategory,
  };
}
