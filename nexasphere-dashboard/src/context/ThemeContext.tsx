import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ThemeName = 'light' | 'dark' | 'custom'

export type ThemePalette = {
  surface: string
  surfaceMuted: string
  foreground: string
  accent: string
  border: string
}

type ThemeContextValue = {
  theme: ThemeName
  palette: ThemePalette
  setTheme: (value: ThemeName) => void
  updatePalette: (value: Partial<ThemePalette>) => void
  toggleTheme: () => void
}

const THEME_KEY = 'nexasphere-theme'

const LIGHT_THEME: ThemePalette = {
  surface: '#f4f6fb',
  surfaceMuted: '#ffffff',
  foreground: '#0f172a',
  accent: '#2563eb',
  border: '#d0d7f0',
}

const DARK_THEME: ThemePalette = {
  surface: '#0b1220',
  surfaceMuted: '#111b2f',
  foreground: '#f8fafc',
  accent: '#38bdf8',
  border: '#1f2a44',
}

type StoredTheme = {
  theme: ThemeName
  palette: ThemePalette
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function readTheme(): StoredTheme {
  try {
    const value = localStorage.getItem(THEME_KEY)
    if (!value) {
      return { theme: 'dark', palette: DARK_THEME }
    }
    const parsed = JSON.parse(value) as StoredTheme
    if (!parsed?.palette) {
      return {
        theme: parsed?.theme ?? 'dark',
        palette: parsed?.theme === 'light' ? LIGHT_THEME : DARK_THEME,
      }
    }
    return parsed
  } catch (error) {
    console.warn('Failed to parse stored theme', error)
    return { theme: 'dark', palette: DARK_THEME }
  }
}

function applyTheme(theme: ThemeName, palette: ThemePalette) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.setProperty('--color-surface', palette.surface)
  root.style.setProperty('--color-surface-muted', palette.surfaceMuted)
  root.style.setProperty('--color-foreground', palette.foreground)
  root.style.setProperty('--color-accent', palette.accent)
  root.style.setProperty('--color-border', palette.border)
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [{ theme: storedTheme, palette: storedPalette }, setStored] = useState<StoredTheme>(() => readTheme())

  useEffect(() => {
    applyTheme(storedTheme, storedPalette)
    localStorage.setItem(THEME_KEY, JSON.stringify({ theme: storedTheme, palette: storedPalette }))
  }, [storedPalette, storedTheme])

  const value = useMemo<ThemeContextValue>(() => {
    const setTheme = (value: ThemeName) => {
      if (value === 'custom') {
        setStored((current) => ({ ...current, theme: 'custom' }))
        return
      }
      const palette = value === 'light' ? LIGHT_THEME : DARK_THEME
      setStored({ theme: value, palette })
    }

    const updatePalette = (value: Partial<ThemePalette>) => {
      setStored((current) => ({
        theme: 'custom',
        palette: { ...current.palette, ...value },
      }))
    }

    const toggleTheme = () => {
      setTheme(storedTheme === 'dark' ? 'light' : 'dark')
    }

    return {
      theme: storedTheme,
      palette: storedPalette,
      setTheme,
      updatePalette,
      toggleTheme,
    }
  }, [storedPalette, storedTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider')
  }
  return context
}
