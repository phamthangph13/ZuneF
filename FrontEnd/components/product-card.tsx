"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

interface ProductCardProps {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  category: string
  image: string
  seller: string
  isHot?: boolean
}

export function ProductCard({
  id,
  title,
  description,
  price,
  originalPrice,
  rating,
  reviewCount,
  category,
  image,
  seller,
  isHot = false,
}: ProductCardProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const handleAddToCart = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng")
      return
    }

    addToCart({
      id,
      title,
      price,
      originalPrice,
      image,
      seller,
    })

    // Show success message
    alert("Đã thêm sản phẩm vào giỏ hàng!")
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border">
      <CardHeader className="p-0 relative">
        <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute top-2 left-2 flex gap-2">
          {isHot && (
            <Badge variant="destructive" className="text-xs">
              HOT
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
              -{discount}%
            </Badge>
          )}
        </div>
        <Badge variant="outline" className="absolute top-2 right-2 text-xs">
          {category}
        </Badge>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">({reviewCount} đánh giá)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">{price.toLocaleString("vi-VN")}đ</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground">Bởi {seller}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button onClick={handleAddToCart} className="flex-1">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Thêm vào giỏ
        </Button>
        <Button variant="outline" size="icon" asChild>
          <Link href={`/product/${id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
