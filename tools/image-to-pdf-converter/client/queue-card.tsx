import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
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
import {
  ArrowDown,
  ArrowUp,
  FileText,
  RefreshCcw,
  Trash2,
} from "@workspace/ui/icons"

import { formatBytes, formatDimensions, getTotalImageSize } from "./utils"

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
}>

function QueueCard({
  disabled,
  items,
  messages,
  onClear,
  onMoveDown,
  onMoveUp,
  onRemove,
  onRotate,
}: QueueCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{messages.queueTitle}</CardTitle>
          <CardDescription>{messages.queueDescription}</CardDescription>
        </div>
        <CardAction>
          <Button
            className="max-w-full text-center whitespace-normal"
            disabled={disabled || items.length === 0}
            onClick={onClear}
            size="sm"
            type="button"
            variant="outline"
          >
            <Trash2 data-icon="inline-start" />
            {messages.clearAllLabel}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.length ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {messages.imageCountLabel}: {items.length}
              </Badge>
              <Badge variant="outline">
                {messages.fileSizeLabel}:{" "}
                {formatBytes(getTotalImageSize(items))}
              </Badge>
            </div>

            <ol className="flex flex-col gap-3">
              {items.map((item, index) => (
                <li
                  className="grid gap-3 rounded-lg border bg-background p-3 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto]"
                  key={item.id}
                >
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-muted">
                    <img
                      alt={messages.previewAlt.replace("{name}", item.name)}
                      className="max-h-full max-w-full object-contain"
                      src={item.previewUrl}
                      style={{ transform: `rotate(${item.rotation}deg)` }}
                    />
                  </div>

                  <div className="min-w-0 self-center">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDimensions(item.width, item.height)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatBytes(item.size)}
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-1 self-center sm:grid-cols-1">
                    <Button
                      aria-label={`${messages.moveUpLabel}: ${item.name}`}
                      disabled={disabled || index === 0}
                      onClick={() => {
                        onMoveUp(index)
                      }}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      aria-label={`${messages.moveDownLabel}: ${item.name}`}
                      disabled={disabled || index === items.length - 1}
                      onClick={() => {
                        onMoveDown(index)
                      }}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <ArrowDown />
                    </Button>
                    <Button
                      aria-label={`${messages.rotateLabel}: ${item.name}`}
                      disabled={disabled}
                      onClick={() => {
                        onRotate(item.id)
                      }}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <RefreshCcw />
                    </Button>
                    <Button
                      aria-label={`${messages.removeImageLabel}: ${item.name}`}
                      disabled={disabled}
                      onClick={() => {
                        onRemove(item.id)
                      }}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <Empty className="min-h-64 border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyQueueTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyQueueDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

export { QueueCard }
