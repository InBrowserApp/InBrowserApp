import { useEffect, useState } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
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
import { ImageUp, Sparkles } from "@workspace/ui/icons"

import { readImageDimensions } from "./browser-image"
import { formatFileSize } from "./format-file-size"
import { faviconGeneratorCopy } from "./copy"

type UploadCardProps = Readonly<{
  inputId: string
  onUseDemoIcon: () => void
  previewUrl: string | null
  sourceFile: File | null
  onFileChange: (file: File | null) => void
}>

function UploadCard({
  inputId,
  onUseDemoIcon,
  previewUrl,
  sourceFile,
  onFileChange,
}: UploadCardProps) {
  const [dimensions, setDimensions] = useState<{
    width: number
    height: number
  } | null>(null)

  useEffect(() => {
    let cancelled = false

    if (!sourceFile) {
      setDimensions(null)
      return
    }

    void readImageDimensions(sourceFile)
      .then((nextDimensions) => {
        if (!cancelled) {
          setDimensions(nextDimensions)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDimensions(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [sourceFile])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{faviconGeneratorCopy.uploadTitle}</CardTitle>
        <CardDescription>
          {faviconGeneratorCopy.uploadDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {sourceFile && previewUrl ? (
          <>
            <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
              <img
                src={previewUrl}
                alt=""
                className="h-72 w-full object-contain"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-medium text-foreground">
                {sourceFile.name}
              </span>
              {dimensions ? (
                <Badge variant="outline">
                  {faviconGeneratorCopy.dimensionsLabel}: {dimensions.width}x
                  {dimensions.height}
                </Badge>
              ) : null}
              <Badge variant="outline">
                {faviconGeneratorCopy.typeLabel}: {sourceFile.type || "unknown"}
              </Badge>
              <Badge variant="secondary">
                {faviconGeneratorCopy.sizeLabel}:{" "}
                {formatFileSize(sourceFile.size)}
              </Badge>
            </div>
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {faviconGeneratorCopy.changeImageLabel}
            </label>
          </>
        ) : (
          <label
            htmlFor={inputId}
            aria-label={faviconGeneratorCopy.chooseImageLabel}
            className="block cursor-pointer"
          >
            <Empty className="border border-dashed border-border/80 bg-muted/30 transition-colors hover:border-foreground/20 hover:bg-muted/45">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageUp />
                </EmptyMedia>
                <EmptyTitle>{faviconGeneratorCopy.chooseImageLabel}</EmptyTitle>
                <EmptyDescription>
                  {faviconGeneratorCopy.uploadHint}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </label>
        )}
        {!sourceFile ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => {
              onUseDemoIcon()
            }}
          >
            <Sparkles data-icon="inline-start" />
            {faviconGeneratorCopy.useDemoIconLabel}
          </Button>
        ) : null}
        <input
          id={inputId}
          type="file"
          accept="image/*,.svg"
          className="sr-only"
          onChange={(event) => {
            onFileChange(event.target.files?.[0] ?? null)
          }}
        />
      </CardContent>
    </Card>
  )
}

export { UploadCard }
