import type { ReactNode } from "react"

type StickPlotProps = {
  label: string
  x: number
  y: number
  offset: number
  offsetLabel: string
  format: Intl.NumberFormat
  children?: ReactNode
}

export function StickPlot({
  label,
  x,
  y,
  offset,
  offsetLabel,
  format,
  children,
}: StickPlotProps) {
  return (
    <figure className="flex min-w-0 flex-col items-center gap-2 rounded-lg border bg-background px-2 py-3 text-center sm:px-4">
      <figcaption className="text-sm font-medium">{label}</figcaption>
      <div
        aria-hidden="true"
        className="relative aspect-square w-full max-w-36 rounded-md bg-muted/50"
      >
        <div className="absolute inset-2">
          <div className="absolute inset-0 rounded-full border border-border" />
          <div className="absolute inset-1/4 rounded-full border border-border" />
          <div className="absolute inset-x-0 top-1/2 border-t border-border" />
          <div className="absolute inset-y-0 left-1/2 border-l border-border" />
          <div
            className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-background"
            style={{ left: `${(x + 1) * 50}%`, top: `${(y + 1) * 50}%` }}
          />
        </div>
      </div>
      <dl className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs">
        <div className="flex items-baseline gap-1">
          <dt className="text-muted-foreground">X</dt>
          <dd className="font-mono tabular-nums">
            <bdi>{format.format(x)}</bdi>
          </dd>
        </div>
        <div className="flex items-baseline gap-1">
          <dt className="text-muted-foreground">Y</dt>
          <dd className="font-mono tabular-nums">
            <bdi>{format.format(y)}</bdi>
          </dd>
        </div>
      </dl>
      <dl className="flex flex-wrap justify-center gap-x-2 text-xs">
        <dt className="text-muted-foreground">{offsetLabel}</dt>
        <dd className="font-mono tabular-nums">
          <bdi>{format.format(offset)}</bdi>
        </dd>
      </dl>
      {children}
    </figure>
  )
}
