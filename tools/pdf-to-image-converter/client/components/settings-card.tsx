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
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Slider } from "@workspace/ui/components/ui/slider"
import { Download, FileArchive } from "@workspace/ui/icons"

import {
  DPI_PRESETS,
  MAX_DPI,
  MAX_QUALITY,
  MIN_DPI,
  MIN_QUALITY,
  shouldUseQuality,
} from "../../core/options"
import { formatPercent } from "../utils"

import type {
  ExportProgress,
  PdfPageImage,
  PdfToImageMessages,
  RenderPageOptions,
  ZipResult,
} from "../types"

type SettingsCardProps = Readonly<{
  currentImage: PdfPageImage | null
  currentImageName: string
  currentImageUrl: string | null
  disabled: boolean
  exportProgress: ExportProgress | null
  isExporting: boolean
  messages: PdfToImageMessages
  numPages: number
  onExportAll: () => void
  onOptionsChange: (options: RenderPageOptions) => void
  options: RenderPageOptions
  zipResult: ZipResult | null
  zipUrl: string | null
}>

function SettingsCard({
  currentImage,
  currentImageName,
  currentImageUrl,
  disabled,
  exportProgress,
  isExporting,
  messages,
  numPages,
  onExportAll,
  onOptionsChange,
  options,
  zipResult,
  zipUrl,
}: SettingsCardProps) {
  const lossyFormat = shouldUseQuality(options.format)
  const canDownloadCurrent = Boolean(currentImage && currentImageUrl)
  const canExportAll = numPages > 0 && !disabled && !isExporting

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.settingsTitle}</CardTitle>
        <CardDescription>{messages.settingsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel>{messages.outputFormatLabel}</FieldLabel>
            <Select
              disabled={disabled || isExporting}
              onValueChange={(format: RenderPageOptions["format"]) => {
                onOptionsChange({ ...options, format })
              }}
              value={options.format}
            >
              <SelectTrigger
                aria-label={messages.outputFormatLabel}
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="png">{messages.pngFormat}</SelectItem>
                  <SelectItem value="jpeg">{messages.jpegFormat}</SelectItem>
                  <SelectItem value="webp">{messages.webpFormat}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="pdf-to-image-dpi">
              {messages.dpiLabel}
            </FieldLabel>
            <Input
              disabled={disabled || isExporting}
              id="pdf-to-image-dpi"
              inputMode="numeric"
              max={MAX_DPI}
              min={MIN_DPI}
              onChange={(event) => {
                onOptionsChange({
                  ...options,
                  dpi: Number(event.target.value),
                })
              }}
              step={1}
              type="number"
              value={options.dpi}
            />
            <FieldDescription>{messages.dpiDescription}</FieldDescription>
            <div
              aria-label={messages.dpiPresetLabel}
              className="grid grid-cols-3 gap-2 sm:grid-cols-6"
              role="group"
            >
              {DPI_PRESETS.map((dpi) => (
                <Button
                  aria-pressed={options.dpi === dpi}
                  disabled={disabled || isExporting}
                  key={dpi}
                  onClick={() => {
                    onOptionsChange({ ...options, dpi })
                  }}
                  size="sm"
                  type="button"
                  variant={options.dpi === dpi ? "secondary" : "outline"}
                >
                  {dpi}
                </Button>
              ))}
            </div>
          </Field>

          <Field data-disabled={!lossyFormat}>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel>{messages.qualityLabel}</FieldLabel>
              <span className="text-sm text-muted-foreground">
                {formatPercent(options.quality)}
              </span>
            </div>
            <Slider
              aria-label={messages.qualityLabel}
              disabled={disabled || isExporting || !lossyFormat}
              max={MAX_QUALITY}
              min={MIN_QUALITY}
              onValueChange={([quality]) => {
                onOptionsChange({
                  ...options,
                  quality: quality ?? options.quality,
                })
              }}
              step={0.01}
              value={[options.quality]}
            />
            <FieldDescription>{messages.qualityDescription}</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-3">
        <div className="grid gap-2 sm:grid-cols-2">
          {canDownloadCurrent && !isExporting ? (
            <Button asChild variant="outline">
              <a download={currentImageName} href={currentImageUrl ?? ""}>
                <Download data-icon="inline-start" />
                {messages.downloadCurrentLabel}
              </a>
            </Button>
          ) : (
            <Button disabled type="button" variant="outline">
              <Download data-icon="inline-start" />
              {messages.downloadCurrentLabel}
            </Button>
          )}
          <Button disabled={!canExportAll} onClick={onExportAll} type="button">
            <FileArchive data-icon="inline-start" />
            {isExporting ? messages.exportingAllLabel : messages.exportAllLabel}
          </Button>
        </div>

        {exportProgress ? (
          <p className="text-sm text-muted-foreground">
            {messages.exportProgressLabel}: {exportProgress.completed} /{" "}
            {exportProgress.total}
          </p>
        ) : null}

        {zipResult && zipUrl ? (
          <Button asChild variant="secondary">
            <a download={zipResult.fileName} href={zipUrl}>
              <Download data-icon="inline-start" />
              {messages.downloadZipLabel}
            </a>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}

export { SettingsCard }
