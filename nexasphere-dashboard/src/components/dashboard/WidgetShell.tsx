import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export type WidgetShellProps = {
  title: string
  badge?: string
  secondaryText?: string
  onRemove?: () => void
  children: ReactNode
}

export const WidgetShell = ({ title, badge, secondaryText, onRemove, children }: WidgetShellProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="grid h-full grid-rows-[auto,1fr] gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]/95 p-4 shadow-lg shadow-black/10"
    >
      <header className="flex items-start justify-between gap-3 border-b border-[var(--color-border)]/60 pb-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-foreground)]">{title}</h3>
          {secondaryText ? <p className="mt-1 text-xs text-[var(--color-foreground)]/70">{secondaryText}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {badge ? (
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-foreground)]/70">
              {badge}
            </span>
          ) : null}
          {onRemove ? (
            <button
              type="button"
              aria-label="Remove widget"
              onClick={onRemove}
              className="h-7 w-7 rounded-full border border-transparent text-xs font-semibold text-[var(--color-foreground)]/60 transition hover:border-[var(--color-border)] hover:text-[var(--color-foreground)]"
            >
              x
            </button>
          ) : null}
        </div>
      </header>
      <div className="overflow-hidden">{children}</div>
    </motion.div>
  )
}
