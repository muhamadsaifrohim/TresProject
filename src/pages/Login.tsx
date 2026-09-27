import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ApiError, useAuth } from '../hooks/useAuth'

const inputClass =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-accent'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Kalau tadinya diarahkan ke sini dari halaman lain (misal /report), kembalikan ke situ setelah login
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal login. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Masuk</h1>
      <p className="mt-2 text-muted">Masuk untuk membuat laporan barang.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-accent px-6 py-3 text-lg font-semibold text-ink transition-colors hover:bg-[#d3c078] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Memeriksa...' : 'Masuk'}
        </button>
      </form>
    </section>
  )
}