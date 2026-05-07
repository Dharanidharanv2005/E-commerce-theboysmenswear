import Link from "next/link"
import { Truck, Shield, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CartSummaryProps {
  subtotal: number
  shipping: number
  total: number
  itemCount: number
  isLoggedIn: boolean
}

export function CartSummary({
  subtotal,
  shipping,
  total,
  itemCount,
  isLoggedIn,
}: CartSummaryProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Order Summary
      </h2>

      {/* Coupon Code */}
      <div className="mb-6">
        <label htmlFor="coupon" className="text-sm text-muted-foreground mb-2 block">
          Have a coupon code?
        </label>
        <div className="flex gap-2">
          <Input
            id="coupon"
            placeholder="Enter code"
            className="flex-1"
          />
          <Button variant="outline">Apply</Button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pb-6 border-b border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
          <span className="text-foreground">Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className={shipping === 0 ? "text-green-600" : "text-foreground"}>
            {shipping === 0 ? "FREE" : `Rs. ${shipping}`}
          </span>
        </div>
        {shipping === 0 && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-md p-2">
            <Truck className="h-4 w-4" />
            <span>Free shipping applied!</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-6 border-b border-border">
        <span className="text-lg font-semibold text-foreground">Total</span>
        <span className="text-2xl font-bold text-foreground">
          Rs. {total.toLocaleString()}
        </span>
      </div>

      {/* Checkout Button */}
      <div className="mt-6 space-y-4">
        {isLoggedIn ? (
          <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
            <Link href="/checkout">
              Proceed to Checkout
            </Link>
          </Button>
        ) : (
          <div className="space-y-3">
            <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
              <Link href="/login?redirect=/checkout">
                Sign In to Checkout
              </Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              or{" "}
              <Link href="/register?redirect=/checkout" className="text-accent hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-border space-y-3">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-accent" />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Tag className="h-4 w-4 text-accent" />
          <span>Best price guaranteed</span>
        </div>
      </div>
    </div>
  )
}
