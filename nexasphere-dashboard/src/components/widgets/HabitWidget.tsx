import { type FormEvent, useMemo, useState } from 'react'
import { addDays, eachDayOfInterval, format, startOfWeek } from 'date-fns'
import { useWidgetStorage } from '../../hooks/useWidgetStorage'

type Habit = {
  id: string
  name: string
  createdAt: string
}

type HabitState = {
  habits: Habit[]
  completions: Record<string, string[]>
}

const INITIAL_STATE: HabitState = {
  habits: [],
  completions: {},
}

export const HabitWidget = () => {
  const [state, setState] = useWidgetStorage<HabitState>('habits', INITIAL_STATE)
  const [input, setInput] = useState('')

  const weekKey = format(new Date(), 'yyyy-ww')
  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end: addDays(start, 6) })
  }, [weekKey])

  const handleAddHabit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    const habit: Habit = {
      id: crypto.randomUUID(),
      name: trimmed,
      createdAt: new Date().toISOString(),
    }
    setState((current) => ({
      habits: [...current.habits, habit],
      completions: { ...current.completions, [habit.id]: [] },
    }))
    setInput('')
  }

  const toggleCompletion = (habitId: string, date: string) => {
    setState((current) => {
      const existing = current.completions[habitId] ?? []
      const completed = existing.includes(date)
      const nextCompletions = {
        ...current.completions,
        [habitId]: completed ? existing.filter((item) => item !== date) : [...existing, date],
      }
      return {
        habits: current.habits,
        completions: nextCompletions,
      }
    })
  }

  const completionRate = (habitId: string) => {
    const marks = state.completions[habitId] ?? []
    const rangeKeys = weekDays.map((day) => format(day, 'yyyy-MM-dd'))
    const count = marks.filter((item) => rangeKeys.includes(item)).length
    return Math.round((count / rangeKeys.length) * 100)
  }

  return (
    <div className="flex h-full flex-col">
      <form onSubmit={handleAddHabit} className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Name a habit"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:brightness-110"
        >
          Add
        </button>
      </form>

      <div className="mt-4 overflow-auto">
        <table className="w-full min-w-[440px] border-collapse text-xs text-[var(--color-foreground)]">
          <thead>
            <tr>
              <th className="border-b border-[var(--color-border)] pb-2 text-left uppercase tracking-[0.16em]">Habit</th>
              {weekDays.map((day) => (
                <th key={day.toISOString()} className="border-b border-[var(--color-border)] pb-2 text-xs uppercase tracking-[0.16em] text-[var(--color-foreground)]/60">
                  {format(day, 'EEE')}
                </th>
              ))}
              <th className="border-b border-[var(--color-border)] pb-2 text-xs uppercase tracking-[0.16em] text-[var(--color-foreground)]/60">
                Week %
              </th>
            </tr>
          </thead>
          <tbody>
            {state.habits.length === 0 ? (
              <tr>
                <td colSpan={weekDays.length + 2} className="px-4 py-6 text-center text-[var(--color-foreground)]/60">
                  Add a habit to start building momentum.
                </td>
              </tr>
            ) : (
              state.habits.map((habit) => (
                <tr key={habit.id} className="border-b border-[var(--color-border)]/60 last:border-b-0">
                  <td className="py-3 text-sm font-semibold text-[var(--color-foreground)]">{habit.name}</td>
                  {weekDays.map((day) => {
                    const key = format(day, 'yyyy-MM-dd')
                    const completed = state.completions[habit.id]?.includes(key)
                    return (
                      <td key={key} className="py-2 text-center">
                        <button
                          type="button"
                          onClick={() => toggleCompletion(habit.id, key)}
                          className={`mx-auto block h-7 w-7 rounded-full border ${
                            completed
                              ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                              : 'border-[var(--color-border)] text-[var(--color-foreground)]/50'
                          }`}
                        >
                          {completed ? 'OK' : ''}
                        </button>
                      </td>
                    )
                  })}
                  <td className="py-2 text-center text-xs font-semibold text-[var(--color-foreground)]/70">{completionRate(habit.id)}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
