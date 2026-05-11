import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url), {
    status: 302,
  })
  response.cookies.delete("session")
  return response
}

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url), {
    status: 302,
  })
  response.cookies.delete("session")
  return response
}
