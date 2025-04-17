import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search for your favorite kite spots..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-12 py-6 text-lg bg-white/90 backdrop-blur-sm border-2 border-blue-200/20 rounded-full shadow-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
        <Button
          type="submit"
          className="absolute right-2 rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
        >
          <Search className="h-5 w-5 text-white" />
        </Button>
      </div>
    </form>
  )
} 