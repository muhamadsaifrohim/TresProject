import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Bungkus halaman yang butuh login. Kalau belum login, lempar ke /login,
// dan simpan halaman asal supaya bisa kembali setelah berhasil masuk.
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <p className="flex-1 py-20 text-center text-muted">Memeriksa sesi...</p>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}