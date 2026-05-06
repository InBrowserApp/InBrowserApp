import { useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import { ScrollArea, ScrollBar } from "@workspace/ui/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Download, TriangleAlert } from "@workspace/ui/icons"

import {
  getBackgroundPreviewCss,
  getBackgroundPreviewSize,
} from "../core/backgrounds"
import type { BackgroundConfig } from "../core/backgrounds"
import type { SvgOutput } from "../core/layout"
import type { Theme } from "../core/themes"
import type { CodeScreenshotGeneratorMessages } from "../types"
import { rasterScaleOptions, type CodeShotSettings } from "./constants"
import {
  downloadBlob,
  rasterizeSvg,
  safeFileBaseName,
  type RasterFormat,
} from "./raster"
import { RasterButton } from "./raster-button"
import { useObjectUrl } from "./use-object-url"

type PreviewExportCardProps = Readonly<{
  background: BackgroundConfig
  fileName: string
  hasCode: boolean
  htmlDocument: string
  htmlSnippet: string
  messages: CodeScreenshotGeneratorMessages
  onSettingsChange: (patch: Partial<CodeShotSettings>) => void
  rasterScale: number
  svgOutput: SvgOutput
  theme: Theme
}>

function PreviewExportCard({
  background,
  fileName,
  hasCode,
  htmlDocument,
  htmlSnippet,
  messages,
  onSettingsChange,
  rasterScale,
  svgOutput,
  theme,
}: PreviewExportCardProps) {
  const fileNameId = useId()
  const scaleId = useId()
  const [exportError, setExportError] = useState(false)
  const fileBaseName = safeFileBaseName(fileName)
  const svgUrl = useObjectUrl(
    hasCode ? svgOutput.svg : "",
    "image/svg+xml;charset=utf-8"
  )
  const htmlUrl = useObjectUrl(
    hasCode ? htmlDocument : "",
    "text/html;charset=utf-8"
  )

  async function handleRasterDownload(format: RasterFormat) {
    if (!hasCode) {
      return
    }

    try {
      setExportError(false)
      const blob = await rasterizeSvg({
        svg: svgOutput.svg,
        width: svgOutput.width,
        height: svgOutput.height,
        scale: rasterScale,
        format,
        quality: format === "jpeg" || format === "webp" ? 0.92 : undefined,
        backgroundColor:
          format === "jpeg" &&
          (background.type === "transparent" || background.type === "none")
            ? theme.background
            : undefined,
      })
      const extension = format === "jpeg" ? "jpg" : format

      downloadBlob(blob, `${fileBaseName}.${extension}`)
    } catch {
      setExportError(true)
    }
  }

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="border-b">
        <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="flex flex-col gap-1">
            <CardTitle>{messages.previewTitle}</CardTitle>
            <CardDescription>{messages.previewDescription}</CardDescription>
          </div>
          {hasCode ? (
            <span className="text-sm text-muted-foreground">
              {messages.dimensionsLabel}: {svgOutput.width} x {svgOutput.height}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {exportError ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.exportErrorTitle}</AlertTitle>
            <AlertDescription>
              {messages.exportErrorDescription}
            </AlertDescription>
          </Alert>
        ) : null}

        <div
          className="min-h-96 overflow-hidden rounded-lg border"
          style={{
            background: getBackgroundPreviewCss(background),
            backgroundSize: getBackgroundPreviewSize(background),
          }}
        >
          {hasCode ? (
            <ScrollArea className="h-96 w-full">
              <div className="flex min-h-96 min-w-max items-center justify-center p-6">
                <div
                  className="inline-block origin-center scale-[0.62] sm:scale-75 lg:scale-[0.68] xl:scale-75"
                  dangerouslySetInnerHTML={{ __html: svgOutput.svg }}
                />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <div className="flex min-h-96 items-center justify-center p-6">
              <Empty>
                <EmptyTitle>{messages.emptyPreviewTitle}</EmptyTitle>
                <EmptyDescription>
                  {messages.emptyPreviewDescription}
                </EmptyDescription>
              </Empty>
            </div>
          )}
        </div>

        <FieldGroup className="sm:grid sm:grid-cols-[minmax(0,1fr)_8rem]">
          <Field>
            <FieldLabel htmlFor={fileNameId}>
              {messages.fileNameLabel}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id={fileNameId}
                value={fileName}
                onChange={(event) => {
                  onSettingsChange({ fileName: event.target.value })
                }}
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor={scaleId}>{messages.scaleLabel}</FieldLabel>
            <Select
              value={String(rasterScale)}
              onValueChange={(value) => {
                onSettingsChange({ rasterScale: Number(value) })
              }}
            >
              <SelectTrigger id={scaleId} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {rasterScaleOptions.map((scale) => (
                    <SelectItem key={scale} value={String(scale)}>
                      {scale}x
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4 border-t">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{messages.exportTitle}</span>
          <span className="text-sm text-muted-foreground">
            {messages.exportDescription}
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <RasterButton
            disabled={!hasCode}
            format="png"
            label={messages.downloadPngLabel}
            onClick={(format) => {
              void handleRasterDownload(format)
            }}
          />
          <RasterButton
            disabled={!hasCode}
            format="jpeg"
            label={messages.downloadJpegLabel}
            onClick={(format) => {
              void handleRasterDownload(format)
            }}
          />
          <RasterButton
            disabled={!hasCode}
            format="webp"
            label={messages.downloadWebpLabel}
            onClick={(format) => {
              void handleRasterDownload(format)
            }}
          />
          {svgUrl ? (
            <Button asChild variant="outline">
              <a download={`${fileBaseName}.svg`} href={svgUrl}>
                <Download data-icon="inline-start" />
                {messages.downloadSvgLabel}
              </a>
            </Button>
          ) : (
            <Button type="button" variant="outline" disabled>
              <Download data-icon="inline-start" />
              {messages.downloadSvgLabel}
            </Button>
          )}
          {htmlUrl ? (
            <Button asChild variant="outline">
              <a download={`${fileBaseName}.html`} href={htmlUrl}>
                <Download data-icon="inline-start" />
                {messages.downloadHtmlLabel}
              </a>
            </Button>
          ) : (
            <Button type="button" variant="outline" disabled>
              <Download data-icon="inline-start" />
              {messages.downloadHtmlLabel}
            </Button>
          )}
          <ToolCopyButton
            value={hasCode ? svgOutput.svg : ""}
            copyLabel={messages.copySvgLabel}
            copiedLabel={messages.copiedLabel}
            disabled={!hasCode}
          />
          <ToolCopyButton
            value={hasCode ? htmlSnippet : ""}
            copyLabel={messages.copyHtmlLabel}
            copiedLabel={messages.copiedLabel}
            disabled={!hasCode}
          />
        </div>
      </CardFooter>
    </Card>
  )
}

export { PreviewExportCard }
