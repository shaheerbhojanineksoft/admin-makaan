import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Logo from '../components/ui/Logo'
import Toast from '../components/ui/Toast'
import { adminApi } from '../utils/api'
import { signInAdmin } from '../utils/session'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('makaanadmin@gmail.com')
  const [password, setPassword] = useState('makaan@0028')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)

  const clearToast = useCallback(() => setToast(''), [])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim() || !password.trim()) {
      const message = 'Email and password are required.'
      setError(message)
      setToast(message)
      return
    }

    setLoading(true)
    setError('')
    setToast('')

    try {
      const data = await adminApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })

      signInAdmin({
        accessToken: data?.accessToken || '',
        expiresIn: data?.expiresIn || '',
        admin: data?.admin || { email: email.trim() },
      })
      navigate('/', { replace: true })
    } catch (err) {
      const message = err?.message || 'Login failed. Please try again.'
      setError(message)
      setToast(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand/90 px-4 py-8">
      <Toast
        open={Boolean(toast)}
        message={toast}
        variant="error"
        duration={3000}
        onClose={clearToast}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-light/25 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="animate-fade-up relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-5 font-display text-2xl font-extrabold text-slate-900">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage agencies, listings, reels, recommendations, users and lawyers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
              required
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
              required
            />
          </label>

          {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading || Boolean(toast)}
            className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-center text-[11px] text-slate-400">
            Dev: makaanadmin@gmail.com / makaan@0028
          </p>
        </form>
      </div>
    </div>
  )
}
