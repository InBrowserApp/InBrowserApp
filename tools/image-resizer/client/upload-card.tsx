import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
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
            className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 px-6 py-8 text-center transition-colors hover:border-foreground/20 hover:bg-muted/45"
          >
            <ImageUp className="size-6 text-muted-foreground" />
            <div className="mt-4 space-y-1">
              <p className="font-medium text-foreground">
                {messages.chooseImageLabel}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {messages.uploadHint}
              </p>
            </div>
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
