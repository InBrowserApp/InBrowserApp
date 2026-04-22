import type { UrlParserBuilderMessages } from "../types"

type UrlMetricsProps = Readonly<{
  messages: UrlParserBuilderMessages
  origin: string
  host: string
  pathSegments: number
  queryCount: number
}>

function UrlMetrics({
  messages,
  origin,
  host,
  pathSegments,
  queryCount,
}: UrlMetricsProps) {
  const items = [
    { label: messages.originLabel, value: origin },
    { label: messages.hostLabel, value: host },
    { label: messages.segmentsLabel, value: String(pathSegments) },
    { label: messages.paramsLabel, value: String(queryCount) },
  ] as const

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border/70 bg-muted/25 px-4 py-3"
        >
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {item.label}
          </p>
          <p className="mt-2 font-mono text-sm break-all text-foreground">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
}

export { UrlMetrics }
