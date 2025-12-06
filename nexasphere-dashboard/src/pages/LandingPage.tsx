import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthModal } from '../components/AuthModal'
import { useAuth } from '../context/AuthContext'

const FEATURE_CARDS = [
  {
    title: 'Modular workspace',
    description: 'Drag, resize, and curate widgets that match each client workflow.',
  },
  {
    title: 'Freemium friendly',
    description: 'Guests explore core tools while accounts unlock advanced data blocks.',
  },
  {
    title: 'Automation ready',
    description: 'Built with React, Tailwind, and react-grid-layout for scalable growth.',
  },
]

const WIDGET_SUMMARY = [
  {
    title: 'Core essentials',
    items: ['Clock and date', 'Motivation feed', 'To-do manager', 'Notes board'],
  },
  {
    title: 'Advanced suite',
    items: ['Weather insights', 'Habit tracker', 'Calendar timeline'],
  },
  {
    title: 'Experience layer',
    items: ['Light and dark themes', 'Custom accent palette', 'Smooth motion transitions'],
  },
]

export const LandingPage = () => {
  const navigate = useNavigate()
  const { continueAsGuest, authenticated, user } = useAuth()
  const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>(null)

  const sendToDashboard = () => {
    navigate('/dashboard')
  }

  const handleGuest = () => {
    continueAsGuest()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-foreground)]">
      <header className="mx-auto flex w-full max-w-[min(100%,1600px)] flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-foreground)]/60">NexaSphere Solutions</p>
          <h1 className="text-3xl font-semibold">Client Experience Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
          {authenticated ? (
            <button
              type="button"
              onClick={sendToDashboard}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-[var(--color-foreground)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Open Dashboard
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveModal('login')}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-[var(--color-foreground)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('signup')}
                className="rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 text-white hover:brightness-110"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[min(100%,1600px)] px-4 pb-16 sm:px-6 lg:px-8 xl:px-12">
        <section className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr),minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-8 shadow-xl"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-foreground)]/60">Trusted launchpad</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Empower every NexaSphere client with a single customizable control center.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[var(--color-foreground)]/75">
              NexaSphere Dashboard keeps productivity, insights, and personal coaching tools in one flexible hub.
              Guests explore core widgets, while registered users unlock advanced analytics, theming, and persistent
              layouts backed by local storage.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em]">
              <button
                type="button"
                onClick={authenticated ? sendToDashboard : () => setActiveModal('signup')}
                className="rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-6 py-3 text-white hover:brightness-110"
              >
                {authenticated ? 'Resume session' : 'Launch full access'}
              </button>
              <button
                type="button"
                onClick={handleGuest}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-[var(--color-foreground)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                Continue as guest
              </button>
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-[var(--color-foreground)]/50">
              Signed in as {user?.name ?? 'Visitor'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground)]/60">Why it works</h3>
            <div className="mt-5 grid gap-4">
              {FEATURE_CARDS.map((feature) => (
                <div key={feature.title} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
                  <h4 className="text-base font-semibold text-[var(--color-foreground)]">{feature.title}</h4>
                  <p className="mt-2 text-xs text-[var(--color-foreground)]/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mt-16 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-foreground)]/60">Widget blueprint</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WIDGET_SUMMARY.map((group) => (
              <div key={group.title} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <h4 className="text-base font-semibold text-[var(--color-foreground)]">{group.title}</h4>
                <ul className="mt-3 space-y-2 text-sm text-[var(--color-foreground)]/75">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <AuthModal
        mode={activeModal ?? 'login'}
        open={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        onSuccess={sendToDashboard}
      />
    </div>
  )
}
