import { useEffect, useId, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import { Input } from "@workspace/ui/components/ui/input"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { ChevronLeft, ChevronRight, Download } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { exportSlides, type Format, type Render } from "./export-slides"
import type { Messages } from "./types"

type Scope = "current" | "whole" | "range"
type Preview = { slide: number } & ({ url: string } | { error: true })
const selectClass = "h-9 w-full rounded-md border bg-background px-2 text-sm"

export function SlideExport({
  file,
  render,
  total,
  messages: m,
}: {
  file: File
  render: Render
  total: number
  messages: Messages
}) {
  const id = useId()
  const job = useRef<AbortController | null>(null)
  const [slide, setSlide] = useState(1)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [format, setFormat] = useState<Format>("png")
  const [scale, setScale] = useState(1)
  const [scope, setScope] = useState<Scope>("current")
  const [start, setStart] = useState("1")
  const [end, setEnd] = useState(String(total))
  const [busy, setBusy] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const current = preview?.slide === slide ? preview : null
  const first =
    scope === "current" ? slide : scope === "whole" ? 1 : Number(start)
  const last =
    scope === "current" ? slide : scope === "whole" ? total : Number(end)
  const valid =
    Number.isInteger(first) &&
    Number.isInteger(last) &&
    first >= 1 &&
    first <= last &&
    last <= total

  useEffect(() => {
    const task = new AbortController()
    let url: string | undefined
    void render(slide, "png", 1, task.signal).then(
      (blob) => {
        if (task.signal.aborted) return
        url = URL.createObjectURL(blob)
        setPreview({ slide, url })
      },
      () => {
        if (!task.signal.aborted) setPreview({ slide, error: true })
      }
    )
    return () => {
      task.abort()
      if (url) URL.revokeObjectURL(url)
      setPreview(null)
    }
  }, [render, slide])

  useEffect(() => () => job.current?.abort(), [])

  async function download() {
    if (!valid || job.current) return
    const task = new AbortController()
    job.current = task
    setFailed(false)
    try {
      const output = await exportSlides(render, {
        first,
        last,
        name: file.name,
        format,
        scale,
        signal: task.signal,
        progress: (done, total) =>
          setBusy(
            m.exporting
              .replace("{done}", String(done))
              .replace("{total}", String(total))
          ),
      })
      if (!task.signal.aborted) downloadBlob(output.blob, output.name)
    } catch {
      if (!task.signal.aborted) setFailed(true)
    } finally {
      job.current = null
      setBusy(null)
    }
  }

  return (
    <div className="grid min-w-0 gap-4 overflow-auto p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium">{m.preview}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={m.previous}
              disabled={slide <= 1 || Boolean(busy)}
              onClick={() => setSlide(slide - 1)}
            >
              <ChevronLeft className="rtl:rotate-180" aria-hidden="true" />
            </Button>
            <select
              aria-label={m.page}
              className="h-8 rounded-md border bg-background px-2 text-sm tabular-nums"
              value={slide}
              disabled={Boolean(busy)}
              onChange={(event) => setSlide(Number(event.currentTarget.value))}
            >
              {Array.from({ length: total }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {m.page} {index + 1}
                </option>
              ))}
            </select>
            <span className="text-sm text-muted-foreground">
              {m.pageCount.replace("{total}", String(total))}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={m.next}
              disabled={slide >= total || Boolean(busy)}
              onClick={() => setSlide(slide + 1)}
            >
              <ChevronRight className="rtl:rotate-180" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="flex min-h-40 items-center justify-center rounded-md bg-muted p-2">
          {!current ? (
            <p role="status" className="flex items-center gap-2 text-sm">
              <Spinner />
              {m.loading}
            </p>
          ) : null}
          {current && "url" in current ? (
            <img
              src={current.url}
              alt={m.preview}
              className="max-h-[54vh] w-full object-contain"
            />
          ) : null}
          {current && "error" in current ? (
            <p role="status" className="px-3 text-sm">
              {m.unsupported}
            </p>
          ) : null}
        </div>
      </div>
      <div className="space-y-3 self-start rounded-md border p-3">
        <fieldset disabled={Boolean(busy)} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor={id + "-format"}>{m.format}</Label>
              <select
                id={id + "-format"}
                value={format}
                onChange={(event) =>
                  setFormat(event.currentTarget.value as Format)
                }
                className={selectClass}
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor={id + "-scale"}>{m.scale}</Label>
              <select
                id={id + "-scale"}
                value={scale}
                onChange={(event) =>
                  setScale(Number(event.currentTarget.value))
                }
                className={selectClass}
              >
                <option value={1}>1×</option>
                <option value={2}>2×</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor={id + "-scope"}>{m.scope}</Label>
            <select
              id={id + "-scope"}
              value={scope}
              onChange={(event) => setScope(event.currentTarget.value as Scope)}
              className={selectClass}
            >
              <option value="current">{m.current}</option>
              <option value="range">{m.range}</option>
              <option value="whole">{m.whole}</option>
            </select>
          </div>
          {scope === "range" ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor={id + "-first"}>{m.first}</Label>
                <Input
                  id={id + "-first"}
                  type="number"
                  min={1}
                  max={total}
                  value={start}
                  onChange={(event) => setStart(event.currentTarget.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={id + "-last"}>{m.last}</Label>
                <Input
                  id={id + "-last"}
                  type="number"
                  min={1}
                  max={total}
                  value={end}
                  onChange={(event) => setEnd(event.currentTarget.value)}
                />
              </div>
            </div>
          ) : null}
        </fieldset>
        {!valid ? (
          <p className="text-sm text-destructive" role="status">
            {m.rangeError.replace("{total}", String(total))}
          </p>
        ) : null}
        <Button
          className="min-h-11 w-full sm:min-h-9"
          disabled={!valid || Boolean(busy)}
          aria-busy={Boolean(busy)}
          onClick={() => void download()}
        >
          <Download data-icon="inline-start" aria-hidden="true" />
          {first === last ? m.download : m.downloadZip}
        </Button>
        {busy ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p role="status" className="text-sm text-muted-foreground">
              {busy}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => job.current?.abort()}
            >
              {m.cancel}
            </Button>
          </div>
        ) : null}
        {failed ? (
          <Alert variant="destructive">
            <AlertDescription>{m.downloadError}</AlertDescription>
          </Alert>
        ) : null}
      </div>
    </div>
  )
}
