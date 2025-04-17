"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // For demo purposes, we'll use hardcoded credentials
      if (email === "demo@example.com" && password === "password123") {
        // Store the login state in localStorage
        localStorage.setItem("isLoggedIn", "true")
        
        // Dispatch custom event to notify other components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('loginStateChange', { 
            detail: { isLoggedIn: true } 
          }))
        }
        
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-transparent to-black">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url(/sardinia-golden-sunset.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>
      
      <div className="w-full max-w-md space-y-8 rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-md relative z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome to Sardin.ai</h1>
          <p className="mt-2 text-white/70">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-12 w-full rounded-full border-white/20 bg-white/10 text-white placeholder:text-white/50"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 h-12 w-full rounded-full border-white/20 bg-white/10 text-white placeholder:text-white/50"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-center text-sm text-red-400">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-full bg-teal-400 text-black hover:bg-teal-500"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="flex items-center justify-between">
            <div className="text-center text-sm text-white/70">
              <Link href="/" className="text-teal-400 hover:text-teal-500">
                Back to Home
              </Link>
            </div>
            <div className="text-center text-sm text-white/70">
              Demo: demo@example.com / password123
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 