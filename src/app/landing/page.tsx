"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Users, Compass, ChevronDown, Sparkles, Calendar, MapPin, Plane, CloudSun, Wand2, Map, Clock, Star, MessageCircle, Play, Euro, Utensils, Car, Landmark, Languages, X, Accessibility, ArrowLeft, ArrowRight, Check } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Script from "next/script"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { ProfileMenu } from "@/components/profile-menu"
import { DatePicker } from "@/components/ui/date-picker"
import { DateRange } from "react-day-picker"
import { LocationAutocomplete } from "@/components/ui/location-autocomplete"

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
      type: "text" | "datetime-local" | "date" | "daterange" | "location";
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

// Add a new TypewriterEffect component at the top of the file
function TypewriterEffect({ text, className }: { text: string, className?: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 50); // Adjust typing speed here
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);
  
  // Reset animation when text changes
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);
  
  return <span className={className}>{displayedText}<span className="animate-pulse">|</span></span>;
}

export default function LandingPage() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDemo, setShowDemo] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [formData, setFormData] = useState({
    // Core Travel Details
    dateRange: undefined as DateRange | undefined,
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

  // Example holiday desires for dynamic placeholder
  const placeholders = [
    "I want to explore hidden beaches and enjoy local cuisine...",
    "I'd love a relaxing week with family, exploring Sardinian culture...",
    "Looking for adventure - hiking, diving, and authentic experiences..."
  ]
  
  // Switch placeholder text every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

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
      title: "Travel Period",
      type: "form",
      fields: [
        {
          name: "dateRange",
          label: "When are you traveling?",
          type: "daterange",
          placeholder: "Select your travel dates",
          icon: <Calendar className="h-4 w-4" />
        }
      ]
    },
    {
      title: "Location & Transport",
      type: "form",
      fields: [
        {
          name: "location",
          label: "Base location in Sardinia",
          type: "location",
          placeholder: "Search for a city or town in Sardinia",
          icon: <MapPin className="h-4 w-4" />
        },
        {
          name: "transportMode",
          label: "How will you get around?",
          type: "select",
          options: ["Car", "Public Transport", "Not decided yet"],
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

  // Add state for fading animations
  const [fadingOut, setFadingOut] = useState(false)

  const handleNext = () => {
    // First fade out current content
    setFadingOut(true)
    
    // Then after a short delay, change the step and fade in new content
    setTimeout(() => {
      setCurrentStep(prev => prev + 1)
      setFadingOut(false)
    }, 400)
  }

  const handleBack = () => {
    setFadingOut(true)
    setTimeout(() => {
      setCurrentStep(prev => prev - 1)
      setFadingOut(false)
    }, 400)
  }

  const formatPrompt = () => {
    const { 
      dateRange, 
      location, 
      transportMode, 
      groupType, 
      interests, 
      pace, 
      dailyBudget, 
      dietaryNeeds, 
      mobility, 
      culturalDepth, 
      crowdAvoidance, 
      language, 
      mustSees, 
      avoids, 
      specialRequests 
    } = formData;
    
    // Calculate trip duration
    const tripDuration = getDuration(dateRange);
    
    // Get selected persona type
    const personaType = selectedPersona || 'general';
    const personaInfo = steps[1].type === "persona" 
      ? steps[1].options.find(p => p.id === selectedPersona)
      : null;
    
    // Build the prompt
    const prompt = `
# Sardinia Vacation Itinerary Request

## Traveler Profile
- Travel Style: ${personaInfo ? personaInfo.name : 'Not specified'} (${personaInfo ? personaInfo.description : ''})
- Group Type: ${groupType || 'Not specified'}
- Duration: ${tripDuration} days (${dateRange?.from ? format(dateRange.from, 'MMM d, yyyy') : 'Not specified'} to ${dateRange?.to ? format(dateRange.to, 'MMM d, yyyy') : 'Not specified'})

## Location & Logistics
- Base Location: ${location || 'Flexible'}
- Transportation: ${transportMode || 'Not specified'}

## Preferences
- Interests: ${interests.length ? interests.join(', ') : 'Not specified'}
- Pace: ${pace || 'Balanced'}
- Budget: ${dailyBudget || 'Moderate'}
- Dietary Requirements: ${dietaryNeeds || 'None specified'}
- Accessibility Needs: ${mobility || 'None specified'}

## Special Requests
- Must-See Places: ${mustSees || 'Not specified'}
- Places to Avoid: ${avoids || 'Not specified'}
- Special Requests: ${specialRequests || 'Not specified'}

## Sardinian Experience
- Authentic Cultural Experiences: ${culturalDepth ? 'Yes' : 'Standard'}
- Avoid Tourist Crowds: ${crowdAvoidance ? 'Yes' : 'Not a priority'}
- Local Language Phrases: ${language ? 'Yes' : 'No'}

## Additional Notes
${inputValue || 'No additional notes provided.'}

Please create a detailed day-by-day itinerary with specific recommendations for accommodations, restaurants, activities, and experiences tailored to these preferences. Include estimated travel times and distances between locations.
`;

    return prompt;
  };

  const getDuration = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from || !dateRange?.to) return 7 // Default to 7 days
    const arrival = dateRange.from
    const departure = dateRange.to
    const diffTime = Math.abs(departure.getTime() - arrival.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 0 && !inputValue.trim()) {
      setError("Please tell us about your dream holiday");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // If on the first step, just proceed to next step
      if (currentStep === 0) {
        await new Promise(resolve => setTimeout(resolve, 800));
        handleNext();
      } 
      // If on the final step, generate the prompt and "send" it
      else if (currentStep === steps.length - 1) {
        // On final step, format the prompt
        const prompt = formatPrompt();
        
        // Log the prompt (for debugging)
        console.log("Generated prompt:", prompt);
        
        // Show the processing animation for a moment
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Open the results dialog
        setGeneratedPrompt(prompt);
        setShowPromptResult(true);
        
        // TODO: In a real implementation, this is where you would send the prompt
        // to your Sardinia agent API endpoint
        // const response = await fetch('/api/sardinia-agent', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ prompt })
        // });
        // const data = await response.json();
        // handleAgentResponse(data);
      } 
      // Otherwise, just move to the next step
      else {
        handleNext();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the date input handling to include time
  const handleDateChange = (range: DateRange | undefined) => {
    setFormData(prev => ({
      ...prev,
      dateRange: range
    }))
  }

  // Generate time options for the select
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? '00' : '30'
    return `${hour.toString().padStart(2, '0')}:${minute}`
  })

  // Add state for handling the generated prompt
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [showPromptResult, setShowPromptResult] = useState(false);

  const renderStep = () => {
    const step = steps[currentStep]
    
    if (!step) return null
    
    if (step.type === "free-input") {
      return (
        <div className="w-full flex flex-col items-center">
          <form onSubmit={handleSubmit} className="relative w-full max-w-[800px]">
            <Input
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setError(null)
              }}
              placeholder=""
              className="h-16 w-full rounded-full border-white/20 bg-white/10 pl-8 pr-16 text-lg text-white focus-visible:ring-teal-400 backdrop-blur-md"
              disabled={isLoading}
            />
            {/* Show the typewriter effect when input is empty */}
            {!inputValue && (
              <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white/50 text-lg pointer-events-none">
                <TypewriterEffect text={placeholders[placeholderIndex]} />
              </div>
            )}
            <Button
              type="submit"
              className={cn(
                "absolute right-3 top-3 font-medium text-sm px-4 h-10 rounded-full transition-colors",
                isLoading ? "bg-teal-500" : "bg-teal-400 hover:bg-teal-500"
              )}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </span>
              ) : (
                <span>Start with your dream</span>
              )}
            </Button>
          </form>
          
          {/* Improved suggestion prompts */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-[800px]">
            {[
              {
                text: "I want to explore hidden beaches and coastal towns with my family",
                icon: <Compass className="h-4 w-4" />,
                color: "from-blue-500/10 to-emerald-500/10",
                title: "Beach Explorer"
              },
              {
                text: "Looking for a cultural tour focusing on local food and wine",
                icon: <Utensils className="h-4 w-4" />,
                color: "from-amber-500/10 to-red-500/10",
                title: "Cultural Foodie"
              },
              {
                text: "Active holiday with hiking, boating, and swimming opportunities",
                icon: <Plane className="h-4 w-4" />,
                color: "from-indigo-500/10 to-blue-500/10",
                title: "Active Adventurer"
              },
              {
                text: "Romantic getaway focusing on beautiful scenery and relaxation",
                icon: <CloudSun className="h-4 w-4" />,
                color: "from-purple-500/10 to-pink-500/10",
                title: "Romantic Retreat"
              }
            ].map((suggestion, index) => (
              <button 
                key={index}
                onClick={() => setInputValue(suggestion.text)}
                className={`flex flex-col text-left p-4 rounded-xl border border-white/10 bg-gradient-to-br ${suggestion.color} backdrop-blur-sm hover:border-white/30 transition-all hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/10">
                    {suggestion.icon}
                  </div>
                  <h4 className="font-medium text-sm text-white">{suggestion.title}</h4>
                </div>
                <p className="text-xs text-white/70 line-clamp-2">{suggestion.text}</p>
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (step.type === "persona" && step.options) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full max-w-3xl">
          {step.options.map((persona) => {
            // Define color schemes for each persona
            const colorSchemes = {
              adventurer: {
                bg: "from-emerald-500/20 to-blue-500/20",
                icon: "bg-emerald-400 text-emerald-900",
                iconComponent: <Compass className="h-4 w-4" />
              },
              culture: {
                bg: "from-amber-500/20 to-red-500/20",
                icon: "bg-amber-400 text-amber-900",
                iconComponent: <Landmark className="h-4 w-4" />
              },
              relaxation: {
                bg: "from-violet-500/20 to-purple-500/20",
                icon: "bg-violet-400 text-violet-900",
                iconComponent: <CloudSun className="h-4 w-4" />
              }
            };
            
            const colors = colorSchemes[persona.id as keyof typeof colorSchemes];
            
            return (
              <motion.button
                key={persona.id}
                onClick={() => {
                  setSelectedPersona(persona.id)
                  handleNext()
                }}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center rounded-xl border bg-gradient-to-br p-4 backdrop-blur-md transition-all",
                  colors.bg,
                  selectedPersona === persona.id 
                    ? `border-transparent ring-2 ring-white/20 shadow-lg` 
                    : "border-white/10 hover:border-white/30"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-md",
                    selectedPersona === persona.id ? colors.icon : "bg-white/10 text-white"
                  )}
                >
                  {colors.iconComponent}
                </div>
                <div className="ml-3 text-left">
                  <h3 className="text-base font-medium text-white">{persona.name}</h3>
                  <p className="mt-1 text-xs text-white/70">{persona.description}</p>
                </div>
              </motion.button>
            );
          })}
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
              {field.type === "daterange" ? (
                <div className="flex flex-col gap-2">
                  <DatePicker
                    date={formData.dateRange?.from}
                    setDate={(date) => {
                      setFormData(prev => ({
                        ...prev,
                        dateRange: {
                          from: date,
                          to: prev.dateRange?.to
                        }
                      }))
                    }}
                    label="Start date"
                  />
                  <DatePicker
                    date={formData.dateRange?.to}
                    setDate={(date) => {
                      setFormData(prev => ({
                        ...prev,
                        dateRange: {
                          from: prev.dateRange?.from,
                          to: date
                        }
                      }))
                    }}
                    label="End date"
                  />
                </div>
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
              ) : field.type === "location" ? (
                <LocationAutocomplete
                  value={formData[field.name as keyof typeof formData] as string}
                  onChange={(location) => setFormData(prev => ({ ...prev, [field.name]: location }))}
                  placeholder={field.placeholder}
                />
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
    <div className="relative min-h-screen">
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

      {/* Fixed Header - Logo and Profile Menu */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <h1 className="text-4xl font-bold text-white">
            Sardin<span className="text-teal-400">.ai</span>
          </h1>
          <ProfileMenu />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center px-4 mx-auto pt-24">
        <div className="flex w-full flex-1 max-w-7xl mx-auto">
          {/* Timeline and Selected Persona Info */}
          <AnimatePresence>
            {currentStep > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -50, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "280px" }}
                exit={{ opacity: 0, x: -50, width: 0 }}
                className="hidden md:block h-[calc(100vh-120px)] sticky top-24 pl-4 pr-8"
              >
                <div className="space-y-6">
                  {/* If persona is selected, show it at the top */}
                  {selectedPersona && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md"
                    >
                      {(() => {
                        const selectedPersonaData = steps[1].type === "persona" 
                          ? steps[1].options.find(p => p.id === selectedPersona)
                          : null;

                        if (!selectedPersonaData) return null;
                        
                        // Get color scheme for selected persona
                        const colorSchemes = {
                          adventurer: {
                            bg: "from-emerald-500/20 to-blue-500/20",
                            icon: "bg-emerald-400 text-emerald-900",
                            iconComponent: <Compass className="h-5 w-5" />
                          },
                          culture: {
                            bg: "from-amber-500/20 to-red-500/20",
                            icon: "bg-amber-400 text-amber-900",
                            iconComponent: <Landmark className="h-5 w-5" />
                          },
                          relaxation: {
                            bg: "from-violet-500/20 to-purple-500/20",
                            icon: "bg-violet-400 text-violet-900",
                            iconComponent: <CloudSun className="h-5 w-5" />
                          }
                        };
                        
                        const colors = colorSchemes[selectedPersonaData.id as keyof typeof colorSchemes];

                        return (
                          <>
                            <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${colors.icon}`}>
                              {colors.iconComponent}
                            </div>
                            <h3 className="text-lg font-medium text-white">
                              {selectedPersonaData.name}
                            </h3>
                            <p className="mt-1 text-sm text-white/70">
                              {selectedPersonaData.description}
                            </p>
                          </>
                        );
                      })()}
                    </motion.div>
                  )}

                  {/* Progress Steps Timeline with Icons */}
                  <div className="space-y-1 mt-8">
                    <h3 className="text-sm font-semibold uppercase text-white/50 mb-3 tracking-wider pl-3">Your Trip Plan</h3>
                    {steps.map((step, index) => {
                      // Define icons for each step
                      const stepIcons = [
                        <Wand2 key="wand" className="h-4 w-4" />,
                        <User key="user" className="h-4 w-4" />,
                        <Calendar key="calendar" className="h-4 w-4" />,
                        <MapPin key="map" className="h-4 w-4" />,
                        <Users key="users" className="h-4 w-4" />,
                        <Euro key="euro" className="h-4 w-4" />,
                        <Sparkles key="sparkles" className="h-4 w-4" />
                      ];
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { delay: 0.05 * index }
                          }}
                          className={cn(
                            "flex items-center gap-3 p-2 pl-3 relative rounded-l-lg",
                            index === currentStep ? "text-white bg-white/10" : "text-white/50"
                          )}
                        >
                          {/* Timeline connector */}
                          {index > 0 && (
                            <div 
                              className={cn(
                                "absolute left-4 top-0 h-full w-0.5 -translate-x-1/2", 
                                index <= currentStep ? "bg-teal-400" : "bg-white/20"
                              )} 
                            />
                          )}
                          
                          {/* Step icon indicator */}
                          <div className={cn(
                            "relative z-10 flex h-8 w-8 items-center justify-center rounded-full",
                            index < currentStep 
                              ? "bg-teal-400 text-black" 
                              : index === currentStep 
                                ? "border-2 border-teal-400 bg-black/50 text-white" 
                                : "bg-white/10 text-white/50"
                          )}>
                            {index < currentStep ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              stepIcons[index]
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className={cn(
                              "text-sm font-medium",
                              index === currentStep ? "text-teal-400" : ""
                            )}>
                              {step.title}
                            </h4>
                            
                            {index < currentStep && (
                              <div className="text-xs text-white/50">
                                {/* Show summary of completed steps */}
                                {index === 1 && selectedPersona && (
                                  <span>
                                    {steps[1].type === "persona" 
                                      ? steps[1].options.find(p => p.id === selectedPersona)?.name 
                                      : "Selected"}
                                  </span>
                                )}
                                {index === 2 && formData.dateRange?.from && formData.dateRange?.to && (
                                  <span>
                                    {format(formData.dateRange.from, "MMM d")} - {format(formData.dateRange.to, "MMM d")}
                                  </span>
                                )}
                                {index === 3 && (
                                  <span>
                                    {formData.location || "Any location"}
                                  </span>
                                )}
                                {index === 4 && (
                                  <span>
                                    {formData.groupType || "Not specified"}
                                  </span>
                                )}
                                {index === 5 && (
                                  <span>
                                    {formData.dailyBudget || "Not specified"}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Form Content */}
          <motion.div 
            className={cn(
              "flex flex-1 flex-col items-center justify-center space-y-6 pb-16",
              currentStep > 0 ? "md:pl-8 md:max-w-[calc(100%-280px)]" : "w-full max-w-4xl mx-auto"
            )}
            initial={{ opacity: 1 }}
            animate={{ opacity: fadingOut ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <div className="text-center mb-8 w-full max-w-2xl mx-auto">
                <motion.h2 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-medium text-white"
                >
                  Your Sardinian Adventure Awaits
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 text-xl text-white/80"
                >
                  Tell me your dream holiday, and I'll make it a reality
                </motion.p>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full"
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
        <div className="fixed bottom-6 right-6 flex gap-3 z-20">
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

      {/* Generated Prompt Result Modal */}
      <AnimatePresence>
        {showPromptResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
            onClick={() => setShowPromptResult(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[80vh] overflow-auto rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-md"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPromptResult(false)}
                className="absolute right-4 top-4 text-white/50 hover:text-white"
              >
                ✕
              </button>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white">Your Sardinian Adventure</h2>
                <p className="text-white/70">
                  This prompt has been sent to our AI agent to generate your personalized itinerary.
                </p>
              </div>
              <div className="rounded-lg bg-black/30 p-4">
                <pre className="overflow-auto whitespace-pre-wrap text-sm text-white/90">
                  {generatedPrompt}
                </pre>
              </div>
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  className="rounded-full border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-md hover:bg-white/20"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPrompt);
                  }}
                >
                  Copy Prompt
                </Button>
                <Button
                  className="rounded-full bg-teal-400 px-4 py-2 text-black hover:bg-teal-500"
                  onClick={() => {
                    // In a real implementation, you would call your sardinia agent API here
                    // and display the results in a new view
                    setShowPromptResult(false);
                    
                    // For demo purposes, navigate to a hypothetical results page
                    // window.location.href = '/results';
                  }}
                >
                  Generate Itinerary
                </Button>
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

/*
Database Schema Update for DateRange and Location:
For storing the dateRange and location data in the database, update the travel_details table:

CREATE TABLE travel_details (
  id SERIAL PRIMARY KEY,
  trip_request_id INTEGER REFERENCES trip_requests(id),
  start_date DATE,  -- Changed from arrival_date
  end_date DATE,    -- Changed from departure_date
  duration INTEGER,
  location_name VARCHAR(255), -- City/town name
  location_address VARCHAR(255), -- Full formatted address from Google Places
  location_lat DECIMAL(10, 8), -- Optional: Latitude for mapping
  location_lng DECIMAL(11, 8), -- Optional: Longitude for mapping
  transport_mode VARCHAR(50)
);

This change enhances the data quality with standardized location data from Google Places API
and simplifies the date storage with the unified DateRange picker.
*/ 