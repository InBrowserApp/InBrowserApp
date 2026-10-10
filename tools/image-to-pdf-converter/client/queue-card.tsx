import { memo } from "react"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { FileText, Trash2 } from "@workspace/ui/icons"
import { QueueRow } from "./queue-row"
import { formatBytes, getTotalImageSize } from "./utils"
import type { ImageQueueItem, ImageToPdfMessages } from "./types"

type QueueCardProps = Readonly<{
  disabled: boolean
  items: readonly ImageQueueItem[]
  messages: ImageToPdfMessages
  onClear: () => void
  onMoveDown: (index: number) => void
  onMoveUp: (index: number) => void
  onRemove: (id: string) => void
  onRotate: (id: string) => void
  onToggle: (id: string) => void
  onSelectAll: (selected: boolean) => void
}>

export const QueueCard = memo(function QueueCard({
  disabled,
  items,
  messages: m,
  onClear,
  onSelectAll,
  ...actions
}: QueueCardProps) {
  const selected = items.filter((item) => item.selected)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.queueTitle}</CardTitle>
        <CardDescription>{m.queueDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.length ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {m.selectedCountLabel
                  .replace("{selected}", String(selected.length))
                  .replace("{total}", String(items.length))}
              </Badge>
              <Badge variant="outline">
                {m.fileSizeLabel}: {formatBytes(getTotalImageSize(items))}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                className="h-auto min-h-8 whitespace-normal"
                disabled={disabled || selected.length === items.length}
                onClick={() => onSelectAll(true)}
                size="sm"
                type="button"
                variant="outline"
              >
                {m.selectAllLabel}
              </Button>
              <Button
                className="h-auto min-h-8 whitespace-normal"
                disabled={disabled || selected.length === 0}
                onClick={() => onSelectAll(false)}
                size="sm"
                type="button"
                variant="outline"
              >
                {m.deselectAllLabel}
              </Button>
              <Button
                className="h-auto min-h-8 whitespace-normal"
                onClick={onClear}
                size="sm"
                type="button"
                variant="outline"
              >
                <Trash2 data-icon="inline-start" />
                {m.clearAllLabel}
              </Button>
            </div>
            {selected.some((item) => item.failure) && (
              <p role="status" className="text-sm text-destructive">
                {m.unreadableSelectionError}
              </p>
            )}
            {items.some(
              (item) =>
                item.info?.poster ||
                (item.info?.kind === "frame" && item.info.count > 1)
            ) && (
              <p className="text-sm text-muted-foreground">{m.framesNote}</p>
            )}
            <ol
              aria-label={m.queueTitle}
              className="flex max-h-[36rem] flex-col gap-3 overflow-y-auto p-1"
            >
              {items.map((item, index) => (
                <QueueRow
                  key={item.id}
                  item={item}
                  index={index}
                  count={items.length}
                  disabled={disabled}
                  messages={m}
                  {...actions}
                />
              ))}
            </ol>
          </>
        ) : (
          <Empty className="min-h-48 border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{m.emptyQueueTitle}</EmptyTitle>
              <EmptyDescription>{m.emptyQueueDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
})
