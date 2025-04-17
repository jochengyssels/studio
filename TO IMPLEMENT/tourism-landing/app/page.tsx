"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Users, Compass } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")

  const personas = [
    {
      id: "adventurer",
      name: "The Adventurer",
      description: "Hiking, diving, and outdoor activities",
      icon: <Compass className="h-5 w-5" />,
    },
    {
      id: "culture",
      name: "The Culture Seeker",
      description: "History, traditions, and local experiences",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "relaxation",
      name: "The Relaxation Lover",
      description: "Beaches, spas, and peaceful retreats",
      icon: <User className="h-5 w-5" />,
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - would connect to AI backend
    console.log("Selected persona:", selectedPersona)
    console.log("Query:", inputValue)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/sardinia-golden-sunset.jpg"
          alt="Magical Sardinia sunset"
          fill
          priority
          className="object-cover brightness-[0.65]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-4 text-center">
        {/* Logo */}
        <div className="mb-6 flex items-center">
          <h1 className="text-4xl font-bold text-white">
            Sardin<span className="text-teal-400">.ai</span>
          </h1>
        </div>

        {/* Main Heading */}
        <div className="mb-12 max-w-2xl space-y-4">
          <h2 className="text-3xl font-medium text-white md:text-4xl">Finally... you made it.</h2>
          <p className="text-xl text-white/90 md:text-2xl">
            For now it's Sardin.ai but soon you'll arrive in Sardinia.
            <br />
            Let me help you.
          </p>
        </div>

        {/* Persona Selection */}
        <div className="mb-8 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => setSelectedPersona(persona.id)}
              className={`flex flex-col items-center rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md transition-all hover:bg-white/20 ${
                selectedPersona === persona.id ? "border-teal-400 bg-white/20 ring-2 ring-teal-400/50" : ""
              }`}
            >
              <div
                className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
                  selectedPersona === persona.id ? "bg-teal-400 text-black" : "bg-white/20 text-white"
                }`}
              >
                {persona.icon}
              </div>
              <h3 className="text-lg font-medium text-white">{persona.name}</h3>
              <p className="mt-1 text-sm text-white/70">{persona.description}</p>
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="w-full max-w-3xl">
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tell me your Sardinian dream holidays and I'll get to work"
              className="h-14 rounded-full border-white/20 bg-white/10 pl-6 pr-14 text-white placeholder:text-white/50 focus-visible:ring-teal-400 backdrop-blur-md"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-2 h-10 w-10 rounded-full bg-teal-400 text-black hover:bg-teal-500"
              disabled={!inputValue.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>

        {/* Suggestions */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            className="rounded-full border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
            onClick={() => setInputValue("I want to explore hidden beaches in Sardinia")}
          >
            Hidden beaches
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
            onClick={() => setInputValue("Plan a 7-day family trip to Sardinia")}
          >
            Family trip
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
            onClick={() => setInputValue("Best local food experiences in Sardinia")}
          >
            Food experiences
          </Button>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-sm text-white/60">
          © {new Date().getFullYear()} Sardin.ai — Your personal Sardinian travel assistant
        </footer>
      </div>
    </div>
  )
}
