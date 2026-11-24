import { useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ChevronDown,
  Download,
  FileText,
  ImageUp,
  LoaderCircle,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { example } from "./example"
import { millimeters, pageLayout, prepareSvg } from "@workspace/svg-pdf/svg"
import type { PageSize } from "@workspace/svg-pdf/svg"
import type en from "./messages/en.json"

export type Messages = typeof en

type Source = { filename: string; artwork: ReturnType<typeof prepareSvg> }
type Status =
  | "reading"
  | "converting"
  | "downloadReady"
  | "invalidSvg"
  | "conversionFailed"

export default function Client({
  language,
  messages,
}: {
  language: string
  messages: Messages
}) {
  const input = useRef<HTMLInputElement>(null)
  const pageSizeId = useId()
  const hintId = `${pageSizeId}-hint`
  const [source, setSource] = useState<Source>()
  const [size, setSize] = useState<PageSize>("original")
  const [status, setStatus] = useState<Status>()
  const [dragging, setDragging] = useState(false)
  const busy = status === "reading" || status === "converting"
  const error = status === "invalidSvg" || status === "conversionFailed"

  function chooseFile() {
    input.current?.click()
  }

  async function loadSvg(file: File) {
    if (busy) return
    setStatus("reading")
    try {
      setSource({ filename: file.name, artwork: prepareSvg(await file.text()) })
      setStatus(undefined)
    } catch {
      setStatus("invalidSvg")
    }
  }

  async function convert() {
    if (!source || busy) return
    setStatus("converting")
    try {
      const { createPdf } = await import("@workspace/svg-pdf/export")
      const pdf = await createPdf(source.artwork, size)
      const baseName = source.filename.replace(/\.svg$/i, "") || "image"
      pdf.save(`${baseName}.pdf`)
      setStatus("downloadReady")
    } catch {
      setStatus("conversionFailed")
    }
  }

  const layout = source ? pageLayout(source.artwork, size) : null
  const number = new Intl.NumberFormat(language, { maximumFractionDigits: 2 })
  const dimensions = layout
    ? messages.dimensions
        .replace("{width}", number.format(millimeters(layout.width)))
        .replace("{height}", number.format(millimeters(layout.height)))
    : null

  return (
    <div className="grid gap-3">
      <input
        ref={input}
        type="file"
        accept=".svg,image/svg+xml"
        aria-label={messages.chooseSvg}
        hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ""
          if (file) void loadSvg(file)
        }}
      />
      <div
        className={cn(
          "rounded-xl transition-colors",
          dragging && "ring-2 ring-primary ring-offset-2 ring-offset-background"
        )}
        onDragOver={(event) => {
          if (!event.dataTransfer.types.includes("Files")) return
          event.preventDefault()
          event.dataTransfer.dropEffect = busy ? "none" : "copy"
          setDragging(!busy)
        }}
        onDragLeave={(event) => {
          if (
            !(event.relatedTarget instanceof Node) ||
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            setDragging(false)
          }
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          const file = event.dataTransfer.files[0]
          if (file) void loadSvg(file)
        }}
      >
        {source ? (
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(15rem,0.65fr)] lg:grid-cols-[minmax(0,1fr)_21rem]">
            <section
              aria-label={messages.preview}
              className="min-w-0 overflow-hidden rounded-xl border bg-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b p-3 sm:px-4">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <FileText
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <bdi
                    className="truncate text-sm font-medium"
                    title={source.filename}
                  >
                    {source.filename}
                  </bdi>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={chooseFile}
                >
                  {messages.changeSvg}
                </Button>
              </div>
              <div className="flex h-56 items-center justify-center bg-muted/45 p-4 sm:h-72 sm:p-6">
                <img
                  src={source.artwork.preview}
                  alt={messages.preview}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </section>
            <div className="grid min-w-0 content-start gap-4 rounded-xl border bg-card p-4 sm:p-5">
              <div className="grid min-w-0 gap-2">
                <label htmlFor={pageSizeId} className="text-sm font-medium">
                  {messages.pageSize}
                </label>
                <div className="relative min-w-0">
                  <select
                    id={pageSizeId}
                    aria-describedby={hintId}
                    className="h-10 w-full appearance-none rounded-lg border border-input bg-background ps-3 pe-9 text-sm focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    value={size}
                    disabled={busy}
                    onChange={(event) => {
                      setSize(event.currentTarget.value as PageSize)
                      setStatus(undefined)
                    }}
                  >
                    <option value="original">{messages.original}</option>
                    <option value="a4">{messages.a4}</option>
                    <option value="letter">{messages.letter}</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute inset-e-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <p
                  id={hintId}
                  className="min-h-10 text-sm leading-5 text-muted-foreground"
                >
                  <bdi>{dimensions}</bdi>
                  {size !== "original" && (
                    <span className="block">{messages.fitPaper}</span>
                  )}
                </p>
              </div>
              <Button
                type="button"
                size="lg"
                className="h-auto min-h-11 w-full py-2 whitespace-normal"
                disabled={busy}
                onClick={() => void convert()}
              >
                {status === "converting" ? (
                  <LoaderCircle
                    data-icon="inline-start"
                    className="motion-safe:animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Download data-icon="inline-start" aria-hidden="true" />
                )}
                {status === "converting"
                  ? messages.converting
                  : messages.download}
              </Button>
              <div
                role="status"
                className={cn(
                  "text-sm text-muted-foreground",
                  (!status || error || status === "converting") && "sr-only"
                )}
              >
                {status && !error ? messages[status] : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid min-h-56 place-content-center justify-items-center gap-4 rounded-xl border border-dashed border-border bg-muted/35 px-4 py-8 text-center">
            <div className="grid size-12 place-items-center rounded-xl border bg-card text-muted-foreground">
              <ImageUp className="size-5" aria-hidden="true" />
            </div>
            <p className="text-base font-medium" role="status">
              {status === "reading" ? messages.reading : messages.dropSvg}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button type="button" disabled={busy} onClick={chooseFile}>
                {messages.chooseSvg}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() =>
                  void loadSvg(
                    new File([example], "alpine.svg", { type: "image/svg+xml" })
                  )
                }
              >
                {messages.tryExample}
              </Button>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {messages[status]}
        </p>
      )}
    </div>
  )
}
