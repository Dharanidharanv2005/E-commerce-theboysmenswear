import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Package,
  LayoutDashboard,
  ShoppingCart,
  Bell,
  Settings,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import { getAllOrders } from "@/lib/actions/orders"
import { OrderStatusSelect } from "@/components/admin/order-status-select"

export const dynamic = "force-dynamic"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default async function AdminOrdersPage() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/admin/login")
  }

  const orders = await getAllOrders()
  const pendingOrders = orders.filter((o) => o.status === "pending").length

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
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-foreground/10 text-primary-foreground"
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
        <div className="p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Orders</h2>
            <p className="text-muted-foreground">
              Manage customer orders
            </p>
          </div>

          {/* Orders Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {orders.length > 0 ? (
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
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-foreground">
                            #{order._id?.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {order.shippingAddress.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.shippingAddress.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                          Rs. {order.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <OrderStatusSelect
                            orderId={order._id!}
                            currentStatus={order.status}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
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
