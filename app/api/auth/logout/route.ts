import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  
  // Use relative redirect which works on any domain
  const response = NextResponse.redirect("/login", { status: 302 })
  return response
}

export async function GET(request: Request) {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  
  // Use relative redirect which works on any domain
  const response = NextResponse.redirect("/login", { status: 302 })
  return response
}
