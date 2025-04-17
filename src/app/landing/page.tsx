"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Users, Compass, ChevronDown, Sparkles, Calendar, MapPin, Plane, CloudSun, Wand2, Map, Clock, Star, MessageCircle, Play, Euro, Utensils, Car, Landmark, Languages, X, Accessibility, ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Script from "next/script"
import { ChatInterface } from "@/components/chat/chat-interface"

type FormField = {
  name: string;
  label: string;
  icon: React.ReactNode;
} & (
  | {
      type: "select";
      options: string[];
      placeholder?: never;
      description?: never;
    }
  | {
      type: "multi-select";
      options: string[];
      placeholder?: never;
      description?: never;
    }
  | {
      type: "toggle";
      description: string;
      options?: never;
      placeholder?: never;
    }
  | {
      type: "text" | "datetime-local";
      placeholder: string;
      options?: never;
      description?: never;
    }
)

type Step = {
  title: string;
} & (
  | {
      type: "free-input";
      placeholder: string;
      options?: never;
      fields?: never;
    }
  | {
      type: "persona";
      options: {
        id: string;
        name: string;
        description: string;
        icon: React.ReactNode;
      }[];
      placeholder?: never;
      fields?: never;
    }
  | {
      type: "form";
      fields: FormField[];
      options?: never;
      placeholder?: never;
    }
)

