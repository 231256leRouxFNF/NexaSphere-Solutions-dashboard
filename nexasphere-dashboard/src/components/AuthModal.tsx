import { type FormEvent, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

type Mode = 'login' | 'signup'

export type AuthModalProps = {
  mode: Mode
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

const titles: Record<Mode, string> = {
  login: 'Welcome back',
  signup: 'Create your workspace',
}

export const AuthModal = ({ mode, open, onClose, onSuccess }: AuthModalProps) => {
  const { login, signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setForm({ name: '', email: '', password: '' })
      setError(null)
      setLoading(false)
    }
  }, [open, mode])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await signup(form.name, form.email, form.password)
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="mx-4 w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-foreground)]/60">Secure Access</p>
                <h3 className="mt-1 text-2xl font-semibold text-[var(--color-foreground)]">{titles[mode]}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-full border border-transparent text-sm text-[var(--color-foreground)]/60 hover:border-[var(--color-border)] hover:text-[var(--color-foreground)]"
              >
                x
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 text-sm text-[var(--color-foreground)]">
              {mode === 'signup' ? (
                <label className="grid gap-2 text-xs uppercase tracking-[0.16em] text-[var(--color-foreground)]/60">
                  Full Name
                  <input
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Alex Carter"
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none"
                    required
                  />
                </label>
              ) : null}

              <label className="grid gap-2 text-xs uppercase tracking-[0.16em] text-[var(--color-foreground)]/60">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="name@company.com"
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none"
                  required
                />
              </label>

              <label className="grid gap-2 text-xs uppercase tracking-[0.16em] text-[var(--color-foreground)]/60">
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="At least 6 characters"
                  minLength={6}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none"
                  required
                />
              </label>

              {error ? <p className="text-xs text-red-500">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
