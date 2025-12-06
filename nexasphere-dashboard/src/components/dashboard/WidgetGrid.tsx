import { type JSX } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import type { Layout, Layouts } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { WidgetShell } from './WidgetShell'
import { widgetLibrary, type WidgetType } from '../../data/widgets'
import { ClockWidget } from '../widgets/ClockWidget'
import { QuoteWidget } from '../widgets/QuoteWidget'
import { TodoWidget } from '../widgets/TodoWidget'
import { NotesWidget } from '../widgets/NotesWidget'
import { WeatherWidget } from '../widgets/WeatherWidget'
import { HabitWidget } from '../widgets/HabitWidget'
import { CalendarWidget } from '../widgets/CalendarWidget'

const ResponsiveGridLayout = WidthProvider(Responsive)

const BREAKPOINTS = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 580,
  xxs: 0,
}

const COLS = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2,
}

export type WidgetGridProps = {
  widgets: WidgetType[]
  layouts: Layouts
  onLayoutChange: (next: Layouts) => void
  onRemove: (type: WidgetType) => void
  isGuest: boolean
}

const widgetComponents: Record<WidgetType, () => JSX.Element> = {
  clock: ClockWidget,
  quotes: QuoteWidget,
  todo: TodoWidget,
  notes: NotesWidget,
  weather: WeatherWidget,
  habits: HabitWidget,
  calendar: CalendarWidget,
}

export const WidgetGrid = ({ widgets, layouts, onLayoutChange, onRemove, isGuest }: WidgetGridProps) => {
  const handleLayoutChange = (_current: Layout[], allLayouts: Layouts) => {
    onLayoutChange(allLayouts)
  }

  if (!widgets.length) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20 text-center text-sm text-[var(--color-foreground)]/60">
        No widgets on the dashboard yet. Add one from the gallery to get started.
      </div>
    )
  }

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={BREAKPOINTS}
      cols={COLS}
      rowHeight={36}
      margin={[16, 16]}
      containerPadding={[0, 16]}
      onLayoutChange={handleLayoutChange}
      draggableHandle="header"
    >
      {widgets.map((widgetType) => {
        const definition = widgetLibrary[widgetType]
        const badge = definition.minAuth === 'registered' ? 'Pro' : 'Core'
        const secondary = isGuest && definition.minAuth === 'registered' ? 'Sign in to use this widget.' : undefined
        const Component = widgetComponents[widgetType]
        return (
          <div key={widgetType}>
            <WidgetShell
              title={definition.name}
              badge={badge}
              secondaryText={secondary}
              onRemove={() => onRemove(widgetType)}
            >
              {isGuest && definition.minAuth === 'registered' ? (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/60 p-6 text-center text-sm text-[var(--color-foreground)]/60">
                  Create a free NexaSphere account to unlock this advanced widget.
                </div>
              ) : (
                <Component />
              )}
            </WidgetShell>
          </div>
        )
      })}
    </ResponsiveGridLayout>
  )
}
