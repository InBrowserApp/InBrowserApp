import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { DiffStats } from "../core/text-diff"
import type { TextDiffMessages } from "../types"

type DiffSummaryCardProps = Readonly<{
  messages: TextDiffMessages
  stats: DiffStats
}>

function DiffSummaryCard({ messages, stats }: DiffSummaryCardProps) {
  const metrics = [
    {
      label: messages.unchangedLabel,
      value: stats.unchanged,
      className:
        "border-border/70 bg-background text-foreground dark:bg-background/70",
    },
    {
      label: messages.changedLabel,
      value: stats.changed,
      className:
        "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100",
    },
    {
      label: messages.addedLabel,
      value: stats.added,
      className:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
    },
    {
      label: messages.removedLabel,
      value: stats.removed,
      className:
        "border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-100",
    },
  ] as const

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.summaryTitle}</CardTitle>
        <CardDescription>{messages.summaryDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`rounded-xl border p-4 ${metric.className}`}
          >
            <div className="text-sm font-medium">{metric.label}</div>
            <div className="mt-2 font-heading text-3xl tracking-tight">
              {metric.value}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export { DiffSummaryCard }
