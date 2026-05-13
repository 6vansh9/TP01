"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "freelancer" | "client"
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: { name: string; email: string; password: string; role: "freelancer" | "client" }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem("taskpay_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("taskpay_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // Mock user for demo
    const mockUser: User = {
      id: "1",
      name: "Vansh A.",
      email: email,
      avatar: "/avatar-vansh.jpg",
      role: "freelancer",
    }
    
    setUser(mockUser)
    localStorage.setItem("taskpay_user", JSON.stringify(mockUser))
  }

  const signup = async (data: { name: string; email: string; password: string; role: "freelancer" | "client" }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role,
    }
    
    setUser(newUser)
    localStorage.setItem("taskpay_user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("taskpay_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
