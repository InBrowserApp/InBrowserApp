import { Button } from "@workspace/ui/components/ui/button"
import { ImageIcon, ImageUp, Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { ExifViewerMessages } from "../client/types"

type ImageSummaryProps = Readonly<{
  fileName: string
  fileSizeLabel: string
  imageUrl: string | null
  isDraggingOver: boolean
  messages: ExifViewerMessages
  onChangeImage: () => void
  onDragEnter: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragLeave: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragOver: (event: React.DragEvent<HTMLButtonElement>) => void
  onDrop: (event: React.DragEvent<HTMLButtonElement>) => void
  onRemoveImage: () => void
}>

function ImageSummary({
  fileName,
  fileSizeLabel,
  imageUrl,
  isDraggingOver,
  messages,
  onChangeImage,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onRemoveImage,
}: ImageSummaryProps) {
  return (
    <div className="flex flex-col gap-4">
      <button
        aria-label={messages.changeImage}
        className="cursor-pointer touch-manipulation appearance-none rounded-lg bg-transparent p-0 text-left text-inherit focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        onClick={onChangeImage}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        type="button"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border border-dashed border-border/80 bg-muted/20 transition-colors hover:border-foreground/20 hover:bg-muted/30",
            isDraggingOver && "border-foreground/30 bg-muted/35"
          )}
        >
          <div className="pointer-events-none absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full border border-border/80 bg-background/90 text-muted-foreground shadow-sm">
            <ImageUp />
          </div>
          {imageUrl ? (
            <img
              alt={fileName}
              className="aspect-[4/3] w-full object-contain p-3"
              height={600}
              src={imageUrl}
              width={800}
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center text-muted-foreground">
              <ImageIcon />
            </div>
          )}
        </div>
      </button>

      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          {messages.selectedImage}
        </p>
        <p className="font-medium break-all">{fileName}</p>
        <p className="text-sm text-muted-foreground">{fileSizeLabel}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onChangeImage} type="button" variant="outline">
          <ImageUp data-icon="inline-start" />
          {messages.changeImage}
        </Button>
        <Button onClick={onRemoveImage} type="button" variant="outline">
          <Trash2 data-icon="inline-start" />
          {messages.removeImage}
        </Button>
      </div>
    </div>
  )
}

export { ImageSummary }
