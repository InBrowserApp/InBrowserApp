import { useEffect, useRef, useState } from "react"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Download,
  ImageUp,
  LoaderCircle,
  RefreshCcw,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { DragEvent } from "react"
import type { WorkerUpdate } from "./worker-messages"

export type Messages = typeof import("./messages/en.json")

const acceptedFormats = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
const checkerboard =
  "bg-muted bg-[conic-gradient(var(--color-border)_25%,transparent_0_50%,var(--color-border)_0_75%,transparent_0)] bg-size-[20px_20px]"

type WorkerRun = { worker: Worker; reusable: boolean }
type Job = { file: File; update: WorkerUpdate }
const previews = ["original", "result"] as const

function useObjectUrl(blob?: Blob) {
  const [entry, setEntry] = useState<{ blob: Blob; url: string }>()

  useEffect(() => {
    if (!blob) {
      setEntry(undefined)
      return
    }
    const url = URL.createObjectURL(blob)
    setEntry({ blob, url })
    return () => URL.revokeObjectURL(url)
  }, [blob])

  return entry && entry.blob === blob ? entry.url : undefined
}

function ImagePreview({
  url,
  label,
  transparent,
  mobileHidden,
}: {
  url: string
  label: string
  transparent?: boolean
  mobileHidden: boolean
}) {
  return (
    <figure className={cn("min-w-0", mobileHidden && "hidden sm:block")}>
      <figcaption className="mb-2 hidden text-sm font-medium sm:block">
        {label}
      </figcaption>
      <div
        className={cn(
          "flex h-64 items-center justify-center overflow-hidden rounded-lg border bg-muted/30 sm:h-80",
          transparent && checkerboard
        )}
      >
        <img alt={label} className="h-full w-full object-contain" src={url} />
      </div>
    </figure>
  )
}

