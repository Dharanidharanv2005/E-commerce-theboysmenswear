import { redirect } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  Store,
  UserCog,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSession } from "@/lib/auth"
import { getAllOrders } from "@/lib/actions/orders"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/admin/login")
  }

  const orders = await getAllOrders()
  const pendingOrders = orders.filter((order) => order.status === "pending").length

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
            {pendingOrders > 0 && (
              <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">{pendingOrders}</span>
            )}
          </Link>
          <Link href="/admin/notifications" className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors">
            <Bell className="h-5 w-5" />
            Notifications
            {pendingOrders > 0 && (
              <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">{pendingOrders}</span>
            )}
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-foreground/10 text-primary-foreground">
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
              <h2 className="text-2xl font-bold text-foreground">Settings</h2>
              <p className="text-muted-foreground">Admin account and store controls.</p>
            </div>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              {pendingOrders > 0 ? `${pendingOrders} pending order${pendingOrders !== 1 ? "s" : ""}` : "All caught up"}
            </Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="bg-card rounded-lg border border-border p-6">
              <UserCog className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Admin profile</h3>
              <p className="text-sm text-muted-foreground mb-4">Signed in as {session.name} ({session.email}).</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/notifications">Check notifications</Link>
              </Button>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <Store className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Store management</h3>
              <p className="text-sm text-muted-foreground mb-4">Manage products, orders, and storefront content from the admin panel.</p>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/products">Products</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/orders">Orders</Link>
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <ShieldCheck className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Notifications</h3>
              <p className="text-sm text-muted-foreground mb-4">New customer orders appear in the notifications page as soon as they are placed.</p>
              <div className="rounded-md bg-muted px-3 py-2 text-sm text-foreground">
                Pending order alerts: {pendingOrders}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}