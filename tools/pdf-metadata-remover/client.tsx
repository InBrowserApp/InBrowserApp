import { useEffect, useRef, useState } from "react"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Check,
  Download,
  Eraser,
  FileText,
  LoaderCircle,
  TriangleAlert,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type englishMessages from "./messages/en.json"
import type { RemovalResult } from "./remove-metadata.worker"

export type Messages = typeof englishMessages

type Activity = "idle" | "removing" | { downloadUrl: string }
type ErrorMessage = "oneFile" | "encryptedPdf" | "invalidPdf"

export default function PdfMetadataRemover({
  messages,
}: {
  messages: Messages
}) {
  const picker = useRef<HTMLInputElement>(null)
  const worker = useRef<Worker | null>(null)
  const removeButton = useRef<HTMLButtonElement>(null)
  const focusDownload = useRef(false)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [activity, setActivity] = useState<Activity>("idle")
  const [error, setError] = useState<ErrorMessage | null>(null)
  const busy = activity === "removing"
  const downloadUrl = typeof activity === "object" ? activity.downloadUrl : ""

  useEffect(() => () => worker.current?.terminate(), [])
  useEffect(() => {
    if (!downloadUrl) return
    return () => URL.revokeObjectURL(downloadUrl)
  }, [downloadUrl])

  function chooseFiles(files: FileList | null) {
    const nextFile = files?.[0]
    if (worker.current || !nextFile) return
    if (files.length > 1) {
      setError("oneFile")
      return
    }
    setFile(nextFile)
    setError(null)
    setActivity("idle")
  }

  function removeMetadata() {
    if (!file || worker.current) return
    setError(null)
    setActivity("removing")

    function finish(response: RemovalResult) {
      worker.current?.terminate()
      worker.current = null
      if (response.status === "success") {
        // The remove button is replaced by the download link on success.
        focusDownload.current = document.activeElement === removeButton.current
        setActivity({ downloadUrl: URL.createObjectURL(response.pdf) })
      } else {
        setActivity("idle")
        setError(response.status)
      }
    }

    try {
      const task = new Worker(
        new URL("./remove-metadata.worker.ts", import.meta.url),
        { type: "module" }
      )
      worker.current = task
      task.onmessage = ({ data }: MessageEvent<RemovalResult>) => finish(data)
      task.onerror = task.onmessageerror = () =>
        finish({ status: "invalidPdf" })
      task.postMessage(file)
    } catch {
      finish({ status: "invalidPdf" })
    }
  }

  return (
    <ToolPanelCard>
      <ToolPanelCardContent className="gap-4">
        <input
          ref={picker}
          type="file"
          accept="application/pdf,.pdf"
          aria-label={messages.choosePdf}
          hidden
          disabled={busy}
          onChange={(event) => {
            chooseFiles(event.currentTarget.files)
            event.currentTarget.value = ""
          }}
        />
        <button
          type="button"
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/35 p-5 text-center transition-colors hover:border-primary/50 hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait",
            !file && "min-h-44",
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
            chooseFiles(event.dataTransfer.files)
          }}
        >
          <span className="rounded-lg border bg-background p-2.5 text-primary shadow-xs">
            <FileText className="size-5" aria-hidden="true" />
          </span>
          <span className="max-w-full font-medium wrap-anywhere" dir="auto">
            {file?.name ?? messages.choosePdf}
          </span>
          <span className="text-sm text-muted-foreground">
            {file ? messages.changePdf : messages.dropPdf}
          </span>
        </button>

        {error && (
          <Alert variant="destructive" className="text-start">
            <TriangleAlert aria-hidden="true" />
            <AlertDescription>{messages[error]}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{messages.privacy}</p>
            <p
              role="status"
              className={
                downloadUrl
                  ? "mt-1 flex items-center gap-2 text-sm font-medium"
                  : "sr-only"
              }
            >
              {downloadUrl ? (
                <>
                  <Check
                    className="size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {messages.success}
                </>
              ) : (
                busy && messages.removingMetadata
              )}
            </p>
          </div>
          {file &&
            (downloadUrl ? (
              <Button
                asChild
                className="h-auto min-h-11 max-w-full whitespace-normal"
              >
                <a
                  ref={(link) => {
                    if (link && focusDownload.current) {
                      focusDownload.current = false
                      link.focus()
                    }
                  }}
                  href={downloadUrl}
                  download={`${file.name.replace(/\.pdf$/i, "")}-no-metadata.pdf`}
                >
                  <Download aria-hidden="true" />
                  {messages.downloadPdf}
                </a>
              </Button>
            ) : (
              <Button
                ref={removeButton}
                type="button"
                className="h-auto min-h-11 max-w-full whitespace-normal aria-disabled:cursor-wait"
                aria-disabled={busy}
                onClick={removeMetadata}
              >
                {busy ? (
                  <LoaderCircle
                    className="animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                ) : (
                  <Eraser aria-hidden="true" />
                )}
                {busy ? messages.removingMetadata : messages.removeMetadata}
              </Button>
            ))}
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
