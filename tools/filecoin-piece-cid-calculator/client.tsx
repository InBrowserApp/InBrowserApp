import { useEffect, useId, useRef, useState, type DragEvent } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { FileText, Hash, Upload } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { PieceCommitment } from "./core/commitment"
import { comparePiece } from "./core/compare"
import type EnglishMessages from "./messages/en.json"
import type { PieceWorkerReply } from "./piece.worker"

export default function PieceCidCalculator({
  language,
  messages,
}: {
  language: string
  messages: typeof EnglishMessages
}) {
  const fileInput = useRef<HTMLInputElement>(null)
  const job = useRef<Worker | null>(null)
  const compareId = useId()
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<PieceCommitment | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)
  const [expected, setExpected] = useState("")
  const [comparison, setComparison] = useState<ReturnType<
    typeof comparePiece
  > | null>(null)

  useEffect(() => () => job.current?.terminate(), [])

  function stop() {
    job.current?.terminate()
    job.current = null
    setProgress(null)
  }

  function select(next: File) {
    stop()
    setFile(next)
    setError("")
    setResult(null)
    setExpected("")
    setComparison(null)
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    const { files, items } = event.dataTransfer
    if (files.length !== 1 || items[0]?.webkitGetAsEntry()?.isDirectory) {
      setError(messages.singleFile)
      return
    }
    select(files[0]!)
  }

  function start() {
    if (!file || job.current) return
    setError("")
    setResult(null)
    setComparison(null)
    setProgress(0)

    function fail() {
      stop()
      setError(messages.failed)
    }

    try {
      const worker = new Worker(new URL("./piece.worker.ts", import.meta.url), {
        type: "module",
      })
      job.current = worker
      worker.onmessage = ({ data }: MessageEvent<PieceWorkerReply>) => {
        if (job.current !== worker) return
        switch (data.type) {
          case "progress":
            setProgress(data.percent)
            break
          case "result":
            setResult(data.result)
            stop()
            break
          case "error":
            fail()
            break
        }
      }
      worker.onerror = () => {
        if (job.current === worker) fail()
      }
      worker.postMessage(file)
    } catch {
      fail()
    }
  }

  const bytes = new Intl.NumberFormat(language, {
    style: "unit",
    unit: "byte",
    unitDisplay: "long",
  })

  return (
    <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
      <ToolPanelCard>
        <CardHeader>
          <CardTitle>{messages.input}</CardTitle>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <div
            className={cn(
              "grid min-h-36 place-content-center justify-items-center gap-2 rounded-xl border border-dashed bg-muted/30 p-4 text-center",
              dragging && "border-primary bg-primary/5"
            )}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = "copy"
              setDragging(true)
            }}
            onDragLeave={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null
                )
              ) {
                setDragging(false)
              }
            }}
            onDrop={drop}
          >
            {file ? (
              <FileText
                aria-hidden="true"
                className="size-6 text-muted-foreground"
              />
            ) : (
              <Upload
                aria-hidden="true"
                className="size-6 text-muted-foreground"
              />
            )}
            <p dir="auto" className="text-sm wrap-anywhere">
              {file?.name || messages.drop}
            </p>
            {file && (
              <p className="text-xs text-muted-foreground">
                {bytes.format(file.size)}
              </p>
            )}
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => fileInput.current?.click()}
            >
              {messages.chooseFile}
            </Button>
            <input
              ref={fileInput}
              hidden
              type="file"
              onChange={(event) => {
                const next = event.target.files?.[0]
                event.target.value = ""
                if (next) select(next)
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              disabled={!file || progress !== null}
              onClick={start}
            >
              <Hash data-icon="inline-start" aria-hidden="true" />
              {messages.calculate}
            </Button>
            {progress !== null && (
              <Button type="button" variant="ghost" onClick={stop}>
                {messages.cancel}
              </Button>
            )}
          </div>
          {progress !== null && (
            <div className="grid gap-1">
              <p role="status" className="text-sm text-muted-foreground">
                {messages.calculating}
              </p>
              <progress
                aria-label={messages.calculating}
                max={100}
                value={progress}
                className="w-full accent-primary"
              />
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>

      <ToolPanelCard>
        <CardHeader>
          <CardTitle>{messages.result}</CardTitle>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          {result ? (
            <>
              {(["pieceCid", "legacyCid"] as const).map((key) => (
                <div className="grid gap-2" key={key}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">{messages[key]}</p>
                    <ToolCopyButton
                      value={result[key]}
                      copyLabel={messages.copy}
                      copiedLabel={messages.copied}
                      ariaLabel={`${messages.copy} · ${messages[key]}`}
                    />
                  </div>
                  <code
                    dir="ltr"
                    className="rounded-lg bg-muted p-2.5 text-sm wrap-anywhere"
                  >
                    {result[key]}
                  </code>
                </div>
              ))}
              <dl className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm">
                <dt className="text-muted-foreground">{messages.paddedSize}</dt>
                <dd className="font-medium tabular-nums">
                  {bytes.format(result.paddedSize)}
                </dd>
              </dl>
              <form
                className="grid gap-2 border-t pt-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  setComparison(comparePiece(expected, result))
                }}
              >
                <label className="text-sm font-medium" htmlFor={compareId}>
                  {messages.compare}
                </label>
                <div className="flex items-start gap-2">
                  <Input
                    id={compareId}
                    dir="ltr"
                    className="min-w-0 font-mono"
                    value={expected}
                    onChange={(event) => {
                      setExpected(event.target.value)
                      setComparison(null)
                    }}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-invalid={comparison === "invalid"}
                    aria-describedby={
                      comparison ? `${compareId}-status` : undefined
                    }
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={!expected.trim()}
                  >
                    {messages.check}
                  </Button>
                </div>
                <p
                  id={`${compareId}-status`}
                  role="status"
                  className={cn(
                    "text-sm empty:hidden",
                    comparison === "invalid" && "text-destructive"
                  )}
                >
                  {comparison && messages[comparison]}
                </p>
              </form>
            </>
          ) : (
            <p className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
              {messages.empty}
            </p>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>
    </div>
  )
}
