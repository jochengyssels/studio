'use server'

import { redirect } from "next/navigation"
import { LoginInput, RegisterInput } from "@/lib/schemas/user"

export async function login(formData: FormData) {
  const data = {
    type: "login",
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const response = await fetch("/api/auth", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  redirect("/dashboard")
}

export async function register(formData: FormData) {
  const data = {
    type: "register",
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const response = await fetch("/api/auth", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  redirect("/dashboard")
}

export async function logout() {
  await fetch("/api/auth", {
    method: "DELETE",
  })
  redirect("/login")
} 