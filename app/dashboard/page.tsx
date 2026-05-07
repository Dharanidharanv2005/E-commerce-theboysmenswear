import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, Heart, MapPin, Settings, ShoppingBag, ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import { getCartCount } from "@/lib/actions/cart"
import { getOrders } from "@/lib/actions/orders"

export const dynamic = "force-dynamic"

const quickLinks = [
  {
    icon: Package,
    title: "My Orders",
    description: "Track, return, or buy things again",
    href: "/dashboard/orders",
  },
  {
    icon: Heart,
    title: "Wishlist",
    description: "Your saved items",
    href: "/dashboard/wishlist",
  },
  {
    icon: MapPin,
    title: "Addresses",
    description: "Manage your delivery addresses",
    href: "/dashboard/addresses",
  },
  {
    icon: Settings,
    title: "Account Settings",
    description: "Update your profile and preferences",
    href: "/dashboard/settings",
  },
]

export default async function DashboardPage() {
  const [session, cartCount, orders] = await Promise.all([
    getSession(),
    getCartCount(),
    getOrders(),
  ])

  if (!session) {
    redirect("/login?redirect=/dashboard")
  }

  const recentOrders = orders.slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartCount={cartCount}
        user={{ name: session.name, email: session.email, role: session.role }}
      />

      <main className="flex-1 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Hello, {session.name}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back to your dashboard
                </p>
              </div>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/products">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Quick Links
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <link.icon className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                          {link.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Account Info */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Account Info
              </h2>
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-2xl font-bold">
                    {session.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{session.name}</p>
                    <p className="text-sm text-muted-foreground">{session.email}</p>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Orders</span>
                    <span className="font-medium text-foreground">{orders.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium text-foreground">
                      {new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Orders
              </h2>
              {orders.length > 0 && (
                <Link
                  href="/dashboard/orders"
                  className="text-sm text-accent hover:underline flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {recentOrders.length > 0 ? (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/dashboard/orders/${order._id}`}
                              className="text-accent hover:underline font-medium"
                            >
                              #{order._id?.slice(-8).toUpperCase()}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                            Rs. {order.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">No orders yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start shopping to see your orders here
                </p>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
