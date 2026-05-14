import { useMemo, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download } from "@workspace/ui/icons"

import {
  formatPaletteExport,
  getExportFileName,
  getExportMimeType,
} from "../core/export"
import type { PaletteExportFormat, PaletteSwatch } from "../core/types"
import { useObjectUrl } from "./object-url"
import type { ImagePaletteExtractorMessages } from "./types"

type ExportPanelProps = Readonly<{
  fileName: string
  messages: ImagePaletteExtractorMessages
  swatches: readonly PaletteSwatch[]
}>

function ExportPanel({ fileName, messages, swatches }: ExportPanelProps) {
  const [format, setFormat] = useState<PaletteExportFormat>("css")
  const exportContent = useMemo(
    () => formatPaletteExport(swatches, format),
    [format, swatches]
  )
  const exportBlob = useMemo(
    () => new Blob([exportContent], { type: getExportMimeType(format) }),
    [exportContent, format]
  )
  const downloadUrl = useObjectUrl(exportBlob)
  const downloadName = getExportFileName(fileName, format)

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-base font-medium">
            {messages.exportTitle}
          </h3>
          <p className="text-sm text-muted-foreground">
            {messages.exportDescription}
          </p>
        </div>
        <Field className="sm:w-52">
          <FieldLabel>{messages.exportFormatLabel}</FieldLabel>
          <Select
            onValueChange={(value) => {
              setFormat(value as PaletteExportFormat)
            }}
            value={format}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="hex">{messages.exportFormatHex}</SelectItem>
                <SelectItem value="css">{messages.exportFormatCss}</SelectItem>
                <SelectItem value="json">
                  {messages.exportFormatJson}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldDescription className="sr-only">
            {messages.exportDescription}
          </FieldDescription>
        </Field>
      </div>

      <Textarea
        aria-label={messages.exportTitle}
        className="min-h-32 resize-y font-mono text-xs"
        readOnly
        value={exportContent}
      />

      <div className="flex flex-wrap gap-3">
        <ToolCopyButton
          copiedLabel={messages.copiedPaletteLabel}
          copyLabel={messages.copyPaletteLabel}
          value={exportContent}
        />
        {downloadUrl ? (
          <Button asChild size="sm" type="button" variant="outline">
            <a download={downloadName} href={downloadUrl}>
              <Download data-icon="inline-start" />
              {messages.downloadPaletteLabel}
            </a>
          </Button>
        ) : (
          <Button disabled size="sm" type="button" variant="outline">
            <Download data-icon="inline-start" />
            {messages.downloadPaletteLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export { ExportPanel }
