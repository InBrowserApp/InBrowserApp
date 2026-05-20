import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { FileText } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { RemovePdfOwnerPasswordMessages } from "../client/types"

type UploadCardProps = Readonly<{
  isDraggingOver: boolean
  messages: RemovePdfOwnerPasswordMessages
  onClick: () => void
  onDragEnter: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragLeave: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragOver: (event: React.DragEvent<HTMLButtonElement>) => void
  onDrop: (event: React.DragEvent<HTMLButtonElement>) => void
}>

function UploadCard({
  isDraggingOver,
  messages,
  onClick,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}: UploadCardProps) {
  return (
    <button
      aria-label={messages.dragDropOrClick}
      className="flex min-h-[18rem] w-full cursor-pointer touch-manipulation appearance-none rounded-lg bg-transparent p-0 text-inherit focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
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
            <FileText />
          </EmptyMedia>
          <EmptyTitle className="text-base">
            {messages.dragDropOrClick}
          </EmptyTitle>
          <EmptyDescription>{messages.supportedFormats}</EmptyDescription>
          <EmptyDescription>{messages.localOnlyNote}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </button>
  )
}

export { UploadCard }
