import { type FormEvent, useCallback, useMemo, useState } from 'react'
import { useWidgetStorage } from '../../hooks/useWidgetStorage'

type ForecastDay = {
  date: string
  max: number
  min: number
  precip: number
}

type WeatherSnapshot = {
  query: string
  label: string
  latitude: number
  longitude: number
  fetchedAt: number
  current: {
    temperature: number
    apparent: number
    humidity: number
  }
  forecast: ForecastDay[]
}

const INITIAL_STATE: WeatherSnapshot = {
  query: 'Cape Town',
  label: 'Cape Town, South Africa',
  latitude: -33.92,
  longitude: 18.42,
  fetchedAt: 0,
  current: {
    temperature: 0,
    apparent: 0,
    humidity: 0,
  },
  forecast: [],
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useWidgetStorage<WeatherSnapshot>('weather', INITIAL_STATE)
  const [query, setQuery] = useState(weather.query)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formattedUpdatedAt = useMemo(() => {
    if (!weather.fetchedAt) return 'No data yet'
    return new Date(weather.fetchedAt).toLocaleString()
  }, [weather.fetchedAt])

  const fetchWeather = useCallback(
    async (search: string) => {
      const trimmed = search.trim()
      if (!trimmed) {
        setError('Please provide a city name')
        return
      }
      setLoading(true)
      setError(null)
      try {
        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`,
        )
        if (!geoResponse.ok) {
          throw new Error('Could not look up that location')
        }
        const geoPayload = await geoResponse.json()
        if (!geoPayload.results?.length) {
          throw new Error('Location not found. Try a nearby city.')
        }
        const location = geoPayload.results[0]
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=4&timezone=auto`,
        )
        if (!weatherResponse.ok) {
          throw new Error('Failed to get the forecast')
        }
        const weatherPayload = await weatherResponse.json()
        const nextForecast: ForecastDay[] = (weatherPayload.daily?.time ?? []).map((day: string, index: number) => ({
          date: day,
          max: weatherPayload.daily.temperature_2m_max?.[index] ?? 0,
          min: weatherPayload.daily.temperature_2m_min?.[index] ?? 0,
          precip: weatherPayload.daily.precipitation_probability_max?.[index] ?? 0,
        }))
        setWeather({
          query: trimmed,
          label: `${location.name}, ${location.country}`,
          latitude: location.latitude,
          longitude: location.longitude,
          fetchedAt: Date.now(),
          current: {
            temperature: weatherPayload.current?.temperature_2m ?? 0,
            apparent: weatherPayload.current?.apparent_temperature ?? 0,
            humidity: weatherPayload.current?.relative_humidity_2m ?? 0,
          },
          forecast: nextForecast,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load weather data')
      } finally {
        setLoading(false)
      }
    },
    [setWeather],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    fetchWeather(query)
  }

  return (
    <div className="flex h-full flex-col">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search city"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Loading' : 'Fetch'}
        </button>
      </form>

      <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-center justify-between text-sm text-[var(--color-foreground)]/70">
          <span className="font-semibold text-[var(--color-foreground)]">{weather.label}</span>
          <span>Updated {formattedUpdatedAt}</span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6 text-[var(--color-foreground)]">
          <div>
            <p className="text-4xl font-semibold">{Math.round(weather.current.temperature)} C</p>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-foreground)]/60">Feels {Math.round(weather.current.apparent)} C</p>
          </div>
          <div className="space-y-2 text-xs text-[var(--color-foreground)]/70">
            <p>Humidity {Math.round(weather.current.humidity)}%</p>
            <p>
              Lat {weather.latitude.toFixed(2)} | Lon {weather.longitude.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {error ? <p className="mt-3 text-xs text-red-500">{error}</p> : null}

      <div className="mt-4 grid gap-3 text-sm text-[var(--color-foreground)] sm:grid-cols-2">
        {weather.forecast.slice(0, 4).map((day) => {
          const date = new Date(day.date)
          return (
            <div key={day.date} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-foreground)]/60">
                {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="mt-2 text-lg font-semibold">
                {Math.round(day.max)} C / {Math.round(day.min)} C
              </p>
              <p className="text-xs text-[var(--color-foreground)]/60">Rain chance {Math.round(day.precip)}%</p>
            </div>
          )
        })}
        {weather.forecast.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--color-border)] px-3 py-6 text-center text-xs text-[var(--color-foreground)]/60">
            Request a forecast to populate this view.
          </div>
        ) : null}
      </div>
    </div>
  )
}
