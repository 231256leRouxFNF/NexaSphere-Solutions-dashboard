import { type ChangeEvent, useState } from 'react'
import { useWidgetStorage } from '../../hooks/useWidgetStorage'

const MAX_CHARS = 2000

export const NotesWidget = () => {
  const [value, setValue] = useWidgetStorage<string>('notes', '')
  const [draft, setDraft] = useState(value)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value.slice(0, MAX_CHARS)
    setDraft(next)
    setValue(next)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--color-foreground)]/70">
        <span>Quick Notes</span>
        <span>
          {draft.length}/{MAX_CHARS}
        </span>
      </div>
      <textarea
        value={draft}
        onChange={handleChange}
        placeholder="Bullet key updates, meeting highlights, or ideas. Everything saves instantly."
        className="mt-3 h-full w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-relaxed text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none"
      />
      <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[var(--color-foreground)]/50">Autosaves for each account.</p>
    </div>
  )
}
