import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package, Truck, MapPin, Phone, Calendar } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getSession } from "@/lib/auth"
import { getCartCount } from "@/lib/actions/cart"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

interface OrderPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = await params
  const [session, cartCount] = await Promise.all([
    getSession(),
    getCartCount(),
  ])

  if (!session) {
    redirect("/login?redirect=/dashboard/orders")
  }

  try {
    const database = await getDatabase()
    const ordersCollection = database.collection("orders")

    // Fetch the order
    const order = await ordersCollection.findOne({
      _id: new ObjectId(id),
      userId: session.id,
    })

    if (!order) {
      redirect("/dashboard/orders")
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Header
          cartCount={cartCount}
          user={{ name: session.name, email: session.email, role: session.role }}
        />

        <main className="flex-1 bg-muted">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link
                href="/dashboard/orders"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </nav>

            {/* Order Header */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                    Order #{order._id?.toString().slice(-8).toUpperCase()}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Badge className={`${statusColors[order.status]} text-lg px-4 py-2`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-accent" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index}>
                    <div className="flex gap-4">
                      {item.product.image && (
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-foreground">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {index < order.items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-accent" />
                Shipping Address
              </h2>
              <div className="space-y-2 text-foreground">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-sm">{order.shippingAddress.address}</p>
                <p className="text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.pincode}
                </p>
                <div className="flex items-center gap-2 text-sm pt-2">
                  <Phone className="h-4 w-4" />
                  {order.shippingAddress.phone}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>Rs. {(order.subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? "FREE" : `Rs. ${order.shipping}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg text-foreground">
                  <span>Total</span>
                  <span>Rs. {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8">
              <Link href="/dashboard/orders">
                <Button className="w-full" variant="outline">
                  Back to My Orders
                </Button>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  } catch (error) {
    redirect("/dashboard/orders")
  }
}
