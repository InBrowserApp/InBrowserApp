import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CaseSensitive,
  Download,
  LoaderCircle,
  Upload,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { ConversionResult, Messages } from "./types"

type FontRow = {
  file: File
  output?: ArrayBuffer | null
}

function FontDownload({
  output,
  filename,
  label,
}: {
  output: ArrayBuffer
  filename: string
  label: string
}) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    const nextUrl = URL.createObjectURL(
      new Blob([output], { type: "font/woff2" })
    )
    setUrl(nextUrl)
    return () => URL.revokeObjectURL(nextUrl)
  }, [output])

  if (!url) return null

  return (
    <Button asChild className="shrink-0">
      <a href={url} download={filename} data-astro-prefetch="false">
        <Download data-icon="inline-start" aria-hidden="true" />
        {label}
        <span className="sr-only">
          {" "}
          <bdi>{filename}</bdi>
        </span>
      </a>
    </Button>
  )
}

export default function FontToWoff2({
  messages,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const [rows, setRows] = useState<FontRow[]>([])
  const [dragging, setDragging] = useState(false)
  const picker = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const worker = useRef<Worker | null>(null)
  const busy = rows.some(({ output }) => output === undefined)
  const numbers = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 })

  const stopWorker = useCallback(() => {
    const job = worker.current
    if (!job) return
    worker.current = null
    job.onmessage = null
    job.onerror = null
    job.onmessageerror = null
    job.terminate()
  }, [])
  useEffect(() => stopWorker, [stopWorker])

  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${numbers.format(bytes)} B`
    if (bytes < 1024 ** 2) return `${numbers.format(bytes / 1024)} KiB`
    return `${numbers.format(bytes / 1024 ** 2)} MiB`
  }

  function addFonts(files: File[]) {
    if (!files.length || worker.current) return
    const start = rows.length
    setRows((current) => [...current, ...files.map((file) => ({ file }))])

    function failBatch() {
      stopWorker()
      setRows((current) =>
        current.map((row) =>
          row.output === undefined ? { ...row, output: null } : row
        )
      )
    }

    try {
      const job = new Worker(
        new URL("./workers/convert.worker.ts", import.meta.url),
        {
          type: "module",
        }
      )
      worker.current = job
      job.onmessage = ({ data }: MessageEvent<ConversionResult>) => {
        const { index, output } = data
        setRows((current) =>
          current.map((row, rowIndex) =>
            rowIndex === start + index ? { ...row, output } : row
          )
        )
        if (index === files.length - 1) stopWorker()
      }
      job.onerror = failBatch
      job.onmessageerror = failBatch
      job.postMessage(files)
    } catch {
      failBatch()
    }
  }

  return (
    <div className="grid min-w-0 gap-4">
      <ToolPanelCard>
        <ToolPanelCardContent className="gap-3">
          <button
            ref={picker}
            type="button"
            aria-disabled={busy}
            onClick={() => {
              if (!busy) input.current?.click()
            }}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(!busy)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              addFonts(Array.from(event.dataTransfer.files))
            }}
            className={cn(
              "flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/20 p-4 text-center transition-colors outline-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring aria-disabled:opacity-60 [&>*]:pointer-events-none",
              dragging && "border-primary bg-primary/5"
            )}
          >
            <span className="grid size-10 place-items-center rounded-lg bg-background text-muted-foreground ring-1 ring-border">
              <Upload className="size-5" aria-hidden="true" />
            </span>
            <span className="grid gap-1">
              <span className="font-medium">{messages.chooseFonts}</span>
              <span className="text-sm text-muted-foreground">
                {messages.dropFonts} · {messages.formats}
              </span>
            </span>
          </button>
          <input
            ref={input}
            type="file"
            accept=".ttf,.otf"
            multiple
            hidden
            aria-label={messages.chooseFonts}
            onChange={(event) => {
              addFonts(Array.from(event.currentTarget.files ?? []))
              event.currentTarget.value = ""
            }}
          />
          <p className="text-center text-xs text-muted-foreground">
            {messages.localProcessing}
          </p>
        </ToolPanelCardContent>
      </ToolPanelCard>
      {rows.length > 0 && (
        <ToolPanelCard>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
            <CardTitle>{messages.results}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                stopWorker()
                setRows([])
                picker.current?.focus()
              }}
            >
              {messages.clear}
            </Button>
          </CardHeader>
          <ToolPanelCardContent className="pt-2">
            <ul className="divide-y">
              {rows.map(({ file, output }, index) => {
                let status = messages.converting
                if (output === null) status = messages.failed
                else if (output) {
                  status = messages.sizes
                    .replace(
                      "{original}",
                      `\u2066${formatBytes(file.size)}\u2069`
                    )
                    .replace(
                      "{output}",
                      `\u2066${formatBytes(output.byteLength)}\u2069`
                    )
                }

                return (
                  <li
                    key={index}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 flex-1 basis-56 items-start gap-3">
                      <CaseSensitive
                        className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium wrap-anywhere">
                          <bdi>{file.name}</bdi>
                        </p>
                        <p
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                          role="status"
                        >
                          {output === undefined && (
                            <LoaderCircle
                              className="size-4 shrink-0 motion-safe:animate-spin"
                              aria-hidden="true"
                            />
                          )}
                          <span>{status}</span>
                        </p>
                      </div>
                    </div>
                    {output && (
                      <FontDownload
                        output={output}
                        filename={
                          file.name.replace(/\.(ttf|otf)$/i, "") + ".woff2"
                        }
                        label={messages.download}
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          </ToolPanelCardContent>
        </ToolPanelCard>
      )}
    </div>
  )
}
