import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { login as loginService, register as registerService } from "@/services/auth"
import { LoginInput, RegisterInput } from "@/lib/schemas/user"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // For demo purposes, we'll use a hardcoded email/password
    if (email === "demo@example.com" && password === "password123") {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("session")
  return response
} 