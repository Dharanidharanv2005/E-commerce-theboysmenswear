"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, Plus, Minus, Check, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { addToCart } from "@/lib/actions/cart"
import type { Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface AddToCartFormProps {
  product: Product
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)
  const { toast } = useToast()

  const getSelectedColor = () => selectedColor || product.colors[0]?.name || "Default"

  const validateSelection = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      })
      return false
    }

    if (!selectedColor && product.colors.length > 0) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleAddToCart = () => {
    if (!validateSelection()) return

    startTransition(async () => {
      const result = await addToCart(
        product._id!,
        quantity,
        selectedSize,
        getSelectedColor()
      )

      if (result.success) {
        setAdded(true)
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        })
        setTimeout(() => setAdded(false), 2000)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add to cart",
          variant: "destructive",
        })
      }
    })
  }

  const handleBuyNow = () => {
    if (!validateSelection()) return

    startTransition(async () => {
      const result = await addToCart(
        product._id!,
        quantity,
        selectedSize,
        getSelectedColor()
      )

      if (result.success) {
        router.push("/checkout")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to start checkout",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div>
        <Label className="text-sm font-medium text-foreground mb-3 block">
          Size
        </Label>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={cn(
                "min-w-[48px] h-10 px-3 rounded-md border text-sm font-medium transition-colors",
                selectedSize === size
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-background text-foreground hover:border-foreground"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      {product.colors.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-foreground mb-3 block">
            Color: {selectedColor || "Select a color"}
          </Label>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color.name)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all",
                  selectedColor === color.name
                    ? "border-foreground ring-2 ring-offset-2 ring-accent"
                    : "border-border hover:border-foreground"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {selectedColor === color.name && (
                  <Check
                    className={cn(
                      "h-4 w-4 mx-auto",
                      color.hex.toLowerCase() === "#ffffff" ||
                        color.hex.toLowerCase() === "#fff"
                        ? "text-foreground"
                        : "text-white"
                    )}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <Label className="text-sm font-medium text-foreground mb-3 block">
          Quantity
        </Label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border rounded-md">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-medium text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            {product.stock} available
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          size="lg"
          className={cn(
            "transition-all",
            added
              ? "bg-green-600 hover:bg-green-600"
              : "bg-accent hover:bg-accent/90 text-accent-foreground"
          )}
          onClick={handleAddToCart}
          disabled={isPending || product.stock === 0}
        >
          {isPending ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
              Adding...
            </>
          ) : added ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5 mr-2" />
              Add to Cart
            </>
          )}
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="transition-all border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          onClick={handleBuyNow}
          disabled={isPending || product.stock === 0}
        >
          <Zap className="h-5 w-5 mr-2" />
          Buy Now
        </Button>
      </div>
    </div>
  )
}
