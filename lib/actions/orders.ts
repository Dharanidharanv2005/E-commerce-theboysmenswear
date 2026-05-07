"use server"

import { getDatabase } from "@/lib/mongodb"
import { Order } from "@/lib/types"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"
import { getCart, clearCart } from "./cart"

export async function createOrder(shippingAddress: Order["shippingAddress"]): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const session = await getSession()
  
  if (!session) {
    return { success: false, error: "Please login to place an order" }
  }
  
  const cart = await getCart()
  
  if (cart.length === 0) {
    return { success: false, error: "Your cart is empty" }
  }
  
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  
  const db = await getDatabase()
  
  const order: Omit<Order, "_id"> = {
    userId: session.userId,
    items: cart,
    total,
    status: "pending",
    shippingAddress,
    paymentMethod: "cod",
    paymentStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  const result = await db.collection("orders").insertOne(order)
  
  await clearCart()
  
  return { success: true, orderId: result.insertedId.toString() }
}

export async function getOrders(): Promise<Order[]> {
  const session = await getSession()
  
  if (!session) return []
  
  const db = await getDatabase()
  
  const orders = await db
    .collection("orders")
    .find({ userId: session.userId })
    .sort({ createdAt: -1 })
    .toArray()
  
  return orders.map((o) => ({
    ...o,
    _id: o._id.toString(),
  })) as Order[]
}

export async function getAllOrders(): Promise<Order[]> {
  const session = await getSession()
  
  if (!session || session.role !== "admin") return []
  
  const db = await getDatabase()
  
  const orders = await db
    .collection("orders")
    .find({})
    .sort({ createdAt: -1 })
    .toArray()
  
  return orders.map((o) => ({
    ...o,
    _id: o._id.toString(),
  })) as Order[]
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<{ success: boolean }> {
  const session = await getSession()
  
  if (!session || session.role !== "admin") {
    return { success: false }
  }
  
  const db = await getDatabase()
  
  await db.collection("orders").updateOne(
    { _id: new ObjectId(orderId) },
    { $set: { status, updatedAt: new Date() } }
  )
  
  return { success: true }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const session = await getSession()
  
  if (!session) return null
  
  const db = await getDatabase()
  
  const order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) })
  
  if (!order) return null
  
  // Only allow users to see their own orders, unless admin
  if (order.userId !== session.userId && session.role !== "admin") {
    return null
  }
  
  return {
    ...order,
    _id: order._id.toString(),
  } as Order
}
