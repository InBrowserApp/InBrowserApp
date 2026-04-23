import type * as React from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
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
import { ImageIcon, ImageUp, Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { ColorPickerMessages } from "./types"

type ImageCardProps = Readonly<{
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  fileInputRef: React.RefObject<HTMLInputElement | null>
  hasImage: boolean
  imageError: string | null
  isDraggingOver: boolean
  messages: ColorPickerMessages
  onCanvasClick: (event: React.MouseEvent<HTMLCanvasElement>) => void
  onClearImage: () => void
  onDragEnter: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragLeave: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragOver: (event: React.DragEvent<HTMLButtonElement>) => void
  onDrop: (event: React.DragEvent<HTMLButtonElement>) => void
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSelectImage: () => void
}>

function ImageCard({
  canvasRef,
  fileInputRef,
  hasImage,
  imageError,
  isDraggingOver,
  messages,
  onCanvasClick,
  onClearImage,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileChange,
  onSelectImage,
}: ImageCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.imageTitle}</CardTitle>
        <CardDescription>{messages.imageDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <input
          ref={fileInputRef}
          accept="image/*,image/svg+xml"
          className="sr-only"
          data-testid="image-input"
          onChange={onFileChange}
          type="file"
        />

        {imageError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {imageError}
          </div>
        ) : null}

        {!hasImage ? (
          <button
            className="flex w-full appearance-none bg-transparent p-0 text-inherit"
            onClick={onSelectImage}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            type="button"
          >
            <Empty
              className={cn(
                "min-h-[14rem] flex-1 border border-dashed border-border/80 bg-muted/30 transition-colors hover:border-foreground/20 hover:bg-muted/45",
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
                  {messages.imageButton}
                </EmptyTitle>
                <EmptyDescription>{messages.uploadHint}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </button>
        ) : null}

        <div className={cn("space-y-3", !hasImage && "hidden")}>
          <p className="text-sm text-muted-foreground">{messages.imageHint}</p>
          <div className="overflow-hidden rounded-xl border bg-muted/20 p-3">
            <canvas
              ref={canvasRef}
              className={cn(
                "max-h-[26rem] max-w-full rounded-lg border bg-background",
                hasImage ? "block cursor-crosshair" : "hidden"
              )}
              data-testid={hasImage ? "image-canvas" : undefined}
              onClick={hasImage ? onCanvasClick : undefined}
            />
          </div>
        </div>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-end gap-3 border-t">
        <Button onClick={onSelectImage} type="button" variant="outline">
          <ImageIcon data-icon="inline-start" />
          {messages.imageButton}
        </Button>
        <Button
          disabled={!hasImage}
          onClick={onClearImage}
          type="button"
          variant="outline"
        >
          <Trash2 data-icon="inline-start" />
          {messages.clearImage}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { ImageCard }
