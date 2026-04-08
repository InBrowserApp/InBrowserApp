import { Badge } from "@workspace/ui/components/ui/badge"
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
import { ImageUp } from "@workspace/ui/icons"

import type { ImageDimensions } from "../core/resize-image"
import { formatFileSize } from "./constants"
import type { ImageResizerMessages } from "./types"

type UploadCardProps = Readonly<{
  inputId: string
  messages: ImageResizerMessages
  onFileChange: (file: File | null) => void
  selectedFile: File | null
  sourceDimensions: ImageDimensions | null
  sourcePreviewUrl: string | null
}>

export function UploadCard({
  inputId,
  messages,
  onFileChange,
  selectedFile,
  sourceDimensions,
  sourcePreviewUrl,
}: UploadCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.uploadTitle}</CardTitle>
        <CardDescription>{messages.uploadDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {selectedFile && sourcePreviewUrl && sourceDimensions ? (
          <>
            <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
              <img
                src={sourcePreviewUrl}
                alt=""
                className="h-72 w-full object-contain"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-medium text-foreground">
                {selectedFile.name}
              </span>
              <Badge variant="outline" className="font-mono">
                {sourceDimensions.width} × {sourceDimensions.height}
              </Badge>
              <Badge variant="secondary">
                {formatFileSize(selectedFile.size)}
              </Badge>
            </div>
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {messages.changeImageLabel}
            </label>
          </>
        ) : (
          <label
            htmlFor={inputId}
            aria-label={messages.chooseImageLabel}
            className="block cursor-pointer"
          >
            <Empty className="border border-dashed border-border/80 bg-muted/30 transition-colors hover:border-foreground/20 hover:bg-muted/45">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageUp />
                </EmptyMedia>
                <EmptyTitle>{messages.chooseImageLabel}</EmptyTitle>
                <EmptyDescription>{messages.uploadHint}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </label>
        )}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            void onFileChange(event.target.files?.[0] ?? null)
          }}
        />
      </CardContent>
    </Card>
  )
}
