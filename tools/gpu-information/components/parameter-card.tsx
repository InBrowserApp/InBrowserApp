import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { GpuMessages, GraphicsParameter, ParameterValue } from "../types"

function formatValue(
  name: string,
  value: ParameterValue,
  messages: GpuMessages
) {
  if (value === null) return messages.notReported
  if (typeof value === "boolean") return value ? messages.yes : messages.no
  return Array.isArray(value)
    ? value.join(name === "MAX_VIEWPORT_DIMS" ? " × " : " … ")
    : String(value)
}

function ParameterList({
  entries,
  messages,
  compact = false,
}: Readonly<{
  entries: readonly GraphicsParameter[]
  messages: GpuMessages
  compact?: boolean
}>) {
  return (
    <dl className="divide-y">
      {entries.map(({ name, value }) => (
        <div
          key={name}
          className={`grid min-w-0 gap-1 px-4 py-3 sm:gap-4 ${compact ? "sm:grid-cols-[minmax(0,3fr)_minmax(4rem,1fr)]" : "sm:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]"}`}
        >
          <dt className="min-w-0 font-mono text-xs [overflow-wrap:anywhere] text-muted-foreground">
            {name.split("_").map((part, index, parts) => (
              <span key={`${index}-${part}`}>
                {part}
                {index < parts.length - 1 ? (
                  <>
                    _<wbr />
                  </>
                ) : null}
              </span>
            ))}
          </dt>
          <dd
            className="min-w-0 font-mono text-xs [overflow-wrap:anywhere] tabular-nums"
            dir="ltr"
          >
            {formatValue(name, value, messages)}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function ParameterCard({
  title,
  description,
  entries,
  messages,
  compact,
  collapsible = false,
}: Readonly<{
  title: string
  description: string
  entries: readonly GraphicsParameter[]
  messages: GpuMessages
  compact?: boolean
  collapsible?: boolean
}>) {
  const content = entries.length ? (
    <ParameterList entries={entries} messages={messages} compact={compact} />
  ) : (
    <p className="p-4 text-sm text-muted-foreground">{messages.notReported}</p>
  )

  if (collapsible) {
    return (
      <Card className="gap-0 overflow-hidden py-0">
        <details>
          <summary className="cursor-pointer p-4 marker:text-muted-foreground hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-ring">
            <h2 className="ms-1 inline text-sm font-medium">{title}</h2>
          </summary>
          <div className="border-t">
            <p className="px-4 pt-4 text-sm text-muted-foreground">
              {description}
            </p>
            {content}
          </div>
        </details>
      </Card>
    )
  }

  return (
    <Card className="gap-0 overflow-hidden pb-0">
      <CardHeader className="border-b pb-4">
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">{content}</CardContent>
    </Card>
  )
}

export { ParameterCard }
