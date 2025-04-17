"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if running in browser
    if (typeof window !== 'undefined') {
      // Check if user is logged in
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)
      
      // Set up event listener for login state changes
      const handleStorageChange = () => {
        const currentLoginState = localStorage.getItem("isLoggedIn") === "true"
        setIsLoggedIn(currentLoginState)
      }
      
      window.addEventListener('storage', handleStorageChange)
      
      // Custom event for same-window communication
      const handleCustomEvent = (e: CustomEvent) => {
        setIsLoggedIn(e.detail.isLoggedIn)
      }
      
      window.addEventListener('loginStateChange', handleCustomEvent as EventListener)
      
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('loginStateChange', handleCustomEvent as EventListener)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    setIsLoggedIn(false)
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('loginStateChange', { 
      detail: { isLoggedIn: false } 
    }))
    
    router.push("/")
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full border border-white/20 bg-white/10 p-0 text-white hover:bg-white/20 hover:text-white"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white/10 border-white/20 text-white backdrop-blur-md">
        {isLoggedIn ? (
          <>
            <DropdownMenuItem 
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer hover:bg-white/20 focus:bg-white/20"
            >
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer hover:bg-white/20 focus:bg-white/20"
            >
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem 
              onClick={() => router.push("/login")}
              className="cursor-pointer hover:bg-white/20 focus:bg-white/20"
            >
              Sign In
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => router.push("/register")}
              className="cursor-pointer hover:bg-white/20 focus:bg-white/20"
            >
              Create Account
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 