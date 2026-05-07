import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Package,
  Plus,
  Edit,
  Trash2,
  LayoutDashboard,
  ShoppingCart,
  Bell,
  Settings,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSession } from "@/lib/auth"
import { getProducts } from "@/lib/actions/products"
import { getAllOrders } from "@/lib/actions/orders"
import { DeleteProductButton } from "@/components/admin/delete-product-button"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/admin/login")
  }

  const [products, orders] = await Promise.all([getProducts(), getAllOrders()])
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-foreground/10 text-primary-foreground"
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Products</h2>
              <p className="text-muted-foreground">
                Manage your product catalog
              </p>
            </div>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>

          {/* Products Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="max-w-xs">
                              <p className="font-medium text-foreground truncate">
                                {product.name}
                              </p>
                              {product.featured && (
                                <Badge variant="secondary" className="mt-1">
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Rs. {product.price.toLocaleString()}
                            </p>
                            {product.originalPrice && (
                              <p className="text-xs text-muted-foreground line-through">
                                Rs. {product.originalPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${
                              product.stock > 10
                                ? "text-green-600"
                                : product.stock > 0
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/admin/products/${product._id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <DeleteProductButton productId={product._id!} productName={product.name} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No products yet</p>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/admin/products/new">Add Your First Product</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
