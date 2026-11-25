import { useEffect, useId, useRef, useState } from "react"
import { examples, SourcePanel } from "@tool/mermaid-previewer/source-panel"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Download, Eye } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { cn } from "@workspace/ui/lib/utils"
import type { Messages } from "./types"

const formats = {
  png: { label: "PNG", type: "image/png" },
  svg: { label: "SVG", type: "image/svg+xml" },
  jpg: { label: "JPG", type: "image/jpeg" },
  webp: { label: "WebP", type: "image/webp" },
} as const

type Format = keyof typeof formats
type Result = { source: string; diagram: { svg: string; url: string } | null }
const selectClass = "h-9 w-full rounded-md border bg-background px-2 text-sm"

export default function Client({ messages: m }: { messages: Messages }) {
  const id = useId()
  const revision = useRef(0)
  const [source, setSource] = useState(examples.flowchart)
  const [filename, setFilename] = useState("mermaid-diagram")
  const [result, setResult] = useState<Result>()
  const [format, setFormat] = useState<Format>("png")
  const [scale, setScale] = useState(2)
  const [actualSize, setActualSize] = useState(false)
  const [background, setBackground] = useState("transparent")
  const [status, setStatus] = useState<"ready" | "saving" | "error">("ready")
  const hasSource = Boolean(source.trim())
  const current = result?.source === source ? result : undefined
  const diagram = current?.diagram
  const rendering = hasSource && !current
  const hasBackground = format === "png" || format === "webp"
  const white = format === "jpg" || (hasBackground && background === "white")
  const saving = status === "saving"

  useEffect(() => {
    if (!hasSource) return
    let obsolete = false
    const timer = window.setTimeout(async () => {
      try {
        const { renderDiagram } = await import("@tool/mermaid-previewer/render")
        if (obsolete) return
        const svg = await renderDiagram(source)
        if (!obsolete) {
          const url = `data:image/svg+xml,${encodeURIComponent(svg)}`
          setResult({ source, diagram: { svg, url } })
        }
      } catch {
        if (!obsolete) setResult({ source, diagram: null })
      }
    }, 200)
    return () => {
      obsolete = true
      window.clearTimeout(timer)
    }
  }, [hasSource, source])

  function updateSource(value: string, name?: string) {
    revision.current++
    setStatus("ready")
    setSource(value)
    if (name !== undefined) setFilename(name)
  }

  async function save() {
    if (!diagram || saving) return
    const version = revision.current
    setStatus("saving")
    try {
      let blob: Blob
      if (format === "svg") {
        blob = new Blob([diagram.svg], { type: formats.svg.type })
      } else {
        const { createRaster } = await import("@tool/mermaid-previewer/render")
        blob = await createRaster(diagram.url, {
          type: formats[format].type,
          scale,
          white,
        })
      }
      if (version !== revision.current) return
      downloadBlob(blob, `${filename}.${format}`)
      setStatus("ready")
    } catch {
      if (version === revision.current) setStatus("error")
    }
  }

  return (
    <div
      className="grid gap-4 lg:grid-cols-2"
      data-tool="mermaid-to-image-converter"
    >
      <SourcePanel
        messages={m}
        fileLabels={m}
        source={source}
        onChange={updateSource}
      />
      <section
        className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card"
        aria-labelledby={id}
      >
        <div className="flex min-h-14 items-center justify-between gap-2 border-b px-4 py-2">
          <h2 id={id} className="flex items-center gap-2 font-medium">
            <Eye aria-hidden="true" className="size-4 text-muted-foreground" />
            {m.preview}
          </h2>
          <Button
            size="sm"
            variant="outline"
            aria-label={m.actualSize}
            aria-pressed={actualSize}
            title={m.actualSize}
            disabled={!diagram}
            className="aria-pressed:bg-accent"
            onClick={() => setActualSize(!actualSize)}
          >
            1:1
          </Button>
        </div>
        <div className="flex min-h-48 flex-1 items-center justify-center p-4">
          {diagram ? (
            <div
              role="group"
              aria-labelledby={id}
              // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The full-size diagram can scroll.
              tabIndex={actualSize ? 0 : undefined}
              className={cn(
                "max-h-[40vh] min-h-36 w-full overflow-auto rounded-md bg-white p-3",
                !actualSize && "flex items-center justify-center",
                !white &&
                  "bg-[repeating-conic-gradient(#eef1f5_0%_25%,white_0%_50%)] bg-[length:16px_16px]"
              )}
            >
              <img
                src={diagram.url}
                alt={m.preview}
                className={
                  actualSize
                    ? "block max-w-none"
                    : "max-h-[36vh] max-w-full object-contain"
                }
              />
            </div>
          ) : (
            <p
              role="status"
              className="flex items-center gap-2 text-center text-sm text-muted-foreground"
            >
              {rendering ? <Spinner /> : null}
              {!hasSource ? m.empty : rendering ? m.loading : m.invalid}
            </p>
          )}
        </div>
        <div className="space-y-3 border-t p-3 sm:p-4">
          <fieldset disabled={saving} className="flex flex-wrap gap-2">
            <div className="min-w-24 flex-1 space-y-1">
              <Label htmlFor={id + "-format"}>{m.format}</Label>
              <select
                className={selectClass}
                id={id + "-format"}
                value={format}
                onChange={(event) =>
                  setFormat(event.currentTarget.value as Format)
                }
              >
                {Object.entries(formats).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {format !== "svg" ? (
              <div className="min-w-24 flex-1 space-y-1">
                <Label htmlFor={id + "-scale"}>{m.scale}</Label>
                <select
                  className={selectClass}
                  id={id + "-scale"}
                  value={scale}
                  onChange={(event) =>
                    setScale(Number(event.currentTarget.value))
                  }
                >
                  <option value={1}>1×</option>
                  <option value={2}>2×</option>
                </select>
              </div>
            ) : null}
            {hasBackground ? (
              <div className="min-w-24 flex-1 space-y-1">
                <Label htmlFor={id + "-background"}>{m.background}</Label>
                <select
                  className={selectClass}
                  id={id + "-background"}
                  value={background}
                  onChange={(event) => setBackground(event.currentTarget.value)}
                >
                  <option value="transparent">{m.transparent}</option>
                  <option value="white">{m.white}</option>
                </select>
              </div>
            ) : null}
          </fieldset>
          <Button
            onClick={() => void save()}
            disabled={!diagram || saving}
            aria-busy={saving}
            className="min-h-11 w-full sm:min-h-9"
          >
            {saving ? (
              <Spinner />
            ) : (
              <Download data-icon="inline-start" aria-hidden="true" />
            )}
            {saving ? m.downloadBusy : m.download}
          </Button>
          {status === "error" ? (
            <p role="alert" className="text-sm text-destructive">
              {m.downloadError}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
