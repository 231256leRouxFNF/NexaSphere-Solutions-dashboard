import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'

function readValue<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return fallback
    return JSON.parse(stored) as T
  } catch (error) {
    console.warn(`Failed to parse widget storage for ${key}`, error)
    return fallback
  }
}

export function useWidgetStorage<T>(widgetKey: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const { user } = useAuth()
  const storageKey = useMemo(() => {
    const scope = user?.id ?? 'guest'
    return `nexasphere-widget-${scope}-${widgetKey}`
  }, [user?.id, widgetKey])

  const [value, setValue] = useState<T>(() => readValue(storageKey, initial))

  useEffect(() => {
    setValue(readValue(storageKey, initial))
  }, [storageKey, initial])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value))
    } catch (error) {
      console.warn(`Failed to write widget storage for ${storageKey}`, error)
    }
  }, [storageKey, value])

  const updateValue = (next: T | ((prev: T) => T)) => {
    setValue((current) => (typeof next === 'function' ? (next as (input: T) => T)(current) : next))
  }

  return [value, updateValue]
}
