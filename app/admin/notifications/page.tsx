import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Bell,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Clock3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSession } from "@/lib/auth"
import { getAllOrders } from "@/lib/actions/orders"

export const dynamic = "force-dynamic"

export default async function AdminNotificationsPage() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/admin/login")
  }

  const orders = await getAllOrders()
  const pendingOrders = orders.filter((o) => o.status === "pending")
  const recentOrders = orders.slice(0, 8)

  return (
    <div className="min-h-screen flex bg-muted">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-primary text-primary-foreground">
        <div className="p-6">
          <h1 className="font-serif text-xl font-bold">THE BOYS</h1>
          <p className="text-xs uppercase tracking-widest text-primary-foreground/70">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors">
            <Package className="h-5 w-5" />
            Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors">
            <ShoppingCart className="h-5 w-5" />
            Orders
            {pendingOrders.length > 0 && (
              <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">{pendingOrders.length}</span>
            )}
          </Link>
          <Link href="/admin/notifications" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-foreground/10 text-primary-foreground">
            <Bell className="h-5 w-5" />
            Notifications
            {pendingOrders.length > 0 && (
              <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">{pendingOrders.length}</span>
            )}
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-primary-foreground/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold">{session.name.charAt(0)}</div>
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

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
              <p className="text-muted-foreground">New customer orders and recent activity.</p>
            </div>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              {pendingOrders.length} new order{pendingOrders.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">New Orders</h3>
                  <p className="text-sm text-muted-foreground">Orders that are still waiting for processing.</p>
                </div>
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>

              {pendingOrders.length > 0 ? (
                <div className="divide-y divide-border">
                  {pendingOrders.map((order) => (
                    <div key={order._id} className="p-6 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
                          <Badge variant="secondary">New order</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">#{order._id?.slice(-8).toUpperCase()} • {order.items.length} item{order.items.length !== 1 ? "s" : ""} • Rs. {order.total.toLocaleString()}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                        <Clock3 className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No new notifications</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Notification Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                    <span className="text-muted-foreground">Pending orders</span>
                    <span className="font-medium text-foreground">{pendingOrders.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                    <span className="text-muted-foreground">Recent orders shown</span>
                    <span className="font-medium text-foreground">{recentOrders.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                    <span className="text-muted-foreground">Latest activity</span>
                    <span className="font-medium text-foreground">Auto-updated</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Recent Activity</h3>
                <p className="text-sm text-muted-foreground mb-4">The latest orders in the system, including processed ones.</p>
                <div className="space-y-3">
                  {recentOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{order.shippingAddress.name}</p>
                        <p className="text-xs text-muted-foreground">#{order._id?.slice(-8).toUpperCase()}</p>
                      </div>
                      <Badge variant={order.status === "pending" ? "secondary" : "outline"}>{order.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}