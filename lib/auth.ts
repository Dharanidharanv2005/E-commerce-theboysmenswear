import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { getDatabase } from "./mongodb"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

export interface User {
  _id?: string
  name: string
  email: string
  password?: string
  role: "user" | "admin"
  createdAt: Date
  address?: string
  phone?: string
}

export interface SessionPayload {
  userId: string
  email: string
  name: string
  role: "user" | "admin"
  expiresAt: Date
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createSession(user: User): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const token = await new SignJWT({
    userId: user._id?.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return token
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function getUserById(userId: string): Promise<User | null> {
  const db = await getDatabase()
  const { ObjectId } = await import("mongodb")
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
  if (!user) return null
  return {
    ...user,
    _id: user._id.toString(),
    password: undefined,
  } as User
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase()
  const user = await db.collection("users").findOne({ email: email.toLowerCase() })
  if (!user) return null
  return {
    ...user,
    _id: user._id.toString(),
  } as User
}

export async function createUser(userData: Omit<User, "_id" | "createdAt">): Promise<User> {
  const db = await getDatabase()
  const hashedPassword = await hashPassword(userData.password!)
  
  const result = await db.collection("users").insertOne({
    ...userData,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    createdAt: new Date(),
  })

  return {
    ...userData,
    _id: result.insertedId.toString(),
    password: undefined,
    createdAt: new Date(),
  }
}
