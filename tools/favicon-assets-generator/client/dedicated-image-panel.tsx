import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { ImageIcon, ImageUp } from "@workspace/ui/icons"

import { faviconGeneratorCopy } from "./copy"
import { formatFileSize } from "./format-file-size"
import { useBlobObjectUrl } from "./use-blob-object-url"

type DedicatedImagePanelProps = Readonly<{
  description: string
  file: File | null
  inputId: string
  onFileChange: (file: File | null) => void
}>

function DedicatedImagePanel({
  description,
  file,
  inputId,
  onFileChange,
}: DedicatedImagePanelProps) {
  const previewUrl = useBlobObjectUrl(file)

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">{description}</p>

      {file && previewUrl ? (
        <>
          <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
            <img
              src={previewUrl}
              alt=""
              className="h-48 w-full object-contain"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-medium text-foreground">
              {file.name}
            </span>
            <Badge variant="outline">{file.type || "unknown"}</Badge>
            <Badge variant="secondary">{formatFileSize(file.size)}</Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {faviconGeneratorCopy.changeImageLabel}
            </label>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                onFileChange(null)
              }}
            >
              {faviconGeneratorCopy.removeDedicatedImageLabel}
            </Button>
          </div>
        </>
      ) : (
        <label
          htmlFor={inputId}
          className="block cursor-pointer"
          aria-label={faviconGeneratorCopy.dedicatedImageLabel}
        >
          <Empty className="border border-dashed border-border/80 bg-muted/20 transition-colors hover:border-foreground/20 hover:bg-muted/35">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageUp />
              </EmptyMedia>
              <EmptyTitle>
                {faviconGeneratorCopy.dedicatedImageLabel}
              </EmptyTitle>
              <EmptyDescription>
                {faviconGeneratorCopy.dedicatedImageFallbackDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </label>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/*,.svg"
        className="sr-only"
        onChange={(event) => {
          onFileChange(event.target.files?.[0] ?? null)
        }}
      />

      {file ? (
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
          <ImageIcon className="size-4" />
          {faviconGeneratorCopy.dedicatedImageActiveDescription}
        </div>
      ) : null}
    </div>
  )
}

export { DedicatedImagePanel }
