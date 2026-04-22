import { ImageUp } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { ImageMetadataCleanerMessages } from "../client/types"

type SelectedImagePreviewProps = Readonly<{
  fileSizeLabel: string
  isDraggingOver: boolean
  messages: ImageMetadataCleanerMessages
  onClick: () => void
  onDragEnter: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragLeave: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragOver: (event: React.DragEvent<HTMLButtonElement>) => void
  onDrop: (event: React.DragEvent<HTMLButtonElement>) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void
  selectedFileName: string
  selectedFileUrl: string | null
}>

function SelectedImagePreview({
  fileSizeLabel,
  isDraggingOver,
  messages,
  onClick,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onKeyDown,
  selectedFileName,
  selectedFileUrl,
}: SelectedImagePreviewProps) {
  return (
    <button
      aria-label={messages.dragDropOrClick}
      className="flex w-full cursor-pointer flex-col gap-4 text-left text-inherit"
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onKeyDown={onKeyDown}
      type="button"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-dashed border-border/80 bg-muted/20 transition-colors hover:border-foreground/20 hover:bg-muted/30",
          isDraggingOver && "border-foreground/30 bg-muted/35"
        )}
      >
        <div className="pointer-events-none absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full border border-border/80 bg-background/90 text-muted-foreground shadow-sm">
          <ImageUp className="size-4" />
        </div>

        {selectedFileUrl ? (
          <img
            alt={selectedFileName}
            className="aspect-[4/3] w-full object-contain p-3"
            src={selectedFileUrl}
          />
        ) : (
          <div className="aspect-[4/3] w-full bg-muted/30" />
        )}
      </div>

      <div className="space-y-1">
        <p className="font-medium break-all">{selectedFileName}</p>
        <p className="text-sm text-muted-foreground">{fileSizeLabel}</p>
      </div>
    </button>
  )
}

export { SelectedImagePreview }
