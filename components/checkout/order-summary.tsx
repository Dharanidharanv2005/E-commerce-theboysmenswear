import Image from "next/image"
import type { CartItem } from "@/lib/types"

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
}

export function OrderSummary({
  items,
  subtotal,
  shipping,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Order Summary
      </h2>

      {/* Items */}
      <div className="space-y-4 pb-6 border-b border-border">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}-${item.color}`}
            className="flex gap-4"
          >
            <div className="relative w-16 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={item.product.images[0] || "/placeholder.svg"}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm truncate">
                {item.product.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {item.size} / {item.color} x {item.quantity}
              </p>
              <p className="text-sm font-medium text-foreground mt-1">
                Rs. {(item.product.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 py-6 border-b border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className={shipping === 0 ? "text-green-600" : "text-foreground"}>
            {shipping === 0 ? "FREE" : `Rs. ${shipping}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span className="text-foreground">Included</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-6">
        <span className="text-lg font-semibold text-foreground">Total</span>
        <span className="text-2xl font-bold text-foreground">
          Rs. {total.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
