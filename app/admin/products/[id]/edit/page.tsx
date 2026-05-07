import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import { getProductById } from "@/lib/actions/products"
import { ProductForm } from "@/components/admin/product-form"

export const dynamic = "force-dynamic"

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/admin/login")
  }

  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <Button asChild variant="ghost" className="px-0 hover:bg-transparent">
            <Link href="/admin/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
          <p className="text-muted-foreground">Update product details and save your changes.</p>
        </div>

        <ProductForm product={product} />
      </div>
    </div>
  )
}