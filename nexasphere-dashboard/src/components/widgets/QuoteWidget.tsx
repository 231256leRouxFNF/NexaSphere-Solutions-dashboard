import { useCallback, useEffect, useState } from 'react'
import { useWidgetStorage } from '../../hooks/useWidgetStorage'

type QuoteState = {
  content: string
  author: string
  fetchedAt: number
}

const INITIAL_QUOTE: QuoteState = {
  content: 'Small, consistent wins compound into meaningful progress.',
  author: 'NexaSphere Coach',
  fetchedAt: Date.now(),
}

export const QuoteWidget = () => {
  const [quote, setQuote] = useWidgetStorage<QuoteState>('quotes', INITIAL_QUOTE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuote = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://api.quotable.io/random?maxLength=120')
      if (!response.ok) {
        throw new Error('Failed to reach quote service')
      }
      const payload = await response.json()
      setQuote({
        content: payload.content ?? INITIAL_QUOTE.content,
        author: payload.author ?? 'Unknown',
        fetchedAt: Date.now(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [setQuote])

  useEffect(() => {
    const sixHours = 1000 * 60 * 60 * 6
    if (Date.now() - quote.fetchedAt > sixHours) {
      fetchQuote()
    }
  }, [fetchQuote, quote.fetchedAt])

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-foreground)]/60">Motivation Feed</p>
        <blockquote className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4 text-[var(--color-foreground)]">
          <p className="text-base font-medium leading-relaxed">"{quote.content}"</p>
          <footer className="mt-3 text-xs font-semibold tracking-[0.2em] text-[var(--color-foreground)]/70">{quote.author}</footer>
        </blockquote>
        {error ? <p className="mt-3 text-xs text-red-500">{error}</p> : null}
      </div>
      <button
        type="button"
        onClick={fetchQuote}
        disabled={loading}
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'New Quote'}
      </button>
    </div>
  )
}
