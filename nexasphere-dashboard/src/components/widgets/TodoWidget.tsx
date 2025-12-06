import { type FormEvent, useMemo, useState } from 'react'
import { useWidgetStorage } from '../../hooks/useWidgetStorage'

type TodoItem = {
  id: string
  text: string
  done: boolean
  createdAt: number
}

const INITIAL: TodoItem[] = []

export const TodoWidget = () => {
  const [items, setItems] = useWidgetStorage<TodoItem[]>('todo', INITIAL)
  const [input, setInput] = useState('')

  const remaining = useMemo(() => items.filter((item) => !item.done).length, [items])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    const newItem: TodoItem = {
      id: crypto.randomUUID(),
      text: trimmed,
      done: false,
      createdAt: Date.now(),
    }
    setItems((current) => [newItem, ...current])
    setInput('')
  }

  const toggleItem = (id: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))
  }

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  return (
    <div className="flex h-full flex-col">
      <form onSubmit={handleSubmit} className="grid gap-3">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground)]">Add Task</label>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Capture a quick task"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:brightness-110"
          >
            Add
          </button>
        </div>
      </form>

      <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-foreground)]/70">
        <span>{remaining} open</span>
        <button
          type="button"
          onClick={() => setItems((current) => current.filter((item) => !item.done))}
          className="text-[var(--color-foreground)]/60 hover:text-[var(--color-accent)]"
        >
          Clear Completed
        </button>
      </div>

      <ul className="mt-4 flex flex-1 flex-col gap-2 overflow-auto pr-1">
        {items.length === 0 ? (
          <li className="rounded-lg border border-dashed border-[var(--color-border)] px-3 py-6 text-center text-xs text-[var(--color-foreground)]/60">
            You are all caught up.
          </li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)]">
              <div className="flex items-start justify-between gap-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleItem(item.id)}
                    className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                  />
                  <span className={item.done ? 'line-through opacity-60' : ''}>{item.text}</span>
                </label>
                <button
                  type="button"
                  aria-label="Delete task"
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-[var(--color-foreground)]/50 transition hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
