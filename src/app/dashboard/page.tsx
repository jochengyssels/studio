"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar, MapPin, User, Camera, Utensils, Plane } from "lucide-react"
import Link from "next/link"
import { ProfileMenu } from "@/components/profile-menu"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if running in browser
    if (typeof window !== 'undefined') {
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem("isLoggedIn")
      if (!isLoggedIn) {
        router.push("/login")
      } else {
        setIsLoading(false)
      }
    }
  }, [router])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("isLoggedIn")
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('loginStateChange', { 
        detail: { isLoggedIn: false } 
      }))
      router.push("/")
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-400 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/sardinia-golden-sunset.jpg"
          alt="Sardinia background"
          fill
          priority
          className="object-cover brightness-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/">
            <h1 className="text-2xl font-bold">
              Sardin<span className="text-teal-400">.ai</span>
            </h1>
          </Link>
          <ProfileMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 py-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-8 text-3xl font-bold">Welcome to Your Dashboard</h2>
            
            {/* Upcoming Trip */}
            <section className="mb-12">
              <h3 className="mb-4 text-xl font-medium">Your Upcoming Trip</h3>
              <div className="rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-md">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-teal-400">Sardinia Adventure</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-white/70" />
                      <span className="text-sm text-white/70">June 15 - June 22, 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-white/70" />
                      <span className="text-sm text-white/70">Cagliari, Sardinia</span>
                    </div>
                  </div>
                  <Button className="rounded-full bg-teal-400 text-black hover:bg-teal-500">
                    View Itinerary
                  </Button>
                </div>
              </div>
            </section>

            {/* Past Trips */}
            <section className="mb-12">
              <h3 className="mb-4 text-xl font-medium">Recommended Experiences</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Sunset Boat Tour",
                    location: "Gulf of Orosei",
                    icon: <Camera className="h-6 w-6" />,
                  },
                  {
                    title: "Wine Tasting",
                    location: "Cannonau Vineyards",
                    icon: <Utensils className="h-6 w-6" />,
                  },
                  {
                    title: "Beach Day",
                    location: "La Pelosa",
                    icon: <Plane className="h-6 w-6" />,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-md"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-400/20 text-teal-400">
                      {item.icon}
                    </div>
                    <h4 className="text-lg font-medium">{item.title}</h4>
                    <p className="text-sm text-white/70">{item.location}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Account Settings */}
            <section>
              <h3 className="mb-4 text-xl font-medium">Account Settings</h3>
              <div className="rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-md">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">Demo User</h4>
                    <p className="text-sm text-white/70">demo@example.com</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 py-4 text-center text-sm text-white/60 backdrop-blur-md">
        © {new Date().getFullYear()} Sardin.ai — Your personal Sardinian travel assistant
      </footer>
    </div>
  )
} 