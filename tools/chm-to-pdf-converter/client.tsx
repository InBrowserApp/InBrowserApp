import { useEffect, useRef, useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Check, FileText, Folder } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { Progress, Result } from "@workspace/html-pdf"
import type Catalog from "./messages/en.json"

type Messages = Omit<typeof Catalog, "article">
type State =
  | { phase: "idle" }
  | { phase: "working"; file: File; progress?: Progress }
  | { phase: "ready"; file: File; result: Result }
  | { phase: "error"; file: File }

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const input = useRef<HTMLInputElement>(null)
  const chooser = useRef<HTMLButtonElement>(null)
  const task = useRef<AbortController | null>(null)
  const dragDepth = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [state, setState] = useState<State>({ phase: "idle" })
  const numbers = new Intl.NumberFormat(lang)
  const working = state.phase === "working"
  const ready = state.phase === "ready"

  useEffect(() => () => task.current?.abort(), [])

  async function select(file: File) {
    task.current?.abort()
    const controller = new AbortController()
    task.current = controller
    const { signal } = controller
    setState({ phase: "working", file })
    try {
      const { convert } = await import("./convert")
      signal.throwIfAborted()
      const result = await convert(file, signal, (progress) => {
        if (!signal.aborted) setState({ phase: "working", file, progress })
      })
      if (!signal.aborted) setState({ phase: "ready", file, result })
    } catch {
      if (!signal.aborted) setState({ phase: "error", file })
    }
  }

  function cancel() {
    task.current?.abort()
    setState({ phase: "idle" })
    chooser.current?.focus()
  }

  let status = ""
  if (working) {
    const progress = state.progress
    if (!progress) status = m.reading
    else if (progress.saving) status = m.saving
    else {
      status = m.rendering
        .replace("{page}", numbers.format(progress.page))
        .replace("{total}", numbers.format(progress.pages))
    }
  } else if (ready) {
    status = `${m.ready} · ${m.pageCount.replace("{total}", numbers.format(state.result.pages))}`
  }
  const Icon = ready ? Check : FileText

  return (
    <section data-tool="chm-to-pdf-converter">
      <div
        className={cn(
          "flex min-h-64 flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-4 py-8 text-center",
          dragging && "border-primary bg-muted"
        )}
        onDragEnter={(event) => {
          if (!event.dataTransfer.types.includes("Files")) return
          event.preventDefault()
          dragDepth.current++
          setDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => {
          dragDepth.current = Math.max(0, dragDepth.current - 1)
          if (!dragDepth.current) setDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          dragDepth.current = 0
          setDragging(false)
          const file = event.dataTransfer.files[0]
          if (file) void select(file)
        }}
      >
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <input
          ref={input}
          type="file"
          accept=".chm,application/vnd.ms-htmlhelp"
          aria-label={m.choose}
          hidden
          onChange={(event) => {
            const file = event.currentTarget.files?.[0]
            event.currentTarget.value = ""
            if (file) void select(file)
          }}
        />
        {state.phase !== "idle" && (
          <p
            dir="auto"
            className="max-w-full text-sm font-medium wrap-anywhere"
          >
            {state.file.name}
          </p>
        )}
        <p
          role="status"
          className={cn(
            "flex items-center justify-center gap-2 text-sm text-muted-foreground",
            !status && "sr-only"
          )}
        >
          {working && <Spinner aria-hidden="true" className="shrink-0" />}
          {status}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {ready && (
            <DocumentDownload
              file={state.result.pdf}
              filename={state.file.name.replace(/\.chm$/i, "") + ".pdf"}
              label={m.download}
            />
          )}
          <Button
            ref={chooser}
            className="h-auto min-h-8 max-w-full whitespace-normal"
            variant={ready || working ? "outline" : "default"}
            onClick={() => input.current?.click()}
          >
            <Folder data-icon="inline-start" aria-hidden="true" />
            {m.choose}
          </Button>
          {working && (
            <Button variant="ghost" onClick={cancel}>
              {m.cancel}
            </Button>
          )}
        </div>
        {state.phase === "idle" && (
          <p className="text-sm text-muted-foreground">
            {m.drop}
            <br />
            {m.privacy}
          </p>
        )}
      </div>
      {state.phase === "error" && (
        <Alert variant="destructive" className="mt-3 text-start">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{m.errorHelp}</AlertDescription>
        </Alert>
      )}
    </section>
  )
}
