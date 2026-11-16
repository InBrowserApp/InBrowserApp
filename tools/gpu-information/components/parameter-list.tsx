import type { GpuMessages, GraphicsParameter, ParameterValue } from "../types"

function formatValue(value: ParameterValue, messages: GpuMessages) {
  if (value === null) return messages.notReported
  if (typeof value === "boolean") return value ? messages.yes : messages.no
  return Array.isArray(value) ? value.join(" × ") : String(value)
}

function ParameterList({
  entries,
  messages,
}: Readonly<{
  entries: readonly GraphicsParameter[]
  messages: GpuMessages
}>) {
  return (
    <dl className="divide-y">
      {entries.map(({ name, value }) => (
        <div
          key={name}
          className="grid min-w-0 gap-1 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] sm:gap-4"
        >
          <dt className="min-w-0 font-mono text-xs [overflow-wrap:anywhere] text-muted-foreground">
            {name}
          </dt>
          <dd
            className="min-w-0 font-mono text-xs [overflow-wrap:anywhere] tabular-nums"
            dir="ltr"
          >
            {formatValue(value, messages)}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export { ParameterList }
