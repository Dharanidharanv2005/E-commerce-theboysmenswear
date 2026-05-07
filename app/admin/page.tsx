import { redirect } from "next/navigation"
import Link from "next/link"
import fs from "fs"
import path from "path"
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowRight,
  LayoutDashboard,
  Bell,
  Settings,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import { getProducts } from "@/lib/actions/products"
import { getAllOrders } from "@/lib/actions/orders"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/admin/login")
  }

  const [products, orders] = await Promise.all([
    getProducts(),
    getAllOrders(),
  ])

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0)

  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const completedOrders = orders.filter((o) => o.status === "delivered").length
  const recentNotifications = orders.filter((o) => o.status === "pending").slice(0, 3)

  const stats = [
    {
      title: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Products",
      value: products.length.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Orders",
      value: orders.length.toString(),
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toString(),
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentOrders = orders.slice(0, 5)

  // Load any images placed in public/uploads/store (server-side)
  let storeFiles: string[] = []
  try {
    const storeDir = path.join(process.cwd(), "public", "uploads", "store")
    if (fs.existsSync(storeDir)) {
      storeFiles = fs.readdirSync(storeDir).map((f) => `/uploads/store/${f}`)
    }
  } catch (err) {
    storeFiles = []
  }

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-primary text-primary-foreground">
        <div className="p-6">
          <h1 className="font-serif text-xl font-bold">THE BOYS</h1>
          <p className="text-xs uppercase tracking-widest text-primary-foreground/70">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-foreground/10 text-primary-foreground"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
          >
            <Package className="h-5 w-5" />
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            Orders
            {pendingOrders > 0 && (
              <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                {pendingOrders}
              </span>
            )}
          </Link>
          <Link
            href="/admin/notifications"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
          >
            <Bell className="h-5 w-5" />
            Notifications
            {pendingOrders > 0 && (
              <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                {pendingOrders}
              </span>
            )}
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-primary-foreground/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold">
              {session.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.name}</p>
              <p className="text-xs text-primary-foreground/70 truncate">{session.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="secondary" size="sm" className="flex-1">
              <Link href="/">View Store</Link>
            </Button>
            <form action="/api/auth/logout" method="POST">
              <Button type="submit" variant="secondary" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="lg:hidden bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-lg font-bold">THE BOYS</h1>
            <p className="text-xs text-primary-foreground/70">Admin Panel</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link href="/">Store</Link>
            </Button>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
              <p className="text-muted-foreground">
                Welcome back, {session.name}
              </p>
            </div>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-card rounded-lg border border-border p-6"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-6 mb-8">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">New Order Notifications</h3>
                  <p className="text-sm text-muted-foreground">Recent pending orders that need your attention.</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/notifications">View notifications</Link>
                </Button>
              </div>

              {recentNotifications.length > 0 ? (
                <div className="space-y-3">
                  {recentNotifications.map((order) => (
                    <div key={order._id} className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4">
                      <div>
                        <p className="font-medium text-foreground">New order from {order.shippingAddress.name}</p>
                        <p className="text-sm text-muted-foreground">#{order._id?.slice(-8).toUpperCase()} • {order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                      </div>
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">Pending</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                  No new order notifications right now.
                </div>
              )}
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Admin Shortcuts</h3>
              <p className="text-sm text-muted-foreground mb-4">Quick access to the most common management pages.</p>
              <div className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/orders">Open Orders</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/products">Manage Products</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/settings">Open Settings</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Store Images</h3>
                <p className="text-sm text-muted-foreground">Photos from your storefront and product shots.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {storeFiles.length > 0 ? (
                storeFiles.map((src) => (
                  <div key={src} className="rounded overflow-hidden border border-border bg-muted/20">
                    <img
                      src={src}
                      alt={src.split("/").pop()}
                      className="w-full h-36 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No images found in /public/uploads/store/</div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Place your images in <strong>/public/uploads/store/</strong> with the filenames shown above.</p>
          </div>

          {/* Recent Orders */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
              <Link
                href="/admin/orders"
                className="text-sm text-accent hover:underline flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Customer
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="font-medium text-accent hover:underline"
                          >
                            #{order._id?.slice(-8).toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {order.shippingAddress.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
