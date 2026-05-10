import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/products/product-card"
import { getSession } from "@/lib/auth"
import { getCartCount } from "@/lib/actions/cart"
import { getProducts, seedProducts } from "@/lib/actions/products"

export const dynamic = "force-dynamic"

const storeImages = {
  storefront: "/uploads/store/the-boys-storefront.jpeg",
  shirts: "/uploads/store/checked-shirts-display.jpeg",
  interior: "/uploads/store/shop%20image.jpeg",
  closeup: "/uploads/store/plane%20shirt.jpeg",
}

// categories removed — homepage will no longer render category tiles

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on orders above Rs. 999",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure payment gateway",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day hassle-free returns",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer support",
  },
]

export default async function HomePage() {
  // Seed products if database is empty
  //await seedProducts()
  
  const session = await getSession()
  const cartCount = await getCartCount()
  const featuredProducts = []

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartCount={cartCount}
        user={session ? { name: session.name, email: session.email, role: session.role } : null}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-widest text-primary-foreground/70">
                    New Collection 2026
                  </p>
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                    Redefine Your Style with Premium Menswear
                  </h1>
                  <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-lg">
                    Discover modern fits, timeless tailoring, and everyday essentials 
                    crafted for comfort, confidence, and effortless style.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/products">
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative lg:h-[500px]">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl" />
                <div className="relative aspect-square lg:aspect-auto lg:h-full">
                  <Image
                    src={storeImages.storefront}
                    alt="Stylish men's fashion"
                    fill
                    className="object-cover rounded-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category section intentionally removed */}

        {/* Style Feature Section */}
        <section className="py-16 lg:py-24 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src={storeImages.closeup}
                  alt="Premium tailoring details"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  Signature Quality
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                  Crafted for Everyday Confidence
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  From premium fabrics to clean silhouettes, every piece is selected to elevate
                  your wardrobe. Build complete looks for work, weekends, and special occasions.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-accent text-sm font-bold">1</span>
                    </div>
                    <span className="text-foreground">Pick your fit and preferred color</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-accent text-sm font-bold">2</span>
                    </div>
                    <span className="text-foreground">Pair with matching wardrobe essentials</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-accent text-sm font-bold">3</span>
                    </div>
                    <span className="text-foreground">Order confidently with easy returns</span>
                  </li>
                </ul>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/products">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Store Gallery */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
                In-Store Highlights
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A quick look at the storefront and shirt displays now featured across the site.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { src: storeImages.storefront, alt: "The Boys storefront" },
                { src: storeImages.shirts, alt: "Checked shirts display" },
                { src: storeImages.interior, alt: "Shop interior" },
                { src: storeImages.closeup, alt: "Plane shirt close-up" },
              ].map((image) => (
                <div key={image.src} className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border bg-muted">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Featured Products
                </h2>
                <p className="text-muted-foreground">
                  Our most popular styles handpicked for you
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-4">
              Stay in Style
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Subscribe to our newsletter for exclusive offers, new arrivals, and style tips 
              delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
