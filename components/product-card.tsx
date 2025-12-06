// components/product-card.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Heart, Star, Loader2 } from 'lucide-react';

// 1. IMPORT CHUẨN MVC (Sửa dòng này)
import { CartService } from '@/services/CartService';
import { ProductVariant } from '@/models/Product.model'; // <-- Lấy từ Model

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  priority?: boolean;
  variants?: ProductVariant[];
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  rating = 5,
  reviewCount = 0,
  priority = false,
  variants = [],
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let variantToAdd = variants.find((v) => v.stock_quantity > 0);

    if (!variantToAdd) {
      alert('Sản phẩm này hiện đang hết hàng.');
      return;
    }

    setIsAdding(true);
    try {
      const result = await CartService.addItem(variantToAdd.id, 1);
      if (result.success) {
        // alert('Đã thêm vào giỏ hàng!');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi kết nối đến máy chủ.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <Link href={`/products/${id}`} className="flex-1">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image || '/placeholder.svg'}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-semibold">
              -{discount}%
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 bg-background/80 hover:bg-background"
            onClick={(e) => {
              e.preventDefault();
              alert('Chức năng yêu thích đang phát triển');
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{category}</p>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-accent transition-colors min-h-[40px]">
            {name}
          </h3>

          {rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-300 text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {reviewCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              {price.toLocaleString('vi-VN')}₫
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Button
          className="w-full"
          size="sm"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ShoppingCart className="h-4 w-4 mr-2" />
          )}
          {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
        </Button>
      </CardFooter>
    </Card>
  );
}
