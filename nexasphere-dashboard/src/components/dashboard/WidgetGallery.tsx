import { widgetList, type WidgetType } from '../../data/widgets'

export type WidgetGalleryProps = {
  activeWidgets: WidgetType[]
  isGuest: boolean
  onAdd: (type: WidgetType) => void
}

export const WidgetGallery = ({ activeWidgets, isGuest, onAdd }: WidgetGalleryProps) => {
  return (
    <div className="grid gap-3">
      <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground)]/70">Widget Gallery</h4>
      <div className="grid gap-3 md:grid-cols-2">
        {widgetList.map((widget) => {
          const added = activeWidgets.includes(widget.type)
          const locked = isGuest && widget.minAuth === 'registered'
          return (
            <article
              key={widget.type}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 text-sm text-[var(--color-foreground)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-foreground)]/60">{widget.icon}</p>
                  <h5 className="mt-1 text-sm font-semibold text-[var(--color-foreground)]">{widget.name}</h5>
                </div>
                <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-foreground)]/60">
                  {widget.category === 'core' ? 'Core' : 'Advanced'}
                </span>
              </div>
              <p className="mt-3 text-xs text-[var(--color-foreground)]/70">{widget.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.16em]">
                {locked ? (
                  <span className="text-[var(--color-accent)]">Unlock with account</span>
                ) : added ? (
                  <span className="text-[var(--color-foreground)]/60">Already added</span>
                ) : (
                  <span className="text-[var(--color-foreground)]/40">Available</span>
                )}
                <button
                  type="button"
                  disabled={locked || added}
                  onClick={() => onAdd(widget.type)}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-foreground)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
                >
                  {locked ? 'Locked' : added ? 'Added' : 'Add Widget'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
