import { useEffect, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { ImageUp, LoaderCircle } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { HistogramChart } from "./histogram-chart"
import type { Analysis, Reply } from "./histogram.worker"
import type { Messages } from "./types"

type Result = Omit<Analysis, "preview"> & { name: string; src: string }

export default function ImageHistogram({
  lang,
  messages: m,
}: {
  lang: string
  messages: Messages
}) {
  const picker = useRef<HTMLInputElement>(null)
  const worker = useRef<Worker | null>(null)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [result, setResult] = useState<Result | null>(null)
  const number = new Intl.NumberFormat(lang)

  useEffect(
    () => () => {
      worker.current?.terminate()
      worker.current = null
    },
    []
  )
  useEffect(
    () => () => {
      if (result) URL.revokeObjectURL(result.src)
    },
    [result]
  )

  function open(source: File | "sample") {
    worker.current?.terminate()
    setStatus("loading")

    try {
      const job = new Worker(
        new URL("./histogram.worker.ts", import.meta.url),
        {
          type: "module",
        }
      )
      worker.current = job
      const finish = (analysis: Reply) => {
        if (worker.current !== job) return
        job.terminate()
        worker.current = null
        if (analysis) {
          const { preview, ...data } = analysis
          setResult({
            ...data,
            name: source === "sample" ? m.sampleName : source.name,
            src: URL.createObjectURL(preview),
          })
        }
        setStatus(analysis ? "idle" : "error")
      }
      job.onmessage = ({ data }: MessageEvent<Reply>) => finish(data)
      job.onerror = () => finish(null)
      job.postMessage(source)
    } catch {
      worker.current?.terminate()
      worker.current = null
      setStatus("error")
    }
  }

  return (
    <div className="grid gap-4">
      <div
        className={cn(
          "min-w-0 rounded-lg border bg-card",
          result ? "px-4 py-3" : "border-dashed px-4 py-8 sm:py-10",
          dragging && "border-primary bg-accent"
        )}
        onDragOver={(event) => {
          if (!event.dataTransfer.types.includes("Files")) return
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            setDragging(false)
          }
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          const file = event.dataTransfer.files[0]
          if (file) open(file)
        }}
      >
        <input
          ref={picker}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.currentTarget.files?.[0]
            event.currentTarget.value = ""
            if (file) open(file)
          }}
        />
        <div
          className={cn(
            "flex flex-wrap items-center gap-3",
            result ? "justify-start" : "justify-center"
          )}
        >
          {!result && (
            <div className="flex basis-full justify-center">
              <ImageUp
                aria-hidden="true"
                className="size-11 rounded-xl bg-muted p-2.5 text-muted-foreground"
              />
            </div>
          )}
          <Button
            type="button"
            variant={result ? "outline" : "default"}
            className="min-h-9"
            onClick={() => picker.current?.click()}
          >
            {result && <ImageUp aria-hidden="true" data-icon="inline-start" />}
            {result ? m.replaceImage : m.chooseImage}
          </Button>
          <p
            className={cn(
              "text-sm text-muted-foreground",
              result && "pointer-coarse:hidden"
            )}
          >
            {m.dropHint}
          </p>
          {!result && (
            <p className="-mt-1 basis-full text-center text-xs text-muted-foreground">
              {m.formatHint}
            </p>
          )}
          <Button
            type="button"
            variant="link"
            size="sm"
            className={result ? "ms-auto min-h-9" : "-mt-2"}
            onClick={() => open("sample")}
          >
            {m.trySample}
          </Button>
        </div>
        <p
          className={
            status === "loading"
              ? "mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground"
              : "sr-only"
          }
          role="status"
        >
          {status === "loading" && (
            <>
              <LoaderCircle
                aria-hidden="true"
                className="size-4 motion-safe:animate-spin"
              />
              {m.loading}
            </>
          )}
          {status === "idle" &&
            result &&
            (result.histogram.pixels ? (
              <>
                {m.preview} · <bdi>{result.name}</bdi>
              </>
            ) : (
              m.transparent
            ))}
        </p>
        {status === "error" && (
          <p className="mt-3 text-center text-sm text-destructive" role="alert">
            {m.error}
          </p>
        )}
      </div>

      {result && (
        <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <figure className="min-w-0 overflow-hidden rounded-lg border bg-card">
            <div className="grid h-36 place-items-center bg-muted sm:h-64">
              <img
                src={result.src}
                alt={m.preview}
                className="h-full min-h-0 w-full object-contain"
              />
            </div>
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-4 py-3 text-sm">
              <bdi className="min-w-0 font-medium [overflow-wrap:anywhere]">
                {result.name}
              </bdi>
              <span dir="ltr" className="text-muted-foreground tabular-nums">
                {number.format(result.width)} × {number.format(result.height)}
              </span>
            </figcaption>
          </figure>
          {result.histogram.pixels ? (
            <HistogramChart
              histogram={result.histogram}
              lang={lang}
              messages={m}
            />
          ) : (
            <p className="rounded-lg border bg-card p-4 text-sm">
              {m.transparent}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
