"use server"

import { getDatabase } from "@/lib/mongodb"
import { Product } from "@/lib/types"
import { ObjectId } from "mongodb"
import { revalidateTag } from "next/cache"

export async function getProducts(options?: {
  category?: string
  featured?: boolean
  limit?: number
  search?: string
}): Promise<Product[]> {
  const db = await getDatabase()
  
  const query: Record<string, unknown> = {}
  
  if (options?.category) {
    query.category = options.category
  }
  
  if (options?.featured) {
    query.featured = true
  }
  
  if (options?.search) {
    // Escape special regex characters
    const escapedSearch = options.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    query.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
      { category: { $regex: escapedSearch, $options: "i" } },
    ]
  }

  const products = await db
    .collection("products")
    .find(query)
    .limit(options?.limit || 100)
    .sort({ createdAt: -1 })
    .toArray()

  return products.map((p) => ({
    ...p,
    _id: p._id.toString(),
  })) as Product[]
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDatabase()
  
  try {
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) })
    if (!product) return null
    return {
      ...product,
      _id: product._id.toString(),
    } as Product
  } catch {
    return null
  }
}

export async function createProduct(product: Omit<Product, "_id" | "createdAt" | "updatedAt">): Promise<Product> {
  const db = await getDatabase()
  
  const result = await db.collection("products").insertOne({
    ...product,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  revalidateTag("products", "max")

  return {
    ...product,
    _id: result.insertedId.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<boolean> {
  const db = await getDatabase()
  
  const result = await db.collection("products").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...product, updatedAt: new Date() } }
  )

  revalidateTag("products", "max")

  return result.matchedCount > 0
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDatabase()
  
  const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })

  revalidateTag("products", "max")

  return result.deletedCount > 0
}

export async function getCategories(): Promise<string[]> {
  const db = await getDatabase()
  
  const categories = await db.collection("products").distinct("category")
  return categories as string[]
}

// Seed sample products for demonstration
export async function seedProducts(): Promise<void> {
  const db = await getDatabase()
  
  const count = await db.collection("products").countDocuments()
  if (count > 0) return

  const sampleProducts: Omit<Product, "_id" | "createdAt" | "updatedAt">[] = [
    {
      name: "Classic Oxford Shirt",
      description: "A timeless Oxford shirt crafted from premium cotton. Perfect for both formal and casual occasions. Features a button-down collar and a comfortable regular fit.",
      price: 1499,
      originalPrice: 2499,
      category: "Shirts",
      subcategory: "Formal",
      images: [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800",
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Light Blue", hex: "#ADD8E6" },
        { name: "Navy", hex: "#000080" },
      ],
      stock: 50,
      featured: true,
    },
    {
      name: "Slim Fit Chinos",
      description: "Modern slim fit chinos made from stretchy cotton blend. Features a comfortable mid-rise waist and tapered leg for a contemporary look.",
      price: 1999,
      originalPrice: 2999,
      category: "Trousers",
      subcategory: "Casual",
      images: [
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
      ],
      sizes: ["28", "30", "32", "34", "36", "38"],
      colors: [
        { name: "Khaki", hex: "#C3B091" },
        { name: "Navy", hex: "#000080" },
        { name: "Olive", hex: "#808000" },
      ],
      stock: 35,
      featured: true,
    },
    {
      name: "Premium Wool Blazer",
      description: "Sophisticated wool blend blazer with a modern slim fit. Features notched lapels, two-button closure, and inner pockets. Perfect for business meetings and formal events.",
      price: 5999,
      originalPrice: 8999,
      category: "Blazers",
      subcategory: "Formal",
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
      ],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Charcoal", hex: "#36454F" },
        { name: "Navy", hex: "#000080" },
        { name: "Black", hex: "#000000" },
      ],
      stock: 20,
      featured: true,
    },
    {
      name: "Casual Denim Jacket",
      description: "Classic denim jacket with a modern twist. Made from premium denim with a comfortable regular fit. Features button closure and multiple pockets.",
      price: 2499,
      originalPrice: 3499,
      category: "Jackets",
      subcategory: "Casual",
      images: [
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Classic Blue", hex: "#0E4D92" },
        { name: "Black", hex: "#000000" },
      ],
      stock: 40,
      featured: false,
    },
    {
      name: "Cotton Polo T-Shirt",
      description: "Essential polo shirt made from soft pique cotton. Features a classic collar, two-button placket, and ribbed cuffs. A wardrobe staple for any gentleman.",
      price: 899,
      originalPrice: 1299,
      category: "T-Shirts",
      subcategory: "Casual",
      images: [
        "https://images.unsplash.com/photo-1625910513413-5fc5f001d7d8?w=800",
        "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800",
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Black", hex: "#000000" },
        { name: "Navy", hex: "#000080" },
        { name: "Red", hex: "#DC143C" },
      ],
      stock: 100,
      featured: true,
    },
    {
      name: "Formal Dress Pants",
      description: "Elegant dress pants crafted from fine wool blend. Features a flat front, tailored fit, and belt loops. Perfect for formal occasions and office wear.",
      price: 2299,
      originalPrice: 3299,
      category: "Trousers",
      subcategory: "Formal",
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
      ],
      sizes: ["28", "30", "32", "34", "36", "38", "40"],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Charcoal", hex: "#36454F" },
        { name: "Navy", hex: "#000080" },
      ],
      stock: 45,
      featured: false,
    },
    {
      name: "Graphic Print Hoodie",
      description: "Comfortable cotton blend hoodie with a stylish graphic print. Features a kangaroo pocket, drawstring hood, and ribbed cuffs. Perfect for casual outings.",
      price: 1799,
      originalPrice: 2499,
      category: "Hoodies",
      subcategory: "Casual",
      images: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
        "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800",
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "Grey", hex: "#808080" },
        { name: "Navy", hex: "#000080" },
      ],
      stock: 60,
      featured: false,
    },
    {
      name: "Linen Summer Shirt",
      description: "Breathable linen shirt perfect for summer. Features a relaxed fit, mandarin collar, and roll-up sleeves. Stay cool and stylish in warm weather.",
      price: 1699,
      originalPrice: 2299,
      category: "Shirts",
      subcategory: "Casual",
      images: [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800",
      ],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Beige", hex: "#F5F5DC" },
        { name: "Sky Blue", hex: "#87CEEB" },
      ],
      stock: 30,
      featured: true,
    },
  ]

  await db.collection("products").insertMany(
    sampleProducts.map((p) => ({
      ...p,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  )
}
