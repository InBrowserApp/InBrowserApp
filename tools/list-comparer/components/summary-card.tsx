import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { ListComparisonResult } from "../core/compare-lists"
import type { ListComparerLocalizedCatalog } from "../types"

type SummaryCardProps = Readonly<{
  messages: ListComparerLocalizedCatalog
  comparison: ListComparisonResult
}>

function SummaryCard({ messages, comparison }: SummaryCardProps) {
  const metrics = [
    {
      label: messages.sharedLabel,
      value: comparison.sharedItems.length,
    },
    {
      label: messages.leftOnlyLabel,
      value: comparison.leftOnlyItems.length,
    },
    {
      label: messages.rightOnlyLabel,
      value: comparison.rightOnlyItems.length,
    },
    {
      label: messages.allUniqueLabel,
      value: comparison.allUniqueItems.length,
    },
    {
      label: messages.leftDuplicatesLabel,
      value: comparison.left.duplicateItems.length,
    },
    {
      label: messages.rightDuplicatesLabel,
      value: comparison.right.duplicateItems.length,
    },
  ] as const

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.summaryTitle}</CardTitle>
        <CardDescription>{messages.summaryDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-border/80 bg-muted/30 p-4"
          >
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {metric.value}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export { SummaryCard }
