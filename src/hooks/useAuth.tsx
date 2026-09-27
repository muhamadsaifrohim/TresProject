import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api, ApiError } from '../lib/api'
import type { ApiUser } from '../lib/api'

const TOKEN_KEY = 'lostnfound:token'
const USER_KEY = 'lostnfound:user'

type AuthContextValue = {
  user: ApiUser | null
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): ApiUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as ApiUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(readStoredUser)
  const [isLoading, setIsLoading] = useState(true)

  // Cek ulang ke server apakah token yang tersimpan masih berlaku
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }

    api
      .get<ApiUser>('/me')
      .then((freshUser) => {
        setUser(freshUser)
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser))
      })
      .catch(() => {
        // Token basi/tidak valid: anggap sudah logout
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.post<{ user: ApiUser; token: string }>('/login', { email, password })
    localStorage.setItem(TOKEN_KEY, result.token)
    localStorage.setItem(USER_KEY, JSON.stringify(result.user))
    setUser(result.user)
  }, [])

  const logout = useCallback(() => {
    api.post('/logout').catch(() => {
      // Kalau gagal (misal token sudah expired), tetap lanjut logout di sisi frontend
    })
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAdmin: user?.role === 'admin', isLoading, login, logout }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  return context
}

export { ApiError }