import { type FormEvent, useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { useWidgetStorage } from '../../hooks/useWidgetStorage'

type CalendarEvent = {
  id: string
  title: string
  date: string
  time?: string
  createdAt: number
}

type CalendarState = {
  events: CalendarEvent[]
}

const INITIAL_STATE: CalendarState = {
  events: [],
}

const formatDisplayDate = (value: string) => {
  try {
    return format(parseISO(value), 'EEE, d MMM')
  } catch (error) {
    return value
  }
}

export const CalendarWidget = () => {
  const [state, setState] = useWidgetStorage<CalendarState>('calendar', INITIAL_STATE)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [form, setForm] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
  })

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const eventsByDay = useMemo(() => {
    return state.events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
      const key = event.date
      acc[key] = acc[key] ? [...acc[key], event] : [event]
      return acc
    }, {})
  }, [state.events])

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return [...state.events]
      .filter((event) => {
        try {
          return !isAfter(now, parseISO(event.date))
        } catch (error) {
          return false
        }
      })
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .slice(0, 5)
  }, [state.events])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = form.title.trim()
    if (!trimmedTitle) return
    const calendarEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      date: form.date,
      time: form.time?.trim() || undefined,
      createdAt: Date.now(),
    }
    setState((current) => ({ events: [...current.events, calendarEvent] }))
    setForm((current) => ({ ...current, title: '' }))
  }

  const removeEvent = (id: string) => {
    setState((current) => ({ events: current.events.filter((event) => event.id !== id) }))
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-foreground)]/60">Month Overview</p>
          <h4 className="text-lg font-semibold text-[var(--color-foreground)]">{format(currentMonth, 'MMMM yyyy')}</h4>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground)]"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date())}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground)]"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground)]"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs text-[var(--color-foreground)]/70">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => (
          <div key={label} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2 text-center font-semibold">
            {label}
          </div>
        ))}
        {calendarDays.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const dayEvents = eventsByDay[key] ?? []
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isToday = isSameDay(day, new Date())
          return (
            <div
              key={key}
              className={`min-h-[84px] rounded-lg border px-2 py-2 ${
                isCurrentMonth
                  ? 'border-[var(--color-border)] bg-[var(--color-surface)]'
                  : 'border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/60'
              } ${isToday ? 'ring-1 ring-[var(--color-accent)]' : ''}`}
            >
              <div className="flex items-center justify-between text-[var(--color-foreground)]">
                <span className="text-xs font-semibold">{format(day, 'd')}</span>
                {dayEvents.length ? (
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                    {dayEvents.length}x
                  </span>
                ) : null}
              </div>
              <ul className="mt-2 space-y-1">
                {dayEvents.slice(0, 3).map((calendarEvent) => (
                  <li
                    key={calendarEvent.id}
                    className="overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-1 py-1 text-[10px] text-[var(--color-foreground)]"
                  >
                    <p className="truncate font-semibold">{calendarEvent.title}</p>
                    {calendarEvent.time ? <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--color-foreground)]/60">{calendarEvent.time}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="grid gap-3 text-sm text-[var(--color-foreground)] lg:grid-cols-[2fr,3fr]">
        <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground)]/70">Add Event</h5>
          <div className="mt-3 grid gap-3">
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Event name"
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none"
              />
              <input
                type="time"
                value={form.time}
                onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:brightness-110"
            >
              Save Event
            </button>
          </div>
        </form>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground)]/70">Upcoming</h5>
          <ul className="mt-3 space-y-3">
            {upcomingEvents.length === 0 ? (
              <li className="rounded-lg border border-dashed border-[var(--color-border)] px-3 py-6 text-center text-xs text-[var(--color-foreground)]/60">
                Nothing scheduled. Add an event to populate this feed.
              </li>
            ) : (
              upcomingEvents.map((calendarEvent) => (
                <li key={calendarEvent.id} className="flex items-start justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">{calendarEvent.title}</p>
                    <p className="text-xs text-[var(--color-foreground)]/60">
                      {formatDisplayDate(calendarEvent.date)}
                      {calendarEvent.time ? ` at ${calendarEvent.time}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEvent(calendarEvent.id)}
                    className="text-xs uppercase tracking-[0.16em] text-[var(--color-foreground)]/50 hover:text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
