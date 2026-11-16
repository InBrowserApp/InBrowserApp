import { useState } from "react"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { ChevronLeft, ChevronRight } from "@workspace/ui/icons"
import { visibleSize, watermarkLayout } from "../core/layout"
import { useObjectUrl } from "./use-watermark"
import { usePreview } from "./use-preview"
import type { Messages, Options, Source, Watermark } from "../types"

function Preview({
  messages: m,
  source,
  options,
  mark,
  selected,
}: Readonly<{
  messages: Messages
  source: Source | null
  options: Options
  mark: Watermark | null
  selected: readonly number[]
}>) {
  const [current, setCurrent] = useState(1)
  const page = Math.min(current, source?.pages.length ?? 1)
  const geometry = source?.pages[page - 1] ?? {
    width: 612,
    height: 792,
    x: 0,
    y: 0,
    rotation: 0,
  }
  const { width, height } = visibleSize(geometry)
  const preview = usePreview(source?.file ?? null, page)
  const markUrl = useObjectUrl(mark?.blob ?? null)
  const layout = mark
    ? watermarkLayout(geometry, mark.width / mark.height, options)
    : null
  const active = !source || selected.includes(page)
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{m.previewTitle}</CardTitle>
        <CardDescription>{m.previewDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted/40 p-3 sm:p-4">
          <div
            className="relative mx-auto w-full overflow-hidden border bg-white shadow-sm"
            style={{
              aspectRatio: `${width}/${height}`,
              maxWidth: `min(100%, ${(26 * width) / height}rem)`,
            }}
            data-testid="watermark-preview"
          >
            {preview.url ? (
              <img
                src={preview.url}
                alt=""
                className="absolute inset-0 size-full"
                width={width}
                height={height}
              />
            ) : !source ? (
              <svg
                aria-hidden="true"
                className="absolute inset-0 size-full"
                viewBox="0 0 612 792"
              >
                <rect
                  fill="#dce1e8"
                  x="60"
                  y="70"
                  width="240"
                  height="18"
                  rx="4"
                />
                {Array.from({ length: 12 }, (_, i) => (
                  <rect
                    key={i}
                    fill="#edf0f4"
                    x="60"
                    y={125 + i * 38}
                    width={i % 4 === 3 ? 330 : 490}
                    height="9"
                    rx="3"
                  />
                ))}
              </svg>
            ) : null}
            {preview.loading || preview.error ? (
              <div
                className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-slate-600"
                role="status"
              >
                {preview.error ? m.previewError : m.previewLoading}
              </div>
            ) : null}
            {active && (!source || preview.url) && layout && markUrl ? (
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full"
                viewBox={`0 0 ${width} ${height}`}
              >
                {layout.centers.map((c, i) => (
                  <image
                    key={i}
                    href={markUrl}
                    width={layout.markWidth}
                    height={layout.markHeight}
                    x={-layout.markWidth / 2}
                    y={-layout.markHeight / 2}
                    transform={`translate(${c.x} ${height - c.y}) rotate(${options.rotation})`}
                    opacity={options.opacity / 100}
                  />
                ))}
              </svg>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            aria-label={m.previousPage}
            type="button"
            size="icon-sm"
            variant="outline"
            disabled={!source || page <= 1}
            onClick={() => setCurrent(page - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <p
            aria-live="polite"
            className="min-w-0 text-center text-sm text-muted-foreground"
          >
            {source
              ? m.previewPageStatus
                  .replace("{page}", String(page))
                  .replace("{total}", String(source.pages.length))
              : m.sampleLabel}
          </p>
          <Button
            aria-label={m.nextPage}
            type="button"
            size="icon-sm"
            variant="outline"
            disabled={!source || page >= source.pages.length}
            onClick={() => setCurrent(page + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
        {source ? (
          <div
            className="flex flex-wrap justify-center gap-2"
            aria-live="polite"
          >
            <Badge variant="secondary">
              {m.selectedPages.replace("{count}", String(selected.length))}
            </Badge>
            {!active ? (
              <Badge variant="outline">{m.pageNotSelected}</Badge>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { Preview }
