import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="relative z-10 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">WindRider</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/spots" className="text-blue-100 hover:text-white transition-colors">
              Spots
            </Link>
            <Link href="/forecast" className="text-blue-100 hover:text-white transition-colors">
              Forecast
            </Link>
            <Link href="/community" className="text-blue-100 hover:text-white transition-colors">
              Community
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-blue-100 hover:text-white">
              Sign In
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 