import { useEffect, useState } from 'react'

type Setter<T> = T | ((value: T) => T)

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: Setter<T>) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const existing = localStorage.getItem(key)
      if (existing === null) {
        return defaultValue
      }
      return JSON.parse(existing) as T
    } catch (error) {
      console.warn(`Failed to read localStorage key ${key}`, error)
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.warn(`Failed to write localStorage key ${key}`, error)
    }
  }, [key, state])

  const setValue = (value: Setter<T>) => {
    setState((current) => (typeof value === 'function' ? (value as (input: T) => T)(current) : value))
  }

  return [state, setValue]
}
