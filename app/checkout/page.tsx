import { redirect } from "next/navigation"
export const dynamic = "force-dynamic"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { OrderSummary } from "@/components/checkout/order-summary"
import { getSession } from "@/lib/auth"
import { getCart, getCartCount } from "@/lib/actions/cart"

export default async function CheckoutPage() {
  const [session, cart, cartCount] = await Promise.all([
    getSession(),
    getCart(),
    getCartCount(),
  ])

  if (!session) {
    redirect("/login?redirect=/checkout")
  }

  if (cart.length === 0) {
    redirect("/cart")
  }

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
        user={{ name: session.name, email: session.email, role: session.role }}
      />

      <main className="flex-1 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </nav>

          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-8">
            Checkout
          </h1>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-7">
              <CheckoutForm user={session} />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              <OrderSummary
                items={cart}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
