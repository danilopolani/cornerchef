"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { account, ID } from "@/lib/appwrite"
import type { Models } from "appwrite"

interface AuthContextType {
  user: Models.User<Models.Preferences> | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await account.get()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password)
      const currentUser = await account.get()
      setUser(currentUser)
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      await account.create(ID.unique(), email, password, name)
      await account.createEmailPasswordSession(email, password)
      const currentUser = await account.get()
      setUser(currentUser)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await account.deleteSession("current")
      setUser(null)
    } catch (error) {
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
