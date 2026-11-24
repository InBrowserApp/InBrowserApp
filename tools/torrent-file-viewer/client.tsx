import { useEffect, useRef, useState } from "react"
import { TorrentDetails } from "@workspace/ui/components/tool/torrent-details"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { FileText, Shield, TriangleAlert, Upload } from "@workspace/ui/icons"
import { exampleTorrent } from "./example"
import type { TorrentMessages } from "@workspace/ui/components/tool/torrent-details"
import type { TorrentResult, WorkerReply } from "./read-torrent"
import type EnglishMessages from "./messages/en.json"

type ReadState =
  | { status: "idle" | "reading" | "error" }
  | ({ status: "done" } & TorrentResult)

function TorrentFileViewer({
  language,
  messages: m,
  shared,
}: {
  language: string
  messages: typeof EnglishMessages
  shared: TorrentMessages
}) {
  const fileInput = useRef<HTMLInputElement>(null)
  const stopReading = useRef<() => void>(null)
  const [state, setState] = useState<ReadState>({ status: "idle" })
  const [dragging, setDragging] = useState(false)

  useEffect(() => () => stopReading.current?.(), [])

  function read(file: Blob) {
    stopReading.current?.()
    setState({ status: "reading" })

    try {
      const worker = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      })
      function stop() {
        window.clearTimeout(timeout)
        worker.terminate()
        stopReading.current = null
      }
      function finish(result: WorkerReply) {
        stop()
        setState(result ? { status: "done", ...result } : { status: "error" })
      }
      const timeout = window.setTimeout(() => finish(null), 10_000)
      stopReading.current = stop
      worker.onmessage = (event: MessageEvent<WorkerReply>) =>
        finish(event.data)
      worker.onerror = worker.onmessageerror = () => finish(null)
      worker.postMessage(file)
    } catch {
      stopReading.current?.()
      setState({ status: "error" })
    }
  }

  return (
    <div className="grid min-w-0 gap-4">
      <Card>
        <CardContent className="grid gap-3">
          <div
            className={`flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-5 text-center transition-colors ${dragging ? "border-primary bg-primary/10" : "border-border bg-muted/35"}`}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={(event) => {
              if (
                !(
                  event.relatedTarget instanceof Node &&
                  event.currentTarget.contains(event.relatedTarget)
                )
              ) {
                setDragging(false)
              }
            }}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              const file = event.dataTransfer.files[0]
              if (file) read(file)
            }}
          >
            <FileText
              aria-hidden="true"
              className="size-7 text-muted-foreground"
            />
            <input
              ref={fileInput}
              type="file"
              accept=".torrent,application/x-bittorrent"
              aria-label={m.chooseFile}
              hidden
              onChange={(event) => {
                const file = event.currentTarget.files?.[0]
                event.currentTarget.value = ""
                if (file) read(file)
              }}
            />
            <Button
              size="lg"
              type="button"
              onClick={() => fileInput.current?.click()}
            >
              <Upload data-icon="inline-start" aria-hidden="true" />
              {m.chooseFile}
            </Button>
            <p className="text-sm text-muted-foreground">{m.dropFile}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Shield aria-hidden="true" className="size-4 shrink-0" />{" "}
              {m.local}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => read(exampleTorrent())}
            >
              {m.example}
            </Button>
          </div>
        </CardContent>
      </Card>
      {state.status === "reading" ? (
        <p
          role="status"
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Spinner aria-hidden="true" />
          {m.reading}
        </p>
      ) : null}
      {state.status === "error" ? (
        <Alert variant="destructive">
          <TriangleAlert aria-hidden="true" />
          <AlertDescription>{m.invalid}</AlertDescription>
        </Alert>
      ) : null}
      {state.status === "done" ? (
        <TorrentDetails
          torrent={state.torrent}
          magnet={state.magnet}
          language={language}
          messages={shared}
        />
      ) : null}
    </div>
  )
}

export default TorrentFileViewer
