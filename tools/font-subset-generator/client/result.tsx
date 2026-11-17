import { useEffect, useId, useMemo, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Download, TriangleAlert } from "@workspace/ui/icons"
import type { Messages, SubsetResult } from "../types"

function useBlobUrl(blob: Blob) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    const next = URL.createObjectURL(blob)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [blob])
  return url
}

export function SubsetResultPanel({
  result,
  messages,
  lang,
  formatBytes,
}: {
  result: SubsetResult
  messages: Messages
  lang: string
  formatBytes: (bytes: number) => string
}) {
  const fontBlob = useMemo(
    () => new Blob([result.output], { type: result.mime }),
    [result.output, result.mime]
  )
  const cssBlob = useMemo(
    () => new Blob([result.css], { type: "text/css;charset=utf-8" }),
    [result.css]
  )
  const fontUrl = useBlobUrl(fontBlob)
  const cssUrl = useBlobUrl(cssBlob)
  const family = `subset-preview-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`
  const [previewState, setPreviewState] = useState<
    "loading" | "ready" | "error"
  >("loading")
  useEffect(() => {
    let active = true
    let face: FontFace | undefined
    async function loadPreview() {
      try {
        face = new FontFace(family, result.output, {
          weight: result.weight,
          style: result.style,
        })
        await face.load()
        if (active) {
          document.fonts.add(face)
          setPreviewState("ready")
        }
      } catch {
        if (active) setPreviewState("error")
      }
    }
    void loadPreview()
    return () => {
      active = false
      if (face) document.fonts.delete(face)
    }
  }, [family, result])
  const percent = 1 - result.output.byteLength / result.originalSize
  const number = new Intl.NumberFormat(lang)
  return (
    <ToolPanelCard>
      <CardHeader>
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription className="break-all">
          {result.filename}
        </CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-6">
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            [messages.originalSize, formatBytes(result.originalSize)],
            [messages.subsetSize, formatBytes(result.output.byteLength)],
            [
              messages.reduction,
              percent > 0
                ? new Intl.NumberFormat(lang, {
                    style: "percent",
                    maximumFractionDigits: 1,
                  }).format(percent)
                : messages.noReduction,
            ],
            [
              messages.glyphs,
              `${number.format(result.originalGlyphCount)} → ${number.format(result.glyphCount)}`,
            ],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-lg border p-3">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="mt-1 font-medium break-words tabular-nums">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        {result.missing.length ? (
          <Alert>
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>{messages.missingTitle}</AlertTitle>
            <AlertDescription>
              <p>{messages.missingDescription}</p>
              <p
                className="max-h-28 overflow-auto font-mono break-all"
                dir="ltr"
              >
                {result.missing
                  .map(
                    (cp) =>
                      `${String.fromCodePoint(cp)} (U+${cp.toString(16).toUpperCase().padStart(4, "0")})`
                  )
                  .join(" · ")}
              </p>
            </AlertDescription>
          </Alert>
        ) : null}
        <div className="flex flex-col gap-2">
          <h2 className="font-medium">{messages.previewTitle}</h2>
          <p className="text-sm text-muted-foreground">
            {messages.previewDescription}
          </p>
          {previewState === "error" ? (
            <p role="status" className="text-sm text-destructive">
              {messages.previewError}
            </p>
          ) : (
            <div
              data-testid="font-subset-preview"
              role="region"
              aria-label={messages.previewTitle}
              // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex={0}
              aria-busy={previewState === "loading"}
              dir="auto"
              className="max-h-72 overflow-auto rounded-lg border bg-background p-5 text-3xl leading-relaxed break-words whitespace-pre-wrap"
              style={{
                fontFamily:
                  previewState === "ready"
                    ? `'${family}', sans-serif`
                    : "sans-serif",
              }}
            >
              {result.text}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {fontUrl ? (
            <Button
              asChild
              className="h-auto min-h-9 max-w-full whitespace-normal"
            >
              <a href={fontUrl} download={result.filename}>
                <Download aria-hidden="true" />
                {messages.downloadFont}
              </a>
            </Button>
          ) : null}
          {cssUrl ? (
            <Button
              asChild
              variant="outline"
              className="h-auto min-h-9 max-w-full whitespace-normal"
            >
              <a
                href={cssUrl}
                download={result.filename.replace(/\.[^.]+$/, ".css")}
              >
                <Download aria-hidden="true" />
                {messages.downloadCss}
              </a>
            </Button>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <h2 className="font-medium">{messages.cssTitle}</h2>
          <p className="text-sm text-muted-foreground">
            {messages.cssDescription}
          </p>
          <pre
            // Scrollable code must be reachable for keyboard scrolling.
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            dir="ltr"
            className="max-h-56 overflow-auto rounded-lg border bg-muted/30 p-4 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <code>{result.css}</code>
          </pre>
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
