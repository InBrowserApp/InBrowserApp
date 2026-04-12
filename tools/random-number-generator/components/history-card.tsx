import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { HistoryEntry, RandomNumberGeneratorMessages } from "../types"

type HistoryCardProps = Readonly<{
  messages: RandomNumberGeneratorMessages
  historyEntries: readonly HistoryEntry[]
  onClearHistory: () => void
}>

function HistoryCard({
  messages,
  historyEntries,
  onClearHistory,
}: HistoryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b">
        <CardTitle>{messages.historyTitle}</CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={historyEntries.length === 0}
          onClick={onClearHistory}
        >
          {messages.clearHistoryLabel}
        </Button>
      </CardHeader>
      <CardContent>
        {historyEntries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
            {messages.historyEmptyLabel}
          </div>
        ) : (
          <div className="space-y-3">
            {historyEntries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border bg-muted/20 px-4 py-3"
              >
                <div className="flex flex-wrap gap-2">
                  {entry.values.map((value, index) => (
                    <span
                      key={`${entry.id}-${index}`}
                      className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-border bg-background px-3 py-1.5 text-lg font-semibold shadow-xs"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { HistoryCard }
