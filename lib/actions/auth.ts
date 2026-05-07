"use server"

import { createSession, createUser, deleteSession, getUserByEmail, verifyPassword } from "@/lib/auth"
import { redirect } from "next/navigation"

export interface AuthResult {
  success: boolean
  error?: string
}

export async function registerUser(formData: FormData): Promise<AuthResult> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!name || !email || !password) {
    return { success: false, error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return { success: false, error: "Email already registered" }
  }

  try {
    const user = await createUser({
      name,
      email,
      password,
      role: "user",
    })

    await createSession(user)
    return { success: true }
  } catch {
    return { success: false, error: "Failed to create account" }
  }
}

export async function loginUser(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  const user = await getUserByEmail(email)
  if (!user || !user.password) {
    return { success: false, error: "Invalid email or password" }
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return { success: false, error: "Invalid email or password" }
  }

  try {
    await createSession(user)
    return { success: true }
  } catch {
    return { success: false, error: "Failed to create session" }
  }
}

export async function logoutUser(): Promise<void> {
  await deleteSession()
  redirect("/")
}

export async function registerAdmin(formData: FormData): Promise<AuthResult> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const adminCode = formData.get("adminCode") as string

  // Simple admin code verification (in production, use a more secure method)
  const expectedCode = process.env.ADMIN_CODE || "ADMIN2024"
  if (adminCode !== expectedCode) {
    return { success: false, error: "Invalid admin code" }
  }

  if (!name || !email || !password) {
    return { success: false, error: "All fields are required" }
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return { success: false, error: "Email already registered" }
  }

  try {
    const user = await createUser({
      name,
      email,
      password,
      role: "admin",
    })

    await createSession(user)
    return { success: true }
  } catch {
    return { success: false, error: "Failed to create admin account" }
  }
}
