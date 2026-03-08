'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserProfileResponse } from '@/types'

interface AuthContextValue {
  user: UserProfileResponse | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: UserProfileResponse | null) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children, initialUser }: { children: ReactNode; initialUser?: UserProfileResponse | null }) {
  const [user, setUser] = useState<UserProfileResponse | null>(initialUser ?? null)
  const [isLoading, setIsLoading] = useState(!initialUser)

  useEffect(() => {
    if (!initialUser) {
      setIsLoading(false)
    }
  }, [initialUser])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
