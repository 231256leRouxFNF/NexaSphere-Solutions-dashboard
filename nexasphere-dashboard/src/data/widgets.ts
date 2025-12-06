export const BREAKPOINTS = ['lg', 'md', 'sm', 'xs', 'xxs'] as const

export type Breakpoint = (typeof BREAKPOINTS)[number]

export type WidgetType =
  | 'clock'
  | 'quotes'
  | 'todo'
  | 'notes'
  | 'weather'
  | 'habits'
  | 'calendar'

export type WidgetDefinition = {
  type: WidgetType
  name: string
  description: string
  category: 'core' | 'advanced'
  minAuth: 'guest' | 'registered'
  icon: string
  layout: Record<Breakpoint, { w: number; h: number; minW?: number; minH?: number }>
}

const sharedSmall = { w: 2, h: 3, minW: 2, minH: 3 }

export const widgetLibrary: Record<WidgetType, WidgetDefinition> = {
  clock: {
    type: 'clock',
    name: 'Clock & Date',
    description: 'Stay anchored with real-time timekeeping.',
    category: 'core',
    minAuth: 'guest',
    icon: 'CLK',
    layout: {
      lg: { w: 3, h: 3, minW: 2, minH: 3 },
      md: { w: 3, h: 3, minW: 2, minH: 3 },
      sm: { w: 3, h: 3, minW: 2, minH: 3 },
      xs: sharedSmall,
      xxs: sharedSmall,
    },
  },
  quotes: {
    type: 'quotes',
    name: 'Motivation',
    description: 'Pull a quote to keep morale high.',
    category: 'core',
    minAuth: 'guest',
    icon: 'MOT',
    layout: {
      lg: { w: 4, h: 3, minW: 3, minH: 3 },
      md: { w: 4, h: 3, minW: 3, minH: 3 },
      sm: { w: 3, h: 3, minW: 3, minH: 3 },
      xs: { w: 3, h: 3, minW: 2, minH: 3 },
      xxs: sharedSmall,
    },
  },
  todo: {
    type: 'todo',
    name: 'To-Do List',
    description: 'Organise action items with quick capture.',
    category: 'core',
    minAuth: 'guest',
    icon: 'TODO',
    layout: {
      lg: { w: 4, h: 4, minW: 3, minH: 3 },
      md: { w: 4, h: 4, minW: 3, minH: 3 },
      sm: { w: 3, h: 4, minW: 3, minH: 3 },
      xs: { w: 3, h: 4, minW: 2, minH: 3 },
      xxs: { w: 2, h: 4, minW: 2, minH: 3 },
    },
  },
  notes: {
    type: 'notes',
    name: 'Notes Pad',
    description: 'Capture free-form thoughts or meeting notes.',
    category: 'core',
    minAuth: 'guest',
    icon: 'NOTE',
    layout: {
      lg: { w: 4, h: 4, minW: 3, minH: 3 },
      md: { w: 4, h: 4, minW: 3, minH: 3 },
      sm: { w: 3, h: 4, minW: 3, minH: 3 },
      xs: { w: 3, h: 4, minW: 2, minH: 3 },
      xxs: { w: 2, h: 4, minW: 2, minH: 3 },
    },
  },
  weather: {
    type: 'weather',
    name: 'Weather',
    description: 'Forecast powered by Open-Meteo with quick city lookup.',
    category: 'advanced',
    minAuth: 'registered',
    icon: 'WX',
    layout: {
      lg: { w: 4, h: 4, minW: 3, minH: 3 },
      md: { w: 4, h: 4, minW: 3, minH: 3 },
      sm: { w: 3, h: 4, minW: 3, minH: 3 },
      xs: { w: 3, h: 4, minW: 2, minH: 3 },
      xxs: { w: 2, h: 4, minW: 2, minH: 3 },
    },
  },
  habits: {
    type: 'habits',
    name: 'Habit Tracker',
    description: 'Build streaks with lightweight daily tracking.',
    category: 'advanced',
    minAuth: 'registered',
    icon: 'HAB',
    layout: {
      lg: { w: 4, h: 4, minW: 3, minH: 3 },
      md: { w: 4, h: 4, minW: 3, minH: 3 },
      sm: { w: 3, h: 4, minW: 3, minH: 3 },
      xs: { w: 3, h: 4, minW: 2, minH: 3 },
      xxs: { w: 2, h: 4, minW: 2, minH: 3 },
    },
  },
  calendar: {
    type: 'calendar',
    name: 'Calendar',
    description: 'Glance upcoming events and add quick reminders.',
    category: 'advanced',
    minAuth: 'registered',
    icon: 'CAL',
    layout: {
      lg: { w: 6, h: 5, minW: 4, minH: 4 },
      md: { w: 5, h: 5, minW: 4, minH: 4 },
      sm: { w: 4, h: 5, minW: 3, minH: 4 },
      xs: { w: 4, h: 5, minW: 2, minH: 4 },
      xxs: { w: 2, h: 5, minW: 2, minH: 4 },
    },
  },
}

export const widgetList = Object.values(widgetLibrary)

export const DEFAULT_WIDGETS: WidgetType[] = ['clock', 'quotes', 'todo', 'notes']
