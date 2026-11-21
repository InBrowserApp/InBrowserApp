import { useEffect, useEffectEvent, useId, useRef, useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { ImageUp, X } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { compressBatch, fileKey, requestKey } from "./batch"
import type { CompressionRequest, ImageOutcome } from "./batch"
import type { DimensionConstraint } from "./compress"
import { CompressionResults } from "./results"
import { message } from "./messages"
import type { Messages } from "./messages"
import { CompressionSettings } from "./settings"
import type { Settings } from "./settings"
import { limitInBytes, pixels } from "./numeric-input"

type Batch = {
  request: CompressionRequest
  outcomes: ImageOutcome[]
}

type Props = { lang: string; messages: Messages }

export default function ImageSizeCompressor({ lang, messages }: Props) {
  const resultsId = useId()
  const picker = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [settings, setSettings] = useState<Settings>({
    limitInput: "200",
    format: "jpg",
    dimensionMode: "original",
    widthInput: "",
    heightInput: "",
    fit: "contain",
  })
  const { limitInput, format, dimensionMode, widthInput, heightInput, fit } =
    settings
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [batch, setBatch] = useState<Batch | null>(null)
  const busy = progress !== null
  const noLimit = limitInput.trim() === ""
  const limit = noLimit ? Infinity : limitInBytes(limitInput, lang)
  const validLimit = noLimit || (Number.isSafeInteger(limit) && limit > 0)
  const width = pixels(widthInput)
  const height = pixels(heightInput)
  const dimensions: DimensionConstraint =
    dimensionMode === "exact"
      ? { mode: dimensionMode, width, height, fit }
      : { mode: dimensionMode }
  const request = { format, limit, dimensions }
  const sameSettings =
    batch && requestKey(batch.request) === requestKey(request)
  const previousResults = Boolean(
    batch && (!sameSettings || batch.outcomes.length !== files.length)
  )

  const canCompress =
    files.length > 0 &&
    validLimit &&
    !busy &&
    (dimensionMode !== "exact" || (width > 0 && height > 0))
  const number = new Intl.NumberFormat(lang, { maximumFractionDigits: 3 })
  const formatSize = (bytes: number) => `${number.format(bytes / 1000)} KB`
  const progressLabel = busy
    ? message(messages.progress, {
        current: number.format(progress),
        total: number.format(files.length),
      })
    : ""

  const resultSummary =
    !busy && batch
      ? previousResults
        ? messages.previousResults
        : message(messages.readyCountWithoutLimit, {
            ready: number.format(
              batch.outcomes.filter(
                ({ image }) => image && image.blob.size <= batch.request.limit
              ).length
            ),
            total: number.format(batch.outcomes.length),
          })
      : ""
  const limitLabel =
    validLimit && !noLimit
      ? message(messages.effectiveLimit, {
          size: formatSize(limit),
          bytes: number.format(limit),
        })
      : ""

  function updateFiles(nextFiles: File[]) {
    setFiles(nextFiles)
    const remaining = new Set(nextFiles)
    setBatch((current) => {
      if (!current) return current
      const outcomes = current.outcomes.filter(({ file }) =>
        remaining.has(file)
      )
      return outcomes.length ? { ...current, outcomes } : null
    })
  }

  function addFiles(selected: readonly File[]) {
    if (busy || !selected.length) return
    setFiles((current) => {
      const nextFiles = new Map(current.map((file) => [fileKey(file), file]))
      for (const file of selected) {
        const id = fileKey(file)
        if (!nextFiles.has(id)) nextFiles.set(id, file)
      }
      return [...nextFiles.values()]
    })
  }

  const pasteImages = useEffectEvent((event: ClipboardEvent) => {
    if (busy || event.defaultPrevented) return
    if (
      event.target instanceof HTMLElement &&
      (event.target.isContentEditable ||
        event.target.closest("input, textarea"))
    )
      return
    const images = Array.from(event.clipboardData?.files ?? []).filter((file) =>
      file.type.startsWith("image/")
    )
    if (!images.length) return
    event.preventDefault()
    addFiles(images)
  })
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => pasteImages(event)
    window.addEventListener("paste", handlePaste)
    return () => window.removeEventListener("paste", handlePaste)
  }, [])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void compress(request)
  }

  async function retryWithSmallerImages() {
    if (!canCompress || previousResults) return
    const activeElement = document.activeElement
    await compress({ ...request, dimensions: { mode: "shrink" } })
    setSettings((current) => ({ ...current, dimensionMode: "shrink" }))
    if (document.activeElement === activeElement) {
      document.getElementById(resultsId)?.focus({ preventScroll: true })
    }
  }

  async function compress(nextRequest: CompressionRequest) {
    if (!canCompress) return
    setProgress(1)
    const outcomes = await compressBatch(
      files,
      nextRequest,
      sameSettings ? batch.outcomes : [],
      messages,
      setProgress
    )
    setBatch({ request: nextRequest, outcomes })
    setProgress(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={submit}
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]"
      >
        <div className="flex min-w-0 flex-col gap-3">
          <input
            ref={picker}
            aria-label={messages.addImages}
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp"
            type="file"
            multiple
            hidden
            disabled={busy}
            onChange={(event) => {
              if (event.target.files) addFiles(Array.from(event.target.files))
              event.target.value = ""
            }}
          />
          <button
            type="button"
            className={cn(
              "flex w-full flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/35 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait",
              files.length ? "min-h-44" : "min-h-72",
              dragging && "border-primary bg-primary/5"
            )}
            onClick={() => picker.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(!busy)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              addFiles(Array.from(event.dataTransfer.files))
            }}
            disabled={busy}
          >
            <span className="rounded-xl border bg-background p-3 text-primary shadow-xs">
              <ImageUp className="size-6" aria-hidden="true" />
            </span>
            <span className="font-medium">{messages.addImages}</span>
            <span className="text-sm leading-5 text-muted-foreground">
              {messages.dropImages}
              <br />
              {messages.inputFormats}
            </span>
          </button>
          {files.length > 0 && (
            <div className="rounded-xl border bg-card">
              <ul className="max-h-48 divide-y overflow-y-auto">
                {files.map((file) => (
                  <li
                    key={fileKey(file)}
                    className="flex min-w-0 items-center gap-3 px-3 py-1.5"
                  >
                    <span
                      title={file.name}
                      className="min-w-0 grow truncate text-sm"
                      dir="auto"
                    >
                      {file.name}
                    </span>
                    <span
                      className="shrink-0 text-xs text-muted-foreground tabular-nums"
                      dir="ltr"
                    >
                      {formatSize(file.size)}
                    </span>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      type="button"
                      aria-label={message(messages.removeImage, {
                        name: file.name,
                      })}
                      disabled={busy}
                      onClick={() =>
                        updateFiles(
                          files.filter((selected) => selected !== file)
                        )
                      }
                    >
                      <X aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ul>
              {files.length > 1 && (
                <div className="border-t px-2 py-1">
                  <Button
                    variant="ghost"
                    type="button"
                    size="sm"
                    disabled={busy}
                    onClick={() => updateFiles([])}
                  >
                    {messages.clearAll}
                  </Button>
                </div>
              )}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {messages.privacy} {messages.stillImage}
          </p>
        </div>
        <CompressionSettings
          settings={settings}
          onChange={setSettings}
          limitLabel={limitLabel}
          validLimit={validLimit}
          canCompress={canCompress}
          firstFile={files[0]}
          progressLabel={progressLabel}
          messages={messages}
          resultSummary={resultSummary}
          resultsId={resultsId}
        />
      </form>

      {batch && (
        <CompressionResults
          outcomes={batch.outcomes}
          limit={batch.request.limit}
          formatSize={formatSize}
          number={number}
          dimensionMode={batch.request.dimensions.mode}
          previousResults={previousResults}
          messages={messages}
          id={resultsId}
          retrying={busy}
          onShrinkAndRetry={() => void retryWithSmallerImages()}
        />
      )}
    </div>
  )
}
