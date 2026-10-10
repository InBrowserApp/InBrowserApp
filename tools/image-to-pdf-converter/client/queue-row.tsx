import { memo } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  ArrowDown,
  ArrowUp,
  RefreshCcw,
  Trash2,
  TriangleAlert,
} from "@workspace/ui/icons"
import { formatDimensions, imageLabel } from "./utils"
import type { ImageQueueItem, ImageToPdfMessages } from "./types"

type QueueRowProps = Readonly<{
  item: ImageQueueItem
  index: number
  count: number
  disabled: boolean
  messages: ImageToPdfMessages
  onMoveDown: (index: number) => void
  onMoveUp: (index: number) => void
  onRemove: (id: string) => void
  onRotate: (id: string) => void
  onToggle: (id: string) => void
}>

export const QueueRow = memo(function QueueRow({
  item,
  index,
  count,
  disabled,
  messages: m,
  onMoveDown,
  onMoveUp,
  onRemove,
  onRotate,
  onToggle,
}: QueueRowProps) {
  const label = imageLabel(item, m)
  return (
    <li className="grid grid-cols-[auto_4rem_minmax(0,1fr)] items-center gap-3 rounded-lg border bg-background p-3">
      <Checkbox
        aria-label={m.includeLabel.replace("{name}", label)}
        checked={item.selected}
        disabled={disabled}
        onCheckedChange={() => onToggle(item.id)}
      />
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-muted">
        {item.previewUrl ? (
          <img
            alt={m.previewAlt.replace("{name}", label)}
            loading="lazy"
            className="max-h-full max-w-full object-contain"
            src={item.previewUrl}
            style={{ transform: `rotate(${item.rotation}deg)` }}
          />
        ) : (
          <TriangleAlert
            className="size-5 text-destructive"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium [overflow-wrap:anywhere] break-words">
          {label}
        </p>
        {item.width > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDimensions(
              item.rotation % 180 ? item.height : item.width,
              item.rotation % 180 ? item.width : item.height
            )}
          </p>
        )}
      </div>
      {item.failure && (
        <p className="col-span-3 text-sm break-words text-destructive">
          {m.failures[item.failure]}
        </p>
      )}
      <div className="col-span-3 flex flex-wrap justify-end gap-1">
        <Button
          aria-label={`${m.moveUpLabel}: ${label}`}
          disabled={disabled || index === 0}
          onClick={() => onMoveUp(index)}
          size="icon"
          type="button"
          variant="ghost"
        >
          <ArrowUp />
        </Button>
        <Button
          aria-label={`${m.moveDownLabel}: ${label}`}
          disabled={disabled || index === count - 1}
          onClick={() => onMoveDown(index)}
          size="icon"
          type="button"
          variant="ghost"
        >
          <ArrowDown />
        </Button>
        <Button
          aria-label={`${m.rotateLabel}: ${label}`}
          disabled={disabled || !!item.failure}
          onClick={() => onRotate(item.id)}
          size="icon"
          type="button"
          variant="ghost"
        >
          <RefreshCcw />
        </Button>
        <Button
          aria-label={`${m.removeImageLabel}: ${label}`}
          disabled={disabled}
          onClick={() => onRemove(item.id)}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Trash2 />
        </Button>
      </div>
    </li>
  )
})
