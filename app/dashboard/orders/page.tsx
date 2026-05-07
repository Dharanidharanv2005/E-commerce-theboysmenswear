import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSession } from "@/lib/auth"
import { getCartCount } from "@/lib/actions/cart"
import { getOrders } from "@/lib/actions/orders"

export const dynamic = "force-dynamic"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default async function OrdersPage() {
  const [session, cartCount, orders] = await Promise.all([
    getSession(),
    getCartCount(),
    getOrders(),
  ])

  if (!session) {
    redirect("/login?redirect=/dashboard/orders")
  }

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
              href="/dashboard"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </nav>

          <h1 className="font-serif text-3xl font-bold text-foreground mb-8">
            My Orders
          </h1>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-card rounded-lg border border-border overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-muted px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">Order ID</p>
                        <p className="font-medium text-foreground">
                          #{order._id?.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">Placed On</p>
                        <p className="font-medium text-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">Total</p>
                        <p className="font-medium text-foreground">
                          Rs. {order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={statusColors[order.status]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4"
                        >
                          <div className="relative w-20 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.product.images[0] || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Link
                              href={`/products/${item.productId}`}
                              className="font-medium text-foreground hover:text-accent transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.size} / {item.color} x {item.quantity}
                            </p>
                            <p className="text-sm font-medium text-foreground mt-1">
                              Rs. {(item.product.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-2">Shipping Address</p>
                      <p className="text-sm text-foreground">
                        {order.shippingAddress.name}<br />
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                        Phone: {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No orders yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                When you place an order, it will appear here
              </p>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
