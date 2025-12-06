// hooks/useProductSearch.ts
'use client'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SearchProduct } from '@/models/Product.model'; 

export function useProductSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Logic Debounce Search
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
        // Dynamic import service
        const { ProductService } = await import('@/services/ProductService');
        const allProducts = await ProductService.getAllProducts();
        
        const filtered: SearchProduct[] = allProducts
          .filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5)
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
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  // Logic click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
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

  return {
    searchQuery, setSearchQuery,
    searchResults,
    showSearchResults, setShowSearchResults,
    isSearching,
    searchRef,
    handleSearchSubmit,
    handleProductClick
  };
}