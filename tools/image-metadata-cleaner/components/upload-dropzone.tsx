import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { ImageUp } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { ImageMetadataCleanerMessages } from "../client/types"

type UploadDropzoneProps = Readonly<{
  isDraggingOver: boolean
  messages: ImageMetadataCleanerMessages
  onClick: () => void
  onDragEnter: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragLeave: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragOver: (event: React.DragEvent<HTMLButtonElement>) => void
  onDrop: (event: React.DragEvent<HTMLButtonElement>) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void
}>

function UploadDropzone({
  isDraggingOver,
  messages,
  onClick,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onKeyDown,
}: UploadDropzoneProps) {
  return (
    <button
      aria-label={messages.dragDropOrClick}
      className="flex min-h-0 w-full flex-1 cursor-pointer appearance-none bg-transparent p-0 text-inherit"
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onKeyDown={onKeyDown}
      type="button"
    >
      <Empty
        className={cn(
          "min-h-full flex-1 border border-dashed border-border/80 bg-muted/30 transition-colors hover:border-foreground/20 hover:bg-muted/45",
          isDraggingOver && "border-foreground/30 bg-muted/45"
        )}
      >
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className={cn(
              "size-10 rounded-full bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-5",
              isDraggingOver && "bg-foreground text-background"
            )}
          >
            <ImageUp className="size-5" />
          </EmptyMedia>
          <EmptyTitle className="text-base">
            {messages.dragDropOrClick}
          </EmptyTitle>
          <EmptyDescription>{messages.supportedFormats}</EmptyDescription>
          <EmptyDescription>{messages.note}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </button>
  )
}

export { UploadDropzone }
