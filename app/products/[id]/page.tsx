import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/products/product-card"
import { AddToCartForm } from "@/components/products/add-to-cart-form"
import { Badge } from "@/components/ui/badge"
import { getSession } from "@/lib/auth"
import { getCartCount } from "@/lib/actions/cart"
import { getProductById, getProducts } from "@/lib/actions/products"

export const dynamic = "force-dynamic"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const [session, cartCount, product] = await Promise.all([
    getSession(),
    getCartCount(),
    getProductById(id),
  ])

  if (!product) {
    notFound()
  }

  const relatedProducts = await getProducts({
    category: product.category,
    limit: 4,
  })

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

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
              Back to Products
            </Link>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Product Images Gallery */}
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                
                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-foreground">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                      <Badge variant="destructive" className="text-sm">
                        {discount}% OFF
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-medium text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Add to Cart Form */}
              <AddToCartForm product={product} />

              {/* Product Details */}
              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span className={product.stock > 0 ? "text-green-600" : "text-destructive"}>
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Link 
                    href={`/products?category=${product.category}`}
                    className="text-foreground hover:text-accent transition-colors"
                  >
                    {product.category}
                  </Link>
                </div>
                {product.subcategory && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="text-foreground">{product.subcategory}</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                    <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                  <span className="text-sm text-foreground">Free shipping on orders above Rs. 999</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                    <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16v16H4z"/>
                      <path d="M9 9l6 6M15 9l-6 6"/>
                    </svg>
                  </div>
                  <span className="text-sm text-foreground">7-day easy returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                    <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <span className="text-sm text-foreground">100% authentic products</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 1 && (
            <section className="mt-16 pt-16 border-t border-border">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts
                  .filter((p) => p._id !== product._id)
                  .slice(0, 4)
                  .map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
