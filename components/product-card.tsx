import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Heart } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating?: number
}

export function ProductCard({ id, name, price, originalPrice, image, category, rating = 5 }: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-semibold">
              -{discount}%
            </div>
          )}
          <Button variant="ghost" size="icon" className="absolute top-2 left-2 bg-background/80 hover:bg-background">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${id}`}>
          <p className="text-xs text-muted-foreground mb-1">{category}</p>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-accent transition-colors">{name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{price.toLocaleString("vi-VN")}₫</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  )
}
