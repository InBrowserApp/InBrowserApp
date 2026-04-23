import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertTitle } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Download, TriangleAlert } from "@workspace/ui/icons"

import { ReadOnlyOutput } from "./read-only-output"
import type { DataUriPreviewResult } from "../core/data-uri"
import type { DataUriToFileConverterMessages } from "../types"

type DataUriResultsCardProps = Readonly<{
  messages: DataUriToFileConverterMessages
  fileNameId: string
  decodeState: DataUriPreviewResult
  fileName: string
  previewUrl: string | null
  onFileNameChange: (value: string) => void
}>

function DataUriResultsCard({
  messages,
  fileNameId,
  decodeState,
  fileName,
  previewUrl,
  onFileNameChange,
}: DataUriResultsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.decodedOutputTitle}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        {decodeState.state === "invalid-data-uri" ? (
          <div aria-live="polite">
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>{messages.invalidDataUriTitle}</AlertTitle>
            </Alert>
          </div>
        ) : decodeState.state === "empty" ? (
          <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
            {messages.decodedOutputEmptyDescription}
          </div>
        ) : (
          <>
            <section className="grid gap-3">
              <h2 className="text-sm font-medium">{messages.detailsTitle}</h2>
              <dl className="grid gap-3 rounded-xl border bg-muted/20 p-4 sm:grid-cols-3">
                <DetailItem
                  label={messages.mimeTypeLabel}
                  value={decodeState.mimeType}
                  monospace
                />
                <DetailItem
                  label={messages.encodingLabel}
                  value={
                    decodeState.isBase64
                      ? messages.encodingBase64
                      : messages.encodingUrlEncoded
                  }
                />
                <DetailItem
                  label={messages.sizeLabel}
                  value={formatByteSize(decodeState.size)}
                />
              </dl>
            </section>

            <section className="grid gap-2">
              <Label htmlFor={fileNameId}>{messages.fileNameLabel}</Label>
              <Input
                id={fileNameId}
                name="file-name"
                value={fileName}
                onChange={(event) => {
                  onFileNameChange(event.target.value)
                }}
                placeholder={messages.fileNamePlaceholder}
                aria-label={messages.fileNameLabel}
              />
            </section>

            <section className="grid gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-medium">{messages.previewTitle}</h2>

                {decodeState.previewKind === "text" &&
                decodeState.textPreview.length > 0 ? (
                  <ToolCopyButton
                    value={decodeState.textPreview}
                    copyLabel={messages.copyResultLabel}
                    copiedLabel={messages.copiedLabel}
                    variant="ghost"
                  />
                ) : null}
              </div>

              {decodeState.previewKind === "image" && previewUrl ? (
                <div className="overflow-hidden rounded-xl border bg-muted/20 p-3">
                  <img
                    src={previewUrl}
                    alt={messages.previewTitle}
                    className="max-h-80 w-full object-contain"
                  />
                </div>
              ) : decodeState.previewKind === "audio" && previewUrl ? (
                // oxlint-disable-next-line jsx-a11y/media-has-caption
                <audio className="w-full" controls src={previewUrl} />
              ) : decodeState.previewKind === "video" && previewUrl ? (
                // oxlint-disable-next-line jsx-a11y/media-has-caption
                <video
                  className="w-full rounded-xl border bg-black"
                  controls
                  src={previewUrl}
                />
              ) : decodeState.previewKind === "text" ? (
                <>
                  <ReadOnlyOutput
                    ariaLabel={messages.previewTitle}
                    value={decodeState.textPreview}
                    className="min-h-64"
                  />
                  {decodeState.isPreviewTruncated ? (
                    <p className="text-sm text-muted-foreground">
                      {messages.previewTruncatedLabel}
                    </p>
                  ) : null}
                </>
              ) : (
                <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
                  {messages.previewUnavailableDescription}
                </div>
              )}
            </section>
          </>
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        {decodeState.state === "decoded" && previewUrl ? (
          <Button asChild size="sm">
            <a href={previewUrl} download={fileName.trim() || "data.bin"}>
              <Download data-icon="inline-start" />
              {messages.downloadFileLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadFileLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

function DetailItem({
  label,
  value,
  monospace = false,
}: Readonly<{ label: string; value: string; monospace?: boolean }>) {
  return (
    <div className="grid gap-1">
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className={monospace ? "font-mono text-sm break-all" : "text-sm"}>
        {value}
      </dd>
    </div>
  )
}

function formatByteSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  const units = ["KB", "MB", "GB", "TB"]
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`
}

export { DataUriResultsCard }
