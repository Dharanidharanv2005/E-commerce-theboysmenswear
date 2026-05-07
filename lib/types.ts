export interface Product {
  _id?: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  stock: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  productId: string
  product: Product
  quantity: number
  size: string
  color: string
}

export interface Order {
  _id?: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed"
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  _id?: string
  name: string
  slug: string
  image: string
  description?: string
}
