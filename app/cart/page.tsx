import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartItems } from "@/components/cart/cart-items"
import { CartSummary } from "@/components/cart/cart-summary"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import { getCart, getCartCount } from "@/lib/actions/cart"

export const dynamic = "force-dynamic"

export default async function CartPage() {
  const [session, cart, cartCount] = await Promise.all([
    getSession(),
    getCart(),
    getCartCount(),
  ])

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartCount={cartCount}
        user={session ? { name: session.name, email: session.email, role: session.role } : null}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </nav>

          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-8">
            Shopping Cart
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/products">
                  Start Shopping
                </Link>
              </Button>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-8">
                <CartItems items={cart} />
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-4 mt-8 lg:mt-0">
                <CartSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  total={total}
                  itemCount={cart.length}
                  isLoggedIn={!!session}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
