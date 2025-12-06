import { useTheme } from '../../context/ThemeContext'

export const ThemeControls = () => {
  const { theme, setTheme, toggleTheme, palette, updatePalette } = useTheme()

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 text-sm text-[var(--color-foreground)]">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-foreground)]/60">Theme</p>
          <h4 className="text-sm font-semibold text-[var(--color-foreground)]">Display Preferences</h4>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-foreground)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          Toggle
        </button>
      </header>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { key: 'light', label: 'Light' },
          { key: 'dark', label: 'Dark' },
          { key: 'custom', label: 'Custom' },
        ].map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setTheme(option.key as typeof theme)}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
              theme === option.key
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)]/70'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {theme === 'custom' ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.16em] text-[var(--color-foreground)]/60">
            Accent
            <input
              type="color"
              value={palette.accent}
              onChange={(event) => updatePalette({ accent: event.target.value })}
              className="h-10 w-full rounded border border-[var(--color-border)] bg-transparent"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.16em] text-[var(--color-foreground)]/60">
            Surface
            <input
              type="color"
              value={palette.surface}
              onChange={(event) =>
                updatePalette({
                  surface: event.target.value,
                  surfaceMuted: event.target.value,
                })
              }
              className="h-10 w-full rounded border border-[var(--color-border)] bg-transparent"
            />
          </label>
        </div>
      ) : null}
    </section>
  )
}
