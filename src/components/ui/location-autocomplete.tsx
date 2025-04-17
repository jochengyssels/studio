"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { MapPin, Loader2, AlertTriangle } from "lucide-react"
import Script from "next/script"

declare global {
  interface Window {
    google: any
  }
}

interface LocationAutocompleteProps {
  value: string
  onChange: (location: string) => void
  placeholder?: string
  className?: string
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Search for a location",
  className
}: LocationAutocompleteProps) {
  // Get the API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  
  const [inputValue, setInputValue] = useState(value || "")
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoadingAPI, setIsLoadingAPI] = useState(true)
  const [apiError, setApiError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)

  // Common cities in Sardinia for the simplified version if API fails
  const sardiniaCities = [
    "Cagliari, Sardinia, Italy",
    "Alghero, Sardinia, Italy",
    "Olbia, Sardinia, Italy",
    "Sassari, Sardinia, Italy",
    "Nuoro, Sardinia, Italy",
    "Oristano, Sardinia, Italy",
    "Carbonia, Sardinia, Italy",
    "Iglesias, Sardinia, Italy",
    "Porto Cervo, Sardinia, Italy",
    "Costa Smeralda, Sardinia, Italy",
    "La Maddalena, Sardinia, Italy",
    "San Teodoro, Sardinia, Italy",
    "Villasimius, Sardinia, Italy",
    "Bosa, Sardinia, Italy",
    "Castelsardo, Sardinia, Italy",
  ]

  // Filter cities based on input for the simplified version
  const filteredCities = sardiniaCities.filter(city =>
    city.toLowerCase().includes(inputValue.toLowerCase())
  )

  // Skip API loading if the key is not provided
  useEffect(() => {
    if (!apiKey) {
      console.log("No Google Maps API key provided, using fallback mode")
      setApiError(true)
      setIsLoadingAPI(false)
    }
  }, [apiKey])

  // Initialize the Google Places autocomplete when the script is loaded
  useEffect(() => {
    if (!isLoaded || !inputRef.current || apiError) return

    try {
      const options = {
        componentRestrictions: { country: "it" },
        types: ["(cities)"],
        fields: ["name", "formatted_address", "geometry"],
      }

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      )

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace()
        if (place && place.formatted_address) {
          setInputValue(place.formatted_address)
          onChange(place.formatted_address)
          console.log("Selected place:", place)
        }
      })

      setIsLoadingAPI(false)
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error)
      setApiError(true)
      setIsLoadingAPI(false)
    }

    return () => {
      if (autocompleteRef.current && !apiError) {
        try {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
        } catch (error) {
          console.error("Error cleaning up Google Maps event listeners:", error)
        }
      }
    }
  }, [isLoaded, onChange, apiError])

  // Handle script loading error
  const handleScriptError = () => {
    console.error("Failed to load Google Maps API script")
    setApiError(true)
    setIsLoadingAPI(false)
  }

  return (
    <div className="relative w-full">
      {!apiError && apiKey && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
          onLoad={() => setIsLoaded(true)}
          onError={handleScriptError}
          strategy="lazyOnload"
        />
      )}
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-12 w-full rounded-full border-white/20 bg-white/10 pl-10 pr-4 text-white placeholder:text-white/50 focus-visible:ring-teal-400 backdrop-blur-md",
          className
        )}
        list={apiError ? "sardinia-cities" : undefined}
        onBlur={() => {
          if (apiError && inputValue) {
            // For simplified mode, update on blur if a city is typed
            onChange(inputValue)
          }
        }}
      />
      
      {/* Datalist for fallback mode */}
      {apiError && (
        <datalist id="sardinia-cities">
          {filteredCities.map((city, index) => (
            <option key={index} value={city} />
          ))}
        </datalist>
      )}
      
      <div className="absolute left-3 top-3 text-white/70">
        {isLoadingAPI && !apiError ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : apiError ? (
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        ) : (
          <MapPin className="h-5 w-5" />
        )}
      </div>
    </div>
  )
} 