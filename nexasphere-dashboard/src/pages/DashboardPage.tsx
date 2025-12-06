import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useDashboard } from '../context/DashboardContext'
import { useTheme } from '../context/ThemeContext'
import { WidgetGrid } from '../components/dashboard/WidgetGrid'
import { WidgetGallery } from '../components/dashboard/WidgetGallery'
import { ThemeControls } from '../components/dashboard/ThemeControls'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout, isGuest } = useAuth()
  const { theme } = useTheme()
  const { widgets, layouts, addWidget, removeWidget, setLayouts, resetDashboard } = useDashboard()

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [navigate, user])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-foreground)]">
      <header className="mx-auto flex w-full max-w-[min(100%,1600px)] flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 xl:px-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-foreground)]/60">Hello {user.name}</p>
          <h1 className="mt-2 text-4xl font-semibold">Your NexaSphere control center</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.24em] text-[var(--color-foreground)]/60">
            <span>Status: {isGuest ? 'Guest access' : 'Full access'}</span>
            <span>Theme: {theme}</span>
            <span>Widgets: {widgets.length}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.18em] sm:flex-row">
          <button
            type="button"
            onClick={resetDashboard}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-[var(--color-foreground)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Reset layout
          </button>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-3 text-white hover:brightness-110"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[min(100%,1600px)] gap-8 px-4 pb-14 sm:px-6 lg:grid-cols-[minmax(0,2.5fr),minmax(0,1fr)] lg:px-8 xl:px-12">
        <motion.section
          key="grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex min-w-0 flex-col gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5"
        >
          <WidgetGrid
            widgets={widgets}
            layouts={layouts}
            onLayoutChange={setLayouts}
            onRemove={removeWidget}
            isGuest={isGuest}
          />
        </motion.section>

        <motion.aside
          key="sidebar"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid min-w-0 gap-6"
        >
          <ThemeControls />
          <WidgetGallery activeWidgets={widgets} isGuest={isGuest} onAdd={addWidget} />
        </motion.aside>
      </main>
    </div>
  )
}
