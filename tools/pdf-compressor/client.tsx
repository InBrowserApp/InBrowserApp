import { useEffect, useId, useRef, useState } from "react"

import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Download, FileText, LoaderCircle } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { presets } from "./protocol"
import type {
  CompressionLevel,
  CompressionRequest,
  CompressionResult,
} from "./protocol"
import type englishMessages from "./messages/en.json"

export type Messages = typeof englishMessages

type Props = { lang: string; messages: Messages }
type Result = Extract<
  CompressionResult,
  { status: "compressed" | "noSavings" | "signed" }
>
type ErrorMessage = "oneFile" | Exclude<CompressionResult, Result>["status"]
type Activity = "idle" | "compressing" | "cancelled" | Result

export default function PdfCompressor({ lang, messages }: Props) {
  const picker = useRef<HTMLInputElement>(null)
  const worker = useRef<Worker | null>(null)
  const levelId = useId()
  const [file, setFile] = useState<File | null>(null)
  const [level, setLevel] = useState<CompressionLevel>("balanced")
  const [dragging, setDragging] = useState(false)
  const [activity, setActivity] = useState<Activity>("idle")
  const [error, setError] = useState<ErrorMessage | null>(null)
  const [url, setUrl] = useState("")
  const busy = activity === "compressing"
  const result = typeof activity === "object" ? activity : null
  const compressed = result?.status === "compressed"
  const download = compressed ? result.blob : result && file

  useEffect(
    () => () => {
      worker.current?.terminate()
      worker.current = null
    },
    []
  )
  useEffect(() => {
    if (!download) {
      setUrl("")
      return
    }
    const nextUrl = URL.createObjectURL(download)
    setUrl(nextUrl)
    return () => URL.revokeObjectURL(nextUrl)
  }, [download])

  function selectFile(files: FileList | null) {
    const nextFile = files?.[0]
    if (worker.current || !nextFile) return
    if (files.length > 1) {
      if (activity === "cancelled") setActivity("idle")
      setError("oneFile")
      return
    }
    setFile(nextFile)
    clearAttempt()
  }

  function clearAttempt() {
    setActivity("idle")
    setError(null)
  }

  function stopWorker() {
    worker.current?.terminate()
    worker.current = null
  }

  function finish(response: CompressionResult) {
    stopWorker()
    const { status } = response
    if (
      status === "compressed" ||
      status === "noSavings" ||
      status === "signed"
    ) {
      setActivity(response)
    } else {
      setActivity("idle")
      setError(status)
    }
  }

  function compress() {
    if (!file || worker.current) return
    setError(null)
    setActivity("compressing")
    try {
      const task = new Worker(
        new URL("./compress.worker.ts", import.meta.url),
        {
          type: "module",
        }
      )
      worker.current = task

      const onResult = (response: CompressionResult) => {
        if (worker.current === task) finish(response)
      }
      task.onmessage = ({ data }: MessageEvent<CompressionResult>) =>
        onResult(data)
      task.onerror = task.onmessageerror = () => {
        onResult({ status: "compressionFailed" })
      }
      task.postMessage({ file, level } satisfies CompressionRequest)
    } catch {
      finish({ status: "compressionFailed" })
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)]">
        <div className="flex min-w-0 flex-col gap-3">
          <input
            ref={picker}
            type="file"
            accept="application/pdf,.pdf"
            aria-label={messages.choosePdf}
            hidden
            disabled={busy}
            onChange={(event) => {
              selectFile(event.currentTarget.files)
              event.currentTarget.value = ""
            }}
          />
          <button
            type="button"
            className={cn(
              "flex min-h-64 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/35 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait",
              dragging && "border-primary bg-primary/5"
            )}
            disabled={busy}
            onClick={() => picker.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(!busy)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              selectFile(event.dataTransfer.files)
            }}
          >
            <span className="rounded-xl border bg-background p-3 text-primary shadow-xs">
              <FileText className="size-6" aria-hidden="true" />
            </span>
            <span className="max-w-full font-medium wrap-anywhere" dir="auto">
              {file?.name ?? messages.choosePdf}
            </span>
            <span className="text-sm text-muted-foreground">
              {file ? formatSize(file.size, lang) : messages.dropPdf}
            </span>
            {file && (
              <span className="text-sm font-medium underline underline-offset-4">
                {messages.changePdf}
              </span>
            )}
          </button>
          <p className="text-sm text-muted-foreground">{messages.privacy}</p>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-4">
            <fieldset className="grid min-w-0 gap-2" disabled={busy}>
              <legend className="mb-2 font-semibold">
                {messages.compressionLevel}
              </legend>
              {(Object.keys(presets) as CompressionLevel[]).map((key) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-checked:border-primary/60 has-checked:bg-primary/5"
                >
                  <input
                    type="radio"
                    className="mt-1 size-4 shrink-0 accent-primary"
                    name={levelId}
                    checked={level === key}
                    onChange={() => {
                      setLevel(key)
                      clearAttempt()
                    }}
                  />
                  <span className="min-w-0 text-sm text-muted-foreground">
                    <span className="mb-0.5 block font-medium text-foreground">
                      {messages.presets[key].label}
                    </span>
                    {messages.presets[key].description}
                  </span>
                </label>
              ))}
            </fieldset>
            <p className="text-sm text-muted-foreground">{messages.keepText}</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled={!file || busy} onClick={compress}>
                {busy && (
                  <LoaderCircle
                    className="animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                )}
                {busy ? messages.compressing : messages.compress}
              </Button>
              {busy && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    stopWorker()
                    setActivity("cancelled")
                  }}
                >
                  {messages.cancel}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{messages[error]}</AlertDescription>
        </Alert>
      )}

      <div aria-live="polite">
        {activity === "cancelled" && (
          <p className="text-sm text-muted-foreground">{messages.cancelled}</p>
        )}
        {busy && <span className="sr-only">{messages.compressing}</span>}
        {file && result && download && (
          <Card>
            <CardContent className="flex flex-col gap-4">
              <h2 className="font-semibold">{messages.sizeComparison}</h2>
              <dl className="grid gap-2 sm:grid-cols-3">
                {[
                  [messages.originalSize, formatSize(file.size, lang)],
                  [messages.outputSize, formatSize(download.size, lang)],
                  [
                    messages.saved,
                    formatReduction(file.size, download.size, lang),
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border bg-muted/30 p-3"
                  >
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="mt-1 text-xl font-semibold tabular-nums">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              {!compressed && (
                <p className="text-sm text-muted-foreground">
                  {messages[result.status]}
                </p>
              )}
              {url && (
                <Button asChild className="w-fit max-w-full">
                  <a href={url} download={downloadName(file, compressed)}>
                    <Download data-icon="inline-start" aria-hidden="true" />
                    {compressed ? messages.download : messages.downloadOriginal}
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function formatSize(size: number, lang: string) {
  const [unit, divisor]: [string, number] =
    size >= 1_000_000
      ? ["megabyte", 1_000_000]
      : size >= 1000
        ? ["kilobyte", 1000]
        : ["byte", 1]
  return new Intl.NumberFormat(lang, {
    style: "unit",
    unit,
    maximumFractionDigits: 2,
  }).format(size / divisor)
}

function downloadName(file: File, compressed: boolean) {
  if (!compressed) return file.name
  return `${file.name.replace(/\.pdf$/i, "")}-compressed.pdf`
}

function formatReduction(inputSize: number, outputSize: number, lang: string) {
  const reduction = (inputSize - outputSize) / inputSize
  return new Intl.NumberFormat(lang, {
    style: "percent",
    maximumFractionDigits: 2,
    ...(reduction > 0 && reduction < 0.0001
      ? { maximumSignificantDigits: 1 }
      : {}),
  }).format(reduction)
}
