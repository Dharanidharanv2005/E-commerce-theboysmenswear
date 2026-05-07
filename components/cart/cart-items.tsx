"use client"

import { useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateCartItem, removeFromCart } from "@/lib/actions/cart"
import type { CartItem } from "@/lib/types"
import { useRouter } from "next/navigation"

interface CartItemsProps {
  items: CartItem[]
}

function CartItemRow({ item }: { item: CartItem }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleUpdateQuantity = (newQuantity: number) => {
    startTransition(async () => {
      await updateCartItem(item.productId, item.size, item.color, newQuantity)
      router.refresh()
    })
  }

  const handleRemove = () => {
    startTransition(async () => {
      await removeFromCart(item.productId, item.size, item.color)
      router.refresh()
    })
  }

  return (
    <div className="flex gap-4 py-6 border-b border-border last:border-0">
      {/* Product Image */}
      <Link
        href={`/products/${item.productId}`}
        className="flex-shrink-0 w-24 h-32 relative rounded-md overflow-hidden bg-muted"
      >
        <Image
          src={item.product.images[0] || "/placeholder.svg"}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <Link
            href={`/products/${item.productId}`}
            className="font-medium text-foreground hover:text-accent transition-colors"
          >
            {item.product.name}
          </Link>
          <div className="mt-1 text-sm text-muted-foreground space-x-2">
            <span>Size: {item.size}</span>
            <span className="text-border">|</span>
            <span>Color: {item.color}</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-foreground">
            Rs. {item.product.price.toLocaleString()}
          </p>
        </div>

        {/* Quantity & Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-border rounded-md">
            <button
              type="button"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              disabled={isPending || item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-10 text-center text-sm font-medium text-foreground">
              {isPending ? "..." : item.quantity}
            </span>
            <button
              type="button"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              disabled={isPending || item.quantity >= item.product.stock}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>

      {/* Item Total */}
      <div className="hidden sm:block text-right">
        <p className="font-semibold text-foreground">
          Rs. {(item.product.price * item.quantity).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export function CartItems({ items }: CartItemsProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Cart Items ({items.length})
      </h2>
      <div>
        {items.map((item) => (
          <CartItemRow
            key={`${item.productId}-${item.size}-${item.color}`}
            item={item}
          />
        ))}
      </div>
    </div>
  )
}
