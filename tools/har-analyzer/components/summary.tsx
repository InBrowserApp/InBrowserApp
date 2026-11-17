import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/ui/card"
import { formatBytes, formatTime, isFailure } from "../core/analysis"
import type { Capture, Messages } from "../types"

export function Summary({
  capture,
  messages: m,
  lang,
}: {
  capture: Capture
  messages: Messages
  lang: string
}) {
  let transferred = 0
  let knownSizes = 0
  let failures = 0
  for (const item of capture.entries) {
    if (isFailure(item)) failures++
    if (item.transferSize !== null) {
      transferred += item.transferSize
      knownSizes++
    }
  }
  const values = [
    [m.requests, new Intl.NumberFormat(lang).format(capture.entries.length)],
    [m.failures, new Intl.NumberFormat(lang).format(failures)],
    [
      m.transferred,
      formatBytes(knownSizes ? transferred : null, lang, m.unknown),
    ],
    [m.duration, formatTime(capture.span, lang, m.unknown)],
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {values.map(([label, value]) => (
          <Card key={label} size="sm">
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle>
                <span className="text-xl tabular-nums sm:text-2xl">
                  {value}
                </span>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {m.summaryNote}
      </p>
    </div>
  )
}
