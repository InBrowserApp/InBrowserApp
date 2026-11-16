import { useRef } from "react"
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
import { visibleSize } from "../core/layout"
import { EditableWatermark } from "./editable-watermark"
import { WatermarkArt } from "./watermark-art"
import { usePreview } from "./use-preview"
import type {
  Messages,
  Options,
  Source,
  PreparedLayer,
  PageGeometry,
} from "../types"

function Preview({
  messages: m,
  source,
  items,
  selectedId,
  page,
  onPage,
  geometry,
  disabled,
  onSelect,
  onChange,
  onStart,
  onEnd,
  onDelete,
}: Readonly<{
  messages: Messages
  source: Source | null
  items: readonly PreparedLayer[]
  selectedId: string
  page: number
  onPage: (page: number) => void
  geometry: PageGeometry
  disabled: boolean
  onSelect: (id: string) => void
  onChange: (id: string, options: Options) => void
  onStart: () => void
  onEnd: (cancel?: boolean) => void
  onDelete: (id: string) => void
}>) {
  const frame = useRef<HTMLDivElement>(null)
  const { width, height } = visibleSize(geometry)
  const preview = usePreview(source?.file ?? null, page)
  const visible = items.filter(
    (item) => item.mark && (!source || item.pages.includes(page))
  )
  const active = items.find((item) => item.layer.id === selectedId)
  const missing = source && active && !active.pages.includes(page)
  const selectedCount = new Set(items.flatMap((item) => [...item.pages])).size
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{m.previewTitle}</CardTitle>
        <CardDescription>{m.previewDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted/40 p-3 sm:p-4">
          <div
            ref={frame}
            className="relative mx-auto w-full overflow-hidden border bg-white shadow-sm"
            style={{
              aspectRatio: `${width}/${height}`,
              maxWidth: `min(100%, calc(min(34rem, 55svh) * ${width / height}))`,
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
            {!source || preview.url ? (
              <>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 size-full"
                  viewBox={`0 0 ${width} ${height}`}
                >
                  {visible.map((item) => (
                    <WatermarkArt
                      key={item.layer.id}
                      item={item}
                      geometry={geometry}
                      height={height}
                    />
                  ))}
                </svg>
                {visible
                  .filter((item) => item.layer.options.layout === "single")
                  .map((item) => {
                    const index = items.indexOf(item)
                    return (
                      <EditableWatermark
                        key={item.layer.id}
                        item={item}
                        name={m.layerName.replace("{index}", String(index + 1))}
                        geometry={geometry}
                        frame={frame}
                        selected={item.layer.id === selectedId}
                        index={index}
                        messages={m}
                        disabled={disabled}
                        onSelect={() => onSelect(item.layer.id)}
                        onChange={(options) => onChange(item.layer.id, options)}
                        onStart={onStart}
                        onEnd={onEnd}
                        onDelete={() => onDelete(item.layer.id)}
                      />
                    )
                  })}
              </>
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
            onClick={() => onPage(page - 1)}
          >
            <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
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
            onClick={() => onPage(page + 1)}
          >
            <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
          </Button>
        </div>
        {source ? (
          <div
            className="flex flex-wrap justify-center gap-2"
            aria-live="polite"
          >
            <Badge variant="secondary">
              {m.selectedPages.replace("{count}", String(selectedCount))}
            </Badge>
            {!visible.length ? (
              <Badge variant="outline">{m.pageNotSelected}</Badge>
            ) : null}
          </div>
        ) : null}
        {missing ? (
          <div
            className="space-y-1 text-center text-sm text-muted-foreground"
            role="status"
          >
            <p>{m.selectedLayerNotOnPage}</p>
            {active.pages.length ? (
              <Button
                variant="link"
                type="button"
                onClick={() => onPage(active.pages[0]!)}
              >
                {m.showLayerPage}
              </Button>
            ) : null}
          </div>
        ) : null}
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-primary">
            {m.keyboardControls}
          </summary>
          <p id="watermark-keyboard-help" className="mt-2 leading-relaxed">
            {m.keyboardHint}
          </p>
        </details>
      </CardContent>
    </Card>
  )
}

export { Preview }
