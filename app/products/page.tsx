import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/products/product-card"
import { getSession } from "@/lib/auth"
import { getCartCount } from "@/lib/actions/cart"
import { getProducts, getCategories } from "@/lib/actions/products"
import { ProductFilters } from "@/components/products/product-filters"

export const dynamic = "force-dynamic"

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const [session, cartCount, products, categories] = await Promise.all([
    getSession(),
    getCartCount(),
    getProducts({ category: params.category, search: params.search }),
    getCategories(),
  ])

  // Apply client-side filtering for price and sorting
  let filteredProducts = [...products]

  if (params.minPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= parseInt(params.minPrice!, 10)
    )
  }

  if (params.maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= parseInt(params.maxPrice!, 10)
    )
  }

  if (params.sort) {
    switch (params.sort) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "name":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "new":
      default:
        // Already sorted by newest
        break
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartCount={cartCount}
        user={session ? { name: session.name, email: session.email, role: session.role } : null}
      />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-muted py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {params.category || "All Products"}
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              {params.search && ` for "${params.search}"`}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block">
              <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
                <ProductFilters 
                  categories={categories} 
                  currentCategory={params.category}
                  currentSort={params.sort}
                  currentSearch={params.search}
                />
              </Suspense>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Mobile Filters */}
              <div className="lg:hidden mb-6">
                <Suspense fallback={<div className="animate-pulse bg-muted h-12 rounded-lg" />}>
                  <ProductFilters 
                    categories={categories} 
                    currentCategory={params.category}
                    currentSort={params.sort}
                    currentSearch={params.search}
                    mobile
                  />
                </Suspense>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl font-medium text-foreground mb-2">
                    No products found
                  </p>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