export default function Client({ messages }: { messages: Messages }) {
  const picker = useRef<HTMLInputElement>(null)
  const pickerButton = useRef<HTMLButtonElement>(null)
  const currentRun = useRef<WorkerRun>(null)
  const dragDepth = useRef(0)
  const [job, setJob] = useState<Job>()
  const [mobilePreview, setMobilePreview] =
    useState<(typeof previews)[number]>("result")
  const [dragging, setDragging] = useState(false)
  const file = job?.file
  const update = job?.update
  const originalUrl = useObjectUrl(file)
  const result = update?.type === "ready" ? update : undefined
  const resultUrl = useObjectUrl(result?.png)
  const error =
    update?.type === "invalidImage" ||
    update?.type === "modelFailed" ||
    update?.type === "processingFailed"
      ? update.type
      : undefined
  const status =
    update?.type === "preparing" || update?.type === "processing"
      ? messages[update.type]
      : undefined

  useEffect(() => {
    return () => {
      currentRun.current?.worker.terminate()
      currentRun.current = null
    }
  }, [])

  function selectFile(file: File) {
    setJob({ file, update: { type: "processing" } })
    setMobilePreview("result")

    const previous = currentRun.current
    if (previous && !previous.reusable) previous.worker.terminate()
    currentRun.current = null

    const failure: Job = { file, update: { type: "processingFailed" } }
    try {
      const worker = previous?.reusable
        ? previous.worker
        : new Worker(
            new URL("./workers/remove-background.worker.ts", import.meta.url),
            { type: "module" }
          )
      const run = { worker, reusable: false }
      currentRun.current = run

      worker.onmessage = ({ data }: MessageEvent<WorkerUpdate>) => {
        if (currentRun.current !== run) return
        run.reusable = data.type === "ready" || data.type === "invalidImage"
        setJob({ file, update: data })
      }
      worker.onerror = (event) => {
        event.preventDefault()
        if (currentRun.current !== run) return
        run.reusable = false
        setJob(failure)
      }
      worker.postMessage(file)
    } catch {
      setJob(failure)
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    const next = event.dataTransfer.files[0]
    if (next) selectFile(next)
  }

  return (
    <ToolPanelCard
      className={cn(
        "transition-colors",
        dragging && "border-primary bg-primary/5"
      )}
      onDragEnter={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        dragDepth.current += 1
        setDragging(true)
      }}
      onDragLeave={() => {
        dragDepth.current = Math.max(0, dragDepth.current - 1)
        if (!dragDepth.current) setDragging(false)
      }}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
      }}
      onDrop={handleDrop}
    >
      <ToolPanelCardContent className="gap-4">
        <input
          ref={picker}
          accept={acceptedFormats}
          aria-label={messages.chooseImage}
          hidden
          onChange={(event) => {
            const next = event.currentTarget.files?.[0]
            if (next) selectFile(next)
            event.currentTarget.value = ""
          }}
          type="file"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          {file ? (
            <div className="min-w-0 flex-1 basis-48">
              <p className="truncate text-sm font-medium" title={file.name}>
                <bdi>{file.name}</bdi>
              </p>
              {result ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  <bdi dir="ltr">
                    {result.width} × {result.height} px
                  </bdi>
                </p>
              ) : null}
            </div>
          ) : null}
          <Button
            ref={pickerButton}
            className={cn(
              !file &&
                "h-auto min-h-56 w-full flex-col gap-3 rounded-lg border-dashed bg-muted/25 px-4 py-8 text-center whitespace-normal hover:border-primary/50 hover:bg-muted/50",
              dragging && !file && "border-primary bg-primary/5"
            )}
            onClick={() => picker.current?.click()}
            type="button"
            variant="outline"
          >
            <ImageUp
              aria-hidden="true"
              className={cn(!file && "size-7 text-muted-foreground")}
              data-icon={file ? "inline-start" : undefined}
            />
            {file ? (
              messages.changeImage
            ) : (
              <span className="flex flex-col items-center gap-1">
                <span className="text-base font-semibold">
                  {messages.chooseImage}
                </span>
                <span className="text-sm font-normal text-muted-foreground">
                  {messages.dropImage}
                </span>
                <span className="mt-1 text-xs font-normal text-muted-foreground">
                  {messages.formats}
                </span>
              </span>
            )}
          </Button>
        </div>
        {resultUrl ? (
          <div className="flex flex-wrap gap-2 sm:hidden">
            {previews.map((preview) => (
              <Button
                key={preview}
                aria-pressed={mobilePreview === preview}
                onClick={() => setMobilePreview(preview)}
                type="button"
                variant={mobilePreview === preview ? "secondary" : "ghost"}
              >
                {messages[preview]}
              </Button>
            ))}
          </div>
        ) : null}
        {originalUrl && error !== "invalidImage" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <ImagePreview
              label={messages.original}
              mobileHidden={Boolean(resultUrl && mobilePreview === "result")}
              url={originalUrl}
            />
            {resultUrl ? (
              <ImagePreview
                label={messages.result}
                mobileHidden={mobilePreview === "original"}
                transparent
                url={resultUrl}
              />
            ) : null}
          </div>
        ) : null}
        <p
          className={
            status
              ? "flex items-center gap-2 text-sm text-muted-foreground"
              : "sr-only"
          }
          role="status"
        >
          {status ? (
            <LoaderCircle
              aria-hidden="true"
              className="size-4 shrink-0 motion-safe:animate-spin"
            />
          ) : null}
          {status ?? (resultUrl ? messages.result : null)}
        </p>
        {error ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-destructive" role="alert">
              {messages[error]}
            </p>
            {error !== "invalidImage" && file ? (
              <Button
                onClick={() => {
                  pickerButton.current?.focus()
                  selectFile(file)
                }}
                type="button"
                variant="outline"
              >
                <RefreshCcw aria-hidden="true" data-icon="inline-start" />
                {messages.retry}
              </Button>
            ) : null}
          </div>
        ) : null}
        {file && resultUrl ? (
          <Button asChild className="w-full self-end sm:w-auto">
            <a
              download={`${file.name.replace(/\.[^.]+$/, "") || "image"}-no-background.png`}
              href={resultUrl}
            >
              <Download aria-hidden="true" data-icon="inline-start" />
              {messages.download}
            </a>
          </Button>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
