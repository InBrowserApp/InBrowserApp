import { useEffect, useMemo, useRef, useState } from "react"
import { failureMessage } from "@workspace/comic/errors"
import type { Comic } from "@workspace/comic/types"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileArchive,
  X,
} from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { PageGrid, pageGroupSize } from "./page-grid"
import { canRead } from "./types"
import type { Format, Messages } from "./types"

type ExportStatus = { kind: "working" | "error"; message: string }

export function Results({
  comic,
  file,
  lang,
  messages: m,
}: {
  comic: Comic
  file: File
  lang: string
  messages: Messages
}) {
  const selectable = useMemo(
    () => comic.pages.flatMap((page, index) => (canRead(page) ? [index] : [])),
    [comic]
  )
  const [selected, setSelected] = useState(() => new Set(selectable))
  const [start, setStart] = useState(0)
  const [format, setFormat] = useState<Format>("original")
  const [status, setStatus] = useState<ExportStatus | null>(null)
  const active = useRef<AbortController>(null)
  const busy = status?.kind === "working"
  const total = comic.pages.length
  const end = Math.min(start + pageGroupSize, total)
  const number = useMemo(() => new Intl.NumberFormat(lang), [lang])
  const single = selected.size === 1

  useEffect(() => () => active.current?.abort(), [])

  function toggle(index: number) {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
    setStatus(null)
  }

  function selectPages(indexes: readonly number[]) {
    setSelected(new Set(indexes))
    setStatus(null)
  }

  function cancel() {
    active.current?.abort()
    active.current = null
    setStatus(null)
  }

  async function download() {
    const controller = new AbortController()
    active.current = controller
    const { signal } = controller
    function progress(page: number, total: number) {
      setStatus({
        kind: "working",
        message: m.preparing
          .replace("{page}", number.format(page))
          .replace("{total}", number.format(total)),
      })
    }
    progress(1, selected.size)
    try {
      const { exportImages } = await import("./export-images")
      signal.throwIfAborted()
      const result = await exportImages(
        comic,
        file.name,
        selected,
        format,
        signal,
        progress
      )
      signal.throwIfAborted()
      downloadBlob(result.blob, result.name)
      setStatus(null)
    } catch (error) {
      if (!signal.aborted)
        setStatus({ kind: "error", message: failureMessage(error, m) })
    } finally {
      if (active.current === controller) active.current = null
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b bg-muted/20 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-sm font-medium" role="status">
            {m.selected
              .replace("{selected}", number.format(selected.size))
              .replace("{total}", number.format(total))}
          </p>
          <div className="flex flex-wrap items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="min-h-11 sm:min-h-8"
              disabled={busy || selected.size === selectable.length}
              onClick={() => selectPages(selectable)}
            >
              {m.selectAll}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="min-h-11 sm:min-h-8"
              disabled={busy || !selected.size}
              onClick={() => selectPages([])}
            >
              {m.clearSelection}
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            dir={lang === "ar" || lang === "he" ? "rtl" : "ltr"}
            value={format}
            disabled={busy}
            onValueChange={(value) => {
              setFormat(value === "jpg" ? "jpg" : "original")
              setStatus(null)
            }}
          >
            <SelectTrigger
              aria-label={m.format}
              className="min-h-11 sm:min-h-8"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="original">{m.original}</SelectItem>
              <SelectItem value="jpg">{m.jpg}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="min-h-11 sm:min-h-8"
            disabled={!selected.size}
            onClick={busy ? cancel : download}
            variant={busy ? "outline" : "default"}
          >
            {busy ? (
              <X data-icon="inline-start" aria-hidden="true" />
            ) : single ? (
              <Download data-icon="inline-start" aria-hidden="true" />
            ) : (
              <FileArchive data-icon="inline-start" aria-hidden="true" />
            )}
            {busy ? m.cancel : single ? m.downloadImage : m.downloadZip}
          </Button>
        </div>
      </div>
      {status?.kind === "working" ? (
        <p
          role="status"
          className="flex items-center gap-2 border-b px-4 py-3 text-sm"
        >
          <Spinner aria-hidden="true" className="shrink-0" />
          {status.message}
        </p>
      ) : status?.kind === "error" ? (
        <Alert variant="destructive" className="rounded-none border-0 border-b">
          <AlertTitle>{m.exportError}</AlertTitle>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      ) : null}
      {total > pageGroupSize ? (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
          <p role="status" className="text-sm text-muted-foreground">
            {m.shown
              .replace("{first}", number.format(start + 1))
              .replace("{last}", number.format(end))
              .replace("{total}", number.format(total))}
          </p>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="outline"
              className="size-11 sm:size-8"
              aria-label={m.previous}
              disabled={busy || start === 0}
              onClick={() => setStart(start - pageGroupSize)}
            >
              <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="size-11 sm:size-8"
              aria-label={m.next}
              disabled={busy || end === total}
              onClick={() => setStart(end)}
            >
              <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-4" />
      )}
      <PageGrid
        comic={comic}
        start={start}
        selected={selected}
        busy={busy}
        onToggle={toggle}
        messages={m}
        number={number}
      />
    </>
  )
}
