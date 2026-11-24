import { useEffect, useMemo, useRef, useState } from "react"

import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  FileJson2,
  Lock,
  Play,
  TriangleAlert,
  Upload,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { makeExample } from "./sample"
import type {
  SanitizeRequest,
  SanitizeResponse,
} from "./workers/sanitize.worker"
import type en from "./messages/en.json"

export type Messages = typeof en

type Selection = SanitizeRequest["options"] & { file?: File }
type Completed = { selection: Selection; response: SanitizeResponse }

const rules = ["parameters", "bodies"] as const
const metrics = [
  "requests",
  "removedCredentials",
  "maskedParameters",
  "removedBodies",
] as const

export default function HarSanitizer({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const input = useRef<HTMLInputElement>(null)
  const [selection, setSelection] = useState<Selection>({
    parameters: true,
    bodies: true,
  })
  const [dragging, setDragging] = useState(false)
  const [completed, setCompleted] = useState<Completed>()

  const { file } = selection
  const response =
    completed?.selection === selection ? completed.response : undefined
  const pending = !!file && !response
  const result = response?.status === "ready" ? response.result : undefined
  const numbers = useMemo(() => new Intl.NumberFormat(lang), [lang])
  const FileIcon = file ? FileJson2 : Upload

  function openFile(file: File) {
    setSelection((current) => ({ ...current, file }))
  }

  useEffect(() => {
    const { file, ...options } = selection
    if (!file) return

    let worker: Worker | undefined
    let active = true

    function close() {
      active = false
      worker?.terminate()
      worker = undefined
    }

    function complete(response: SanitizeResponse) {
      if (!active) return
      setCompleted({ selection, response })
      close()
    }

    try {
      worker = new Worker(
        new URL("./workers/sanitize.worker.ts", import.meta.url),
        { type: "module" }
      )
      worker.onmessage = ({ data }: MessageEvent<SanitizeResponse>) =>
        complete(data)
      worker.onerror = () => complete({ status: "failed" })
      worker.postMessage({ file, options } satisfies SanitizeRequest)
    } catch {
      complete({ status: "failed" })
    }

    return close
  }, [selection])

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <ToolPanelCard>
        <ToolPanelCardContent className="gap-3">
          <input
            ref={input}
            type="file"
            accept=".har,.json,application/json"
            hidden
            onChange={(event) => {
              const selected = event.currentTarget.files?.[0]
              if (selected) openFile(selected)
              event.currentTarget.value = ""
            }}
          />
          <button
            type="button"
            onClick={() => input.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              const dropped = event.dataTransfer.files[0]
              if (dropped) openFile(dropped)
            }}
            className={cn(
              "flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-muted/25 px-3 py-4 text-sm transition-colors hover:border-primary/60 hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none [&>*]:pointer-events-none",
              dragging && "border-primary bg-accent"
            )}
          >
            <span className="grid size-9 place-items-center rounded-lg bg-muted text-foreground">
              <FileIcon aria-hidden="true" className="size-5" />
            </span>
            <span className="font-medium">{m.open}</span>
            <span className="text-xs text-muted-foreground">{m.drop}</span>
          </button>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock aria-hidden="true" className="size-3.5 shrink-0" />
              {m.privacy}
            </p>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => openFile(makeExample())}
            >
              <Play aria-hidden="true" data-icon="inline-start" />
              {m.example}
            </Button>
          </div>
        </ToolPanelCardContent>
      </ToolPanelCard>

      <ToolPanelCard>
        <ToolPanelCardContent>
          <fieldset className="min-w-0 space-y-3">
            <legend className="font-heading text-base font-medium">
              {m.options}
            </legend>
            <p className="text-sm text-muted-foreground">{m.credentials}</p>
            {rules.map((rule) => (
              <label
                key={rule}
                className="flex cursor-pointer items-start gap-2 text-sm"
              >
                <Checkbox
                  className="mt-0.5"
                  checked={selection[rule]}
                  onCheckedChange={(checked) =>
                    setSelection((current) => ({
                      ...current,
                      [rule]: checked === true,
                    }))
                  }
                />
                <span>{m[rule]}</span>
              </label>
            ))}
          </fieldset>
        </ToolPanelCardContent>
      </ToolPanelCard>

      {file && (
        <ToolPanelCard className="min-w-0 md:col-span-2">
          <ToolPanelCardContent className="gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                {result && (
                  <h2 className="font-heading text-base font-medium">
                    {m.result}
                  </h2>
                )}
                <p
                  className="text-sm break-all text-muted-foreground"
                  dir="auto"
                >
                  {file.name}
                </p>
              </div>
              {result && (
                <DocumentDownload
                  file={result.output}
                  filename={
                    file.name.replace(/\.(?:har|json)$/i, "") + ".sanitized.har"
                  }
                  label={m.download}
                />
              )}
            </div>
            <div
              role="status"
              className={
                pending
                  ? "flex items-center gap-2 text-sm text-muted-foreground"
                  : "sr-only"
              }
            >
              {pending && (
                <>
                  <Spinner aria-hidden="true" />
                  {m.reading}
                </>
              )}
              {result && m.result}
            </div>
            {result && (
              <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {metrics.map((metric) => (
                  <div
                    key={metric}
                    className="flex min-w-0 flex-col gap-1 rounded-lg bg-muted/50 px-3 py-2.5"
                  >
                    <dt className="text-xs text-muted-foreground">
                      {m[metric]}
                    </dt>
                    <dd className="text-lg font-semibold tabular-nums">
                      {numbers.format(result.summary[metric])}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {response && response.status !== "ready" && (
              <Alert variant="destructive" className="text-start">
                <TriangleAlert aria-hidden="true" />
                <AlertDescription>{m[response.status]}</AlertDescription>
              </Alert>
            )}
          </ToolPanelCardContent>
        </ToolPanelCard>
      )}
    </div>
  )
}
