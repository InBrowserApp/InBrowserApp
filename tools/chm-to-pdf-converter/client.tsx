import { useEffect, useId, useRef, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Check, FileText, Folder, Printer } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type Catalog from "./messages/en.json"

type Messages = Omit<typeof Catalog, "article">
type State =
  | { phase: "idle" }
  | { phase: "working"; file: File }
  | { phase: "ready"; file: File; url: string }
  | { phase: "error"; file: File }

export default function Client({ messages: m }: { messages: Messages }) {
  const input = useRef<HTMLInputElement>(null)
  const helpId = useId()
  const preview = useRef<HTMLIFrameElement>(null)
  const chooser = useRef<HTMLButtonElement>(null)
  const task = useRef<AbortController | null>(null)
  const dragDepth = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [state, setState] = useState<State>({ phase: "idle" })
  const [loadedUrl, setLoadedUrl] = useState<string>()
  const [printFailed, setPrintFailed] = useState(false)
  const working = state.phase === "working"
  const ready = state.phase === "ready"
  const url = ready ? state.url : null
  const loaded = url === loadedUrl
  const preparing = working || (ready && !loaded)

  useEffect(() => () => task.current?.abort(), [])
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url)
    },
    [url]
  )

  async function select(file: File) {
    task.current?.abort()
    const controller = new AbortController()
    task.current = controller
    const { signal } = controller
    setPrintFailed(false)
    setState({ phase: "working", file })
    try {
      const { prepareDocument } = await import("./prepare-document")
      signal.throwIfAborted()
      const html = await prepareDocument(file, signal)
      if (!signal.aborted) {
        const url = URL.createObjectURL(
          new Blob([html], { type: "text/html;charset=utf-8" })
        )
        setState({ phase: "ready", file, url })
      }
    } catch {
      if (!signal.aborted) setState({ phase: "error", file })
    }
  }

  function cancel() {
    task.current?.abort()
    setState({ phase: "idle" })
    chooser.current?.focus()
  }

  function savePdf() {
    try {
      const view = preview.current?.contentWindow
      if (typeof view?.print !== "function") {
        setPrintFailed(true)
        return
      }
      view.print()
      setPrintFailed(false)
    } catch {
      setPrintFailed(true)
    }
  }

  const status = preparing ? m.reading : ready ? m.ready : ""
  const Icon = loaded ? Check : FileText
  const failed = state.phase === "error"

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
          {preparing && <Spinner aria-hidden="true" className="shrink-0" />}
          {status}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {ready && (
            <Button
              onClick={savePdf}
              disabled={!loaded}
              aria-describedby={helpId}
              className="max-sm:min-h-11"
            >
              <Printer data-icon="inline-start" aria-hidden="true" />
              {m.save}
            </Button>
          )}
          <Button
            ref={chooser}
            className="h-auto min-h-8 max-w-full whitespace-normal max-sm:min-h-11"
            variant={ready || working ? "outline" : "default"}
            onClick={() => input.current?.click()}
          >
            <Folder data-icon="inline-start" aria-hidden="true" />
            {m.choose}
          </Button>
          {preparing && (
            <Button variant="ghost" onClick={cancel}>
              {m.cancel}
            </Button>
          )}
        </div>
        {ready && (
          <p id={helpId} className="text-sm text-muted-foreground">
            {m.saveHelp}
          </p>
        )}
        {state.phase === "idle" && (
          <p className="text-sm text-muted-foreground">
            {m.drop}
            <br />
            {m.privacy}
          </p>
        )}
      </div>
      {(failed || printFailed) && (
        <Alert variant="destructive" className="mt-3 text-start">
          {failed && <AlertTitle>{m.error}</AlertTitle>}
          <AlertDescription>
            {failed ? m.errorHelp : m.printUnavailable}
          </AlertDescription>
        </Alert>
      )}
      {ready && (
        <iframe
          key={state.url}
          ref={preview}
          src={state.url}
          title={m.preview}
          sandbox="allow-same-origin allow-modals"
          onLoad={() => setLoadedUrl(state.url)}
          className="mt-3 block h-[min(64dvh,36rem)] min-h-64 w-full rounded-xl border bg-white"
        />
      )}
    </section>
  )
}