export default function LandingPage() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDemo, setShowDemo] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Core Travel Details
    dates: {
      arrival: "",
      departure: ""
    },
    location: "",
    transportMode: "",
    
    // Traveler Profile
    groupType: "",
    interests: [] as string[],
    pace: "",
    
    // Budget & Practicalities
    dailyBudget: "",
    dietaryNeeds: "",
    mobility: "",
    
    // Sardinian Nuances
    culturalDepth: false,
    crowdAvoidance: false,
    language: false,
    
    // Experience Customization
    mustSees: "",
    avoids: "",
    specialRequests: "",
    
    // Digital Nomad Add-Ons
    workNeeds: "",
    kitesurfing: false
  })

  const steps: Step[] = [
    {
      title: "Tell us about your dream holiday",
      type: "free-input",
      placeholder: "I want to explore hidden beaches and enjoy local cuisine..."
    },
    {
      title: "Choose your travel style",
      type: "persona",
      options: [
        {
          id: "adventurer",
          name: "The Adventurer",
          description: "Hiking, diving, and outdoor activities",
          icon: <Compass className="h-5 w-5" />
        },
        {
          id: "culture",
          name: "The Culture Seeker",
          description: "History, traditions, and local experiences",
          icon: <Users className="h-5 w-5" />
        },
        {
          id: "relaxation",
          name: "The Relaxation Lover",
          description: "Beaches, spas, and peaceful retreats",
          icon: <User className="h-5 w-5" />
        }
      ]
    },
    {
      title: "Core Travel Details",
      type: "form",
      fields: [
        {
          name: "arrival",
          label: "When do you arrive?",
          type: "datetime-local",
          placeholder: "Include flight/train times if known",
          icon: <Calendar className="h-4 w-4" />
        },
        {
          name: "departure",
          label: "When do you depart?",
          type: "datetime-local",
          placeholder: "Include flight/train times if known",
          icon: <Calendar className="h-4 w-4" />
        },
        {
          name: "location",
          label: "Which town are you staying in?",
          type: "text",
          placeholder: "e.g., Alghero, Cagliari, Olbia",
          icon: <MapPin className="h-4 w-4" />
        },
        {
          name: "transportMode",
          label: "Transport Mode",
          type: "select",
          options: ["Car", "Public Transport"],
          icon: <Car className="h-4 w-4" />
        }
      ]
    },
    {
      title: "Traveler Profile",
      type: "form",
      fields: [
        {
          name: "groupType",
          label: "Group Type",
          type: "select",
          options: ["Solo", "Couple", "Family", "Group of Friends"],
          icon: <Users className="h-4 w-4" />
        },
        {
          name: "interests",
          label: "Interests",
          type: "multi-select",
          options: ["Beaches", "Hiking", "Archaeology", "Food/Wine", "Nightlife", "Kitesurfing", "Local Culture"],
          icon: <Star className="h-4 w-4" />
        },
        {
          name: "pace",
          label: "Preferred Pace",
          type: "select",
          options: ["Relaxed", "Balanced", "Packed"],
          icon: <Clock className="h-4 w-4" />
        }
      ]
    },
    {
      title: "Budget & Practicalities",
      type: "form",
      fields: [
        {
          name: "dailyBudget",
          label: "Daily Budget",
          type: "select",
          options: ["€50", "€100", "€200+"],
          icon: <Euro className="h-4 w-4" />
        },
        {
          name: "dietaryNeeds",
          label: "Dietary Needs",
          type: "text",
          placeholder: "e.g., Gluten-free, vegan, etc.",
          icon: <Utensils className="h-4 w-4" />
        },
        {
          name: "mobility",
          label: "Accessibility Needs",
          type: "text",
          placeholder: "e.g., wheelchair-friendly routes",
          icon: <Accessibility className="h-4 w-4" />
        }
      ]
    },
    {
      title: "Sardinian Nuances",
      type: "form",
      fields: [
        {
          name: "culturalDepth",
          label: "Experience authentic Sardinian traditions?",
          type: "toggle",
          description: "e.g., shepherd's lunch, cantu a tenore concerts",
          icon: <Landmark className="h-4 w-4" />
        },
        {
          name: "crowdAvoidance",
          label: "Prefer hidden gems?",
          type: "toggle",
          description: "Or don't mind tourist hotspots?",
          icon: <Map className="h-4 w-4" />
        },
        {
          name: "language",
          label: "Learn Sardinian phrases?",
          type: "toggle",
          description: "Get local language tips during your trip",
          icon: <Languages className="h-4 w-4" />
        }
      ]
    },
    {
      title: "Experience Customization",
      type: "form",
      fields: [
        {
          name: "mustSees",
          label: "Must-See Places",
          type: "text",
          placeholder: "e.g., Su Nuraxi, La Pelosa beach",
          icon: <Star className="h-4 w-4" />
        },
        {
          name: "avoids",
          label: "Places to Avoid",
          type: "text",
          placeholder: "e.g., wineries, crowded areas",
          icon: <X className="h-4 w-4" />
        },
        {
          name: "specialRequests",
          label: "Special Requests",
          type: "text",
          placeholder: "e.g., sunrise hikes, cooking classes",
          icon: <Sparkles className="h-4 w-4" />
        }
      ]
    }
  ]

  const handleNext = () => {
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const formatPrompt = () => {
    const { dates, location, interests, crowdAvoidance, language, specialRequests } = formData
    
    return `Generate a ${getDuration(dates)}-day Sardinian itinerary for a ${formData.groupType.toLowerCase()} staying in ${location}.
Prioritize: ${interests.join(', ')}.
Avoid crowded spots: ${crowdAvoidance}.
Include: ${language ? 'Sardinian dialect phrases for greetings' : 'No language learning required'}.
Special request: ${specialRequests}.
Detail transportation between activities (max 30min drives).
Format: Morning/Afternoon/Evening with time estimates.`
  }

  const getDuration = (dates: { arrival: string; departure: string }) => {
    if (!dates.arrival || !dates.departure) return 7 // Default to 7 days
    const arrival = new Date(dates.arrival)
    const departure = new Date(dates.departure)
    const diffTime = Math.abs(departure.getTime() - arrival.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === 0 && !inputValue.trim()) {
      setError("Please tell us about your dream holiday")
      return
    }
    
    setError(null)
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (currentStep === steps.length - 1) {
        // On final step, format the prompt and send to GPT
        const prompt = formatPrompt()
        console.log("Generated prompt:", prompt)
        // TODO: Send to GPT API
      } else {
        handleNext()
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the date input handling
  const handleDateChange = (field: 'arrival' | 'departure', value: string) => {
    setFormData(prev => ({
      ...prev,
      dates: {
        ...prev.dates,
        [field]: value
      }
    }))
  }

  const renderStep = () => {
    const step = steps[currentStep]
    
    if (!step) return null
    
    if (step.type === "free-input") {
      return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-[600px]">
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setError(null)
            }}
            placeholder={step.placeholder}
            className="h-14 w-full rounded-full border-white/20 bg-white/10 pl-6 pr-14 text-white placeholder:text-white/50 focus-visible:ring-teal-400 backdrop-blur-md"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className={cn(
              "absolute right-2 top-2 h-10 w-10 rounded-full transition-colors",
              isLoading ? "bg-teal-500" : "bg-teal-400 hover:bg-teal-500"
            )}
            disabled={!inputValue.trim() || isLoading}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                />
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Send className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </form>
      )
    }

    if (step.type === "persona" && step.options) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {step.options.map((persona) => (
            <motion.button
              key={persona.id}
              onClick={() => {
                setSelectedPersona(persona.id)
                handleNext()
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex flex-col items-center rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md transition-all",
                selectedPersona === persona.id 
                  ? "border-teal-400 bg-white/20 ring-2 ring-teal-400/50" 
                  : "hover:bg-white/20"
              )}
            >
              <motion.div
                className={cn(
                  "mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                  selectedPersona === persona.id ? "bg-teal-400 text-black" : "bg-white/20 text-white"
                )}
                whileHover={{ scale: 1.1 }}
              >
                {persona.icon}
              </motion.div>
              <h3 className="text-lg font-medium text-white">{persona.name}</h3>
              <p className="mt-1 text-sm text-white/70">{persona.description}</p>
            </motion.button>
          ))}
        </div>
      )
    }

    if (step.type === "form" && step.fields) {
      return (
        <div className="w-full max-w-2xl space-y-6">
          {step.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="flex items-center gap-2 text-lg text-white">
                {field.icon}
                <span>{field.label}</span>
              </label>
              {field.name === "arrival" || field.name === "departure" ? (
                <Input
                  type="datetime-local"
                  value={formData.dates[field.name as 'arrival' | 'departure']}
                  onChange={(e) => handleDateChange(field.name as 'arrival' | 'departure', e.target.value)}
                  className="h-14 w-full rounded-full border-white/20 bg-white/10 px-6 text-white placeholder:text-white/50 focus-visible:ring-teal-400 backdrop-blur-md"
                />
              ) : field.type === "select" ? (
                <select
                  value={formData[field.name as keyof typeof formData] as string}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  className="h-14 w-full appearance-none rounded-full border border-white/20 bg-white/10 px-6 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === "multi-select" ? (
                <div className="flex flex-wrap gap-2">
                  {field.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        const currentInterests = formData.interests
                        const newInterests = currentInterests.includes(option)
                          ? currentInterests.filter(i => i !== option)
                          : [...currentInterests, option]
                        setFormData(prev => ({ ...prev, interests: newInterests }))
                      }}
                      className={cn(
                        "rounded-full border border-white/20 bg-white/10 px-6 py-4 text-base text-white transition-colors",
                        formData.interests.includes(option) ? "bg-teal-400 text-black" : "hover:bg-white/20"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : field.type === "toggle" ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, [field.name]: !prev[field.name as keyof typeof formData] }))}
                    className={cn(
                      "h-8 w-14 rounded-full transition-colors",
                      formData[field.name as keyof typeof formData] ? "bg-teal-400" : "bg-white/20"
                    )}
                  >
                    <motion.div
                      className="h-8 w-8 rounded-full bg-white"
                      animate={{
                        x: formData[field.name as keyof typeof formData] ? 24 : 0
                      }}
                    />
                  </button>
                  {field.description && (
                    <span className="text-base text-white/70">{field.description}</span>
                  )}
                </div>
              ) : (
                <Input
                  value={formData[field.name as keyof typeof formData] as string}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="h-14 w-full rounded-full border-white/20 bg-white/10 px-6 text-white placeholder:text-white/50 focus-visible:ring-teal-400 backdrop-blur-md"
                />
              )}
            </div>
          ))}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="h-14 rounded-full border-white/20 bg-white/10 px-8 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              type="button"
              onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
              className="h-14 rounded-full bg-teal-400 px-8 text-black hover:bg-teal-500"
            >
              {currentStep === steps.length - 1 ? "Generate Itinerary" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/sardinia-golden-sunset.jpg"
          alt="Magical Sardinia sunset"
          fill
          priority
          className="object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen w-full max-w-5xl flex-col items-center px-4">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 flex items-center"
        >
          <h1 className="text-4xl font-bold text-white">
            Sardin<span className="text-teal-400">.ai</span>
          </h1>
        </motion.div>

        <div className="flex w-full flex-1 items-center gap-8">
          {/* Selected Persona Info */}
          <AnimatePresence>
            {selectedPersona && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="hidden md:block w-1/3"
              >
                <div className="space-y-6">
                  <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
                    {(() => {
                      const selectedPersonaData = steps[1].type === "persona" 
                        ? steps[1].options.find(p => p.id === selectedPersona)
                        : null;

                      return selectedPersonaData ? (
                        <>
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-400/20 text-teal-400">
                            {selectedPersonaData.icon}
                          </div>
                          <h3 className="text-xl font-medium text-white">
                            {selectedPersonaData.name}
                          </h3>
                          <p className="mt-2 text-white/70">
                            {selectedPersonaData.description}
                          </p>
                        </>
                      ) : null
                    })()}
                  </div>

                  {/* Progress Steps */}
                  <div className="space-y-4">
                    {steps.map((step, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-md",
                          index === currentStep ? "border-teal-400 bg-white/20" : ""
                        )}
                      >
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          index < currentStep ? "bg-teal-400 text-black" : "bg-white/20 text-white"
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">{step.title}</h4>
                          {index < currentStep && (
                            <p className="text-xs text-white/50">Completed</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <motion.div 
            className={cn(
              "flex flex-1 flex-col items-center justify-center space-y-4",
              selectedPersona ? "md:w-2/3" : "w-full"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {currentStep === 0 && (
              <div className="text-center">
                <h2 className="text-3xl font-medium text-white">Your Sardinian Adventure Awaits</h2>
                <p className="mt-4 text-lg text-white/80">
                  Tell me your dream holiday, and I'll make it a reality
                </p>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="fixed bottom-6 right-6 flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
            onClick={() => setShowDemo(true)}
          >
            <Play className="mr-2 h-3 w-3" />
            See it in action
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
            onClick={() => setShowChat(true)}
          >
            <MessageCircle className="mr-2 h-3 w-3" />
            Let's talk
          </Button>
        </div>
      </div>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
            onClick={() => setShowDemo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-md"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDemo(false)}
                className="absolute right-4 top-4 text-white/50 hover:text-white"
              >
                ✕
              </button>
              <div className="aspect-video w-full rounded-lg bg-black/20">
                {/* Placeholder for demo video */}
                <div className="flex h-full items-center justify-center">
                  <Play className="h-16 w-16 text-white/20" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-end bg-black/50 backdrop-blur-md"
            onClick={() => setShowChat(false)}
          >
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative h-[90vh] w-full max-w-md rounded-l-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowChat(false)}
                className="absolute right-4 top-4 text-white/50 hover:text-white"
              >
                ✕
              </button>
              <div className="flex h-full flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-medium text-white">Write me anything</h3>
                  <p className="text-white/70">I'm here to help with your Sardinian adventure</p>
                </div>
                <ChatInterface />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto py-6 text-sm text-white/60">
        © {new Date().getFullYear()} Sardin.ai — Your personal Sardinian travel assistant
      </footer>
    </div>
  )
} 