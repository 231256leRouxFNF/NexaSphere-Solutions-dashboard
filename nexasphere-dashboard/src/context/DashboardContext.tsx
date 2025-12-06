import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Layout, Layouts } from 'react-grid-layout'
import { BREAKPOINTS, DEFAULT_WIDGETS, type Breakpoint, type WidgetType, widgetLibrary } from '../data/widgets'
import { useAuth } from './AuthContext'

const STORAGE_PREFIX = 'nexasphere-dashboard-'

export type DashboardContextValue = {
  widgets: WidgetType[]
  layouts: Layouts
  addWidget: (type: WidgetType) => void
  removeWidget: (type: WidgetType) => void
  setLayouts: (value: Layouts) => void
  resetDashboard: () => void
}

type DashboardState = {
  widgets: WidgetType[]
  layouts: Layouts
}

function emptyLayouts(): Layouts {
  return BREAKPOINTS.reduce((acc, key) => {
    acc[key] = []
    return acc
  }, {} as Layouts)
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined)

function createLayoutEntries(types: WidgetType[]): Layouts {
  const layouts = emptyLayouts()

  const yPositions: Record<Breakpoint, number> = BREAKPOINTS.reduce((acc, key) => {
    acc[key] = 0
    return acc
  }, {} as Record<Breakpoint, number>)

  types.forEach((type) => {
    const definition = widgetLibrary[type]
    BREAKPOINTS.forEach((bp) => {
      const config = definition.layout[bp]
      const nextLayout: Layout = {
        i: type,
        x: 0,
        y: yPositions[bp],
        w: config.w,
        h: config.h,
        minW: config.minW,
        minH: config.minH,
        static: false,
      }
      layouts[bp] = [...layouts[bp], nextLayout]
      yPositions[bp] += config.h + 1
    })
  })

  return layouts
}

function cloneLayouts(layouts: Layouts): Layouts {
  const copy = emptyLayouts()
  BREAKPOINTS.forEach((bp) => {
    const entries: Layout[] = layouts[bp] ?? []
    copy[bp] = entries.map((entry) => ({ ...entry }))
  })
  return copy
}

function createDefaultState(): DashboardState {
  return {
    widgets: DEFAULT_WIDGETS,
    layouts: createLayoutEntries(DEFAULT_WIDGETS),
  }
}

function readState(userId: string): DashboardState {
  try {
    const value = localStorage.getItem(`${STORAGE_PREFIX}${userId}`)
    if (!value) {
      return createDefaultState()
    }
    const parsed = JSON.parse(value) as DashboardState
    if (!parsed?.widgets || !parsed?.layouts) {
      return createDefaultState()
    }
    const safeWidgets = parsed.widgets.filter((type): type is WidgetType => Boolean(widgetLibrary[type as WidgetType]))
    const baseLayouts = emptyLayouts()
    const restoredLayouts = Object.keys(parsed.layouts ?? {}).reduce((acc, key) => {
      const typedKey = key as Breakpoint
      if (BREAKPOINTS.includes(typedKey) && Array.isArray(parsed.layouts?.[typedKey])) {
        acc[typedKey] = (parsed.layouts?.[typedKey] as Layout[]).map((item) => ({ ...item }))
      }
      return acc
    }, baseLayouts)
    return {
      widgets: safeWidgets,
      layouts: restoredLayouts,
    }
  } catch (error) {
    console.warn('Failed to load stored dashboard state', error)
    return createDefaultState()
  }
}

function persistState(userId: string, state: DashboardState) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to persist dashboard state', error)
  }
}

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const userId = user?.id ?? 'guest'
  const [state, setState] = useState<DashboardState>(() => readState(userId))

  useEffect(() => {
    setState(readState(userId))
  }, [userId])

  useEffect(() => {
    persistState(userId, state)
  }, [state, userId])

  const value = useMemo<DashboardContextValue>(() => {
    const addWidget = (type: WidgetType) => {
      setState((current) => {
        if (current.widgets.includes(type)) {
          return current
        }
        const definition = widgetLibrary[type]
        const nextLayouts = cloneLayouts(current.layouts)
        BREAKPOINTS.forEach((bp) => {
          const config = definition.layout[bp]
          const existing: Layout[] = nextLayouts[bp] ?? []
          const nextY = existing.reduce((accumulator: number, entry: Layout) => Math.max(accumulator, entry.y + entry.h), 0)
          const entry: Layout = {
            i: type,
            x: 0,
            y: nextY,
            w: config.w,
            h: config.h,
            minW: config.minW,
            minH: config.minH,
            static: false,
          }
          nextLayouts[bp] = [...existing, entry]
        })
        return {
          widgets: [...current.widgets, type],
          layouts: nextLayouts,
        }
      })
    }

    const removeWidget = (type: WidgetType) => {
      setState((current) => {
        if (!current.widgets.includes(type)) {
          return current
        }
        const nextLayouts = cloneLayouts(current.layouts)
        BREAKPOINTS.forEach((bp) => {
          const existing: Layout[] = nextLayouts[bp] ?? []
          nextLayouts[bp] = existing.filter((entry) => entry.i !== type)
        })
        return {
          widgets: current.widgets.filter((item) => item !== type),
          layouts: nextLayouts,
        }
      })
    }

    const setLayouts = (value: Layouts) => {
      setState((current) => ({
        widgets: current.widgets,
        layouts: cloneLayouts(value),
      }))
    }

    const resetDashboard = () => {
      setState(createDefaultState())
    }

    return {
      widgets: state.widgets,
      layouts: state.layouts,
      addWidget,
      removeWidget,
      setLayouts,
      resetDashboard,
    }
  }, [state.layouts, state.widgets])

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used inside a DashboardProvider')
  }
  return context
}
