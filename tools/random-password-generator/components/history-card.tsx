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

import type { HistoryEntry, RandomPasswordGeneratorMessages } from "../types"

type HistoryCardProps = Readonly<{
  messages: RandomPasswordGeneratorMessages
  historyEntries: readonly HistoryEntry[]
  onClearHistory: () => void
}>

function getModeLabel(
  entry: HistoryEntry,
  messages: RandomPasswordGeneratorMessages
) {
  switch (entry.mode) {
    case "random":
      return messages.randomTabLabel
    case "words":
      return messages.wordsTabLabel
    case "separator":
      return messages.separatorTabLabel
    case "pin":
      return messages.pinTabLabel
  }
}

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
                  className="space-y-2 rounded-xl border bg-background/80 px-4 py-3"
                >
                  <div className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                    {getModeLabel(entry, messages)}
                  </div>
                  <div className="font-mono text-base font-medium break-all">
                    {entry.value}
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
