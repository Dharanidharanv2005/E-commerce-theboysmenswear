"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className={cn("group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300", className)}>
      {/* Image Container */}
      <Link href={`/products/${product._id}`} className="block relative aspect-[3/4] overflow-hidden">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Button size="sm" className="flex-1 bg-background text-foreground hover:bg-background/90">
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </div>
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-background transition-colors">
          <Heart className="h-4 w-4" />
          <span className="sr-only">Add to wishlist</span>
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <Badge variant="destructive" className="font-semibold">
              -{discount}%
            </Badge>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              Rs. {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Color Options */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-3">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color.name}
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
