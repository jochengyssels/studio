"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Bot, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const exampleQuestions = [
  "What are the best hidden beaches in Sardinia?",
  "Tell me about traditional Sardinian cuisine",
  "How to get from Cagliari to Alghero?",
  "What's the best time to visit Sardinia?",
  "Recommend a 7-day itinerary for first-time visitors",
  "Where can I find authentic Sardinian crafts?",
  "What are the must-see archaeological sites?",
  "Best places for sunset views in Sardinia?",
  "How to experience local festivals?",
  "Tips for traveling with kids in Sardinia?"
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your Sardinian travel assistant. Ask me anything about Sardinia - from hidden beaches to local cuisine, I'm here to help!",
      role: "assistant",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [placeholderText, setPlaceholderText] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let currentText = ""
    let currentIndex = 0
    const question = exampleQuestions[currentQuestionIndex]

    const typeNextCharacter = () => {
      if (currentIndex < question.length) {
        currentText += question[currentIndex]
        setPlaceholderText(currentText)
        currentIndex++
        timeout = setTimeout(typeNextCharacter, 50 + Math.random() * 50)
      } else {
        setIsTyping(false)
        timeout = setTimeout(() => {
          setPlaceholderText("")
          setCurrentQuestionIndex((prev) => (prev + 1) % exampleQuestions.length)
          setIsTyping(true)
        }, 2000)
      }
    }

    if (isTyping) {
      timeout = setTimeout(typeNextCharacter, 100)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [isTyping, currentQuestionIndex])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call to our trained model
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a placeholder response. Our Sardinian expert is being trained!",
        role: "assistant",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto rounded-lg bg-black/20 p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "flex items-start gap-3",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                message.role === "user" 
                  ? "bg-teal-400/20 text-teal-400" 
                  : "bg-white/20 text-white"
              )}>
                {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={cn(
                "rounded-lg p-3 max-w-[80%]",
                message.role === "user"
                  ? "bg-teal-400/20 text-white"
                  : "bg-white/10 text-white"
              )}>
                {message.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-lg bg-white/10 p-3">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholderText}
          className="flex-1 rounded-full border-white/20 bg-white/10 text-white placeholder:text-white/50"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full bg-teal-400 hover:bg-teal-500"
          disabled={!inputValue.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
} 