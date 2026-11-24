import { useEffect, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { FileImage, ImageIcon, LoaderCircle, Upload } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { ImageResults } from "./results"
import type { Extraction } from "./pdf-images"
import type English from "./messages/en.json"

export type Messages = typeof English

type Status =
  | { kind: "busy"; text: string }
  | { kind: "error"; text: string }
  | { kind: "done"; result: Extraction }

export default function PdfImageExtractor({
  lang,
  messages,
}: {
  lang: string
  messages: Messages
}) {
  const input = useRef<HTMLInputElement>(null)
  const active = useRef<AbortController>(null)
  const [file, setFile] = useState<File>()
  const [status, setStatus] = useState<Status>()
  const [invalid, setInvalid] = useState(false)
  const [dragging, setDragging] = useState(false)
  const number = new Intl.NumberFormat(lang)

  useEffect(() => () => active.current?.abort(), [])

  async function select(next?: File) {
    if (!next) return
    if (next.type !== "application/pdf" && !/\.pdf$/i.test(next.name)) {
      setInvalid(true)
      return
    }
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    const { signal } = controller
    setInvalid(false)
    setFile(next)
    setStatus({ kind: "busy", text: messages.opening })
    try {
      const { extractPdfImages } = await import("./pdf-images")
      const result = await extractPdfImages(next, signal, (page, total) => {
        const text = messages.scanning
          .replace("{page}", number.format(page))
          .replace("{total}", number.format(total))
        setStatus({ kind: "busy", text })
      })
      if (!signal.aborted) setStatus({ kind: "done", result })
    } catch (error) {
      if (signal.aborted) return
      const text =
        error instanceof Error && error.name === "PasswordException"
          ? messages.lockedPdf
          : messages.readError
      setStatus({ kind: "error", text })
    }
  }

  const result = status?.kind === "done" ? status.result : undefined
  const hasImages = Boolean(result?.images.length)
  const empty = result && !hasImages && !result.skipped
  const busy = status?.kind === "busy"

  return (
    <div className="space-y-4">
      <input
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(event) => {
          void select(event.currentTarget.files?.[0])
          event.currentTarget.value = ""
        }}
        ref={input}
        type="file"
      />
      <div
        className={cn(
          "flex rounded-xl border transition-colors",
          file
            ? "flex-wrap items-center gap-3 bg-card p-3 sm:p-4"
            : "min-h-52 flex-col items-center justify-center gap-3 border-dashed bg-muted/25 p-6 text-center",
          dragging && "border-primary bg-primary/5"
        )}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setDragging(false)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          void select(event.dataTransfer.files[0])
        }}
      >
        <div
          className={cn(
            "grid shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground",
            file ? "size-10" : "size-12"
          )}
        >
          <FileImage
            className={file ? "size-5" : "size-6"}
            aria-hidden="true"
          />
        </div>
        {file && (
          <p className="min-w-0 flex-1 text-sm font-medium wrap-anywhere">
            <bdi>{file.name}</bdi>
          </p>
        )}
        <Button
          onClick={() => input.current?.click()}
          size="lg"
          type="button"
          variant={file ? "outline" : "default"}
        >
          <Upload aria-hidden="true" data-icon="inline-start" />
          {file ? messages.changePdf : messages.choosePdf}
        </Button>
        {!file && (
          <p className="text-sm text-muted-foreground">
            {messages.dropPdf}
            <span className="mt-1 block text-xs">
              {messages.localProcessing}
            </span>
          </p>
        )}
      </div>
      {invalid && (
        <Alert variant="destructive">
          <AlertDescription>{messages.invalidFile}</AlertDescription>
        </Alert>
      )}
      <p
        className={
          busy
            ? "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm text-muted-foreground"
            : "sr-only"
        }
        role="status"
      >
        {busy && (
          <LoaderCircle
            className="size-4 motion-safe:animate-spin"
            aria-hidden="true"
          />
        )}
        {busy && status.text}
        {result &&
          hasImages &&
          `${messages.results} (${number.format(result.images.length)})`}
        {empty && messages.emptyTitle}
      </p>
      {status?.kind === "error" && (
        <Alert variant="destructive">
          <AlertDescription>{status.text}</AlertDescription>
        </Alert>
      )}
      {result?.skipped && (
        <Alert>
          <AlertDescription>{messages.skippedImages}</AlertDescription>
        </Alert>
      )}
      {result && file && hasImages && (
        <ImageResults
          file={file}
          images={result.images}
          messages={messages}
          number={number}
        />
      )}
      {empty && (
        <div className="flex items-start gap-3 rounded-xl border bg-muted/20 p-4">
          <ImageIcon
            className="mt-0.5 size-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-sm font-medium">{messages.emptyTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {messages.emptyDescription}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
