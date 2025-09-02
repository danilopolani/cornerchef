"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChefChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your personal AI chef assistant. I can help you with recipes, cooking techniques, ingredient substitutions, meal planning, and any cooking questions you have. What would you like to cook today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return



    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    requestAnimationFrame(() => {
      inputRef.current?.focus()

    })

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      requestAnimationFrame(() => {
        inputRef.current?.focus()

      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-6 flex-shrink-0">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Chef
          </h1>
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.prefs?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm font-medium">
                {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start gap-3 max-w-[85%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <Card className={`p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </Card>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <Card className="p-3 bg-card">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Chef is thinking...</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 max-w-md mx-auto w-full px-4 pb-20">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about cooking..."
            disabled={isLoading}
            className="flex-1 text-sm placeholder:text-xs"
          />
          <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={() => {
          // Modal will close automatically
        }}
      />

      <BottomNavigation />
    </div>
  )
}
