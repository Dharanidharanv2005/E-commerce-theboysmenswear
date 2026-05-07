"use server"

import { cookies } from "next/headers"
import { getProductById } from "./products"
import { CartItem } from "@/lib/types"

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies()
  const cartCookie = cookieStore.get("cart")?.value
  
  if (!cartCookie) return []
  
  try {
    const cartItems = JSON.parse(cartCookie) as { productId: string; quantity: number; size: string; color: string }[]
    
    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await getProductById(item.productId)
        if (!product) return null
        return {
          ...item,
          product,
        }
      })
    )
    
    return itemsWithProducts.filter((item): item is CartItem => item !== null)
  } catch {
    return []
  }
}

export async function addToCart(
  productId: string,
  quantity: number,
  size: string,
  color: string
): Promise<{ success: boolean; error?: string }> {
  const cookieStore = await cookies()
  const cartCookie = cookieStore.get("cart")?.value
  
  let cart: { productId: string; quantity: number; size: string; color: string }[] = []
  
  if (cartCookie) {
    try {
      cart = JSON.parse(cartCookie)
    } catch {
      cart = []
    }
  }
  
  const existingIndex = cart.findIndex(
    (item) => item.productId === productId && item.size === size && item.color === color
  )
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity
  } else {
    cart.push({ productId, quantity, size, color })
  }
  
  cookieStore.set("cart", JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
  
  return { success: true }
}

export async function updateCartItem(
  productId: string,
  size: string,
  color: string,
  quantity: number
): Promise<{ success: boolean }> {
  const cookieStore = await cookies()
  const cartCookie = cookieStore.get("cart")?.value
  
  if (!cartCookie) return { success: false }
  
  try {
    let cart = JSON.parse(cartCookie) as { productId: string; quantity: number; size: string; color: string }[]
    
    const index = cart.findIndex(
      (item) => item.productId === productId && item.size === size && item.color === color
    )
    
    if (index > -1) {
      if (quantity <= 0) {
        cart = cart.filter((_, i) => i !== index)
      } else {
        cart[index].quantity = quantity
      }
      
      cookieStore.set("cart", JSON.stringify(cart), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
    }
    
    return { success: true }
  } catch {
    return { success: false }
  }
}

export async function removeFromCart(
  productId: string,
  size: string,
  color: string
): Promise<{ success: boolean }> {
  return updateCartItem(productId, size, color, 0)
}

export async function clearCart(): Promise<{ success: boolean }> {
  const cookieStore = await cookies()
  cookieStore.delete("cart")
  return { success: true }
}

export async function getCartCount(): Promise<number> {
  const cart = await getCart()
  return cart.reduce((total, item) => total + item.quantity, 0)
}
