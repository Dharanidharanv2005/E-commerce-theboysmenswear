import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getSession } from "@/lib/auth"
import { ProductForm } from "@/components/admin/product-form"

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </nav>

        <h1 className="text-2xl font-bold text-foreground mb-8">Add New Product</h1>

        <ProductForm />
      </div>
    </div>
  )
}
