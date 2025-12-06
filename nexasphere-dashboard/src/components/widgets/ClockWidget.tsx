import { useEffect, useState } from 'react'

export const ClockWidget = () => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const seconds = now.toLocaleTimeString([], { second: '2-digit' })
  const date = now.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-foreground)]/60">Now</p>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-5xl font-semibold tracking-tight text-[var(--color-foreground)]">{time}</span>
          <span className="text-lg font-semibold text-[var(--color-foreground)]/60">{seconds}</span>
        </div>
        <p className="mt-6 text-sm font-medium text-[var(--color-foreground)]/80">{date}</p>
      </div>
      <div className="mt-8 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-foreground)]/60">
        Time is synced with your device clock.
      </div>
    </div>
  )
}
