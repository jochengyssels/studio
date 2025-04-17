import { RegisterInput, LoginInput, User } from "@/lib/schemas/user"
import { cookies } from "next/headers"

// In a real application, you would use a database
const users: User[] = []

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function generateId(): string {
  return crypto.randomUUID()
}

export async function register(input: RegisterInput) {
  // Check if user already exists
  if (users.some(user => user.email === input.email)) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = await hashPassword(input.password)

  const user: User = {
    id: generateId(),
    ...input,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  users.push(user)
  return user
}

export async function login(input: LoginInput) {
  const hashedPassword = await hashPassword(input.password)

  const user = users.find(
    user => user.email === input.email && user.password === hashedPassword
  )

  if (!user) {
    throw new Error("Invalid credentials")
  }

  return user
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value
    if (!sessionId) return null

    return users.find(user => user.id === sessionId)
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
} 