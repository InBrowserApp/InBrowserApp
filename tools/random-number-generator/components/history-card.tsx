import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"
import { Trash2 } from "@workspace/ui/icons"

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
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.historyTitle}</CardTitle>
        <CardDescription>{messages.historyDescription}</CardDescription>
        <CardAction>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={historyEntries.length === 0}
            onClick={onClearHistory}
          >
            <Trash2 data-icon="inline-start" />
            {messages.clearHistoryLabel}
          </Button>
        </CardAction>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {historyEntries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
            {messages.historyEmptyLabel}
          </div>
        ) : (
          <ScrollArea className="h-[min(24rem,55vh)] rounded-xl border border-border/60 bg-muted/10">
            <div className="space-y-3 p-4">
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
          </ScrollArea>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { HistoryCard }
