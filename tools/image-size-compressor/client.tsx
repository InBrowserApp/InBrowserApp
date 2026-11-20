import { useRef, useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { ImageUp, X } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { compressImage, outputName } from "./compress"
import type { DimensionConstraint } from "./compress"
import { CompressionResults } from "./results"
import type { ImageOutcome } from "./results"
import { message } from "./messages"
import type { Messages } from "./messages"
import { CompressionSettings } from "./settings"
import type { Settings } from "./settings"
import { limitInBytes, pixels } from "./numeric-input"

function key(file: File) {
  return JSON.stringify([file.name, file.size, file.lastModified, file.type])
}

type Props = { lang: string; messages: Messages }

export default function ImageSizeCompressor({ lang, messages }: Props) {
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
  const [outcomes, setOutcomes] = useState<ImageOutcome[]>([])
  const busy = progress !== null
  const noLimit = limitInput.trim() === ""
  const limit = noLimit ? Infinity : limitInBytes(limitInput)
  const validLimit = noLimit || (Number.isSafeInteger(limit) && limit > 0)
  const width = pixels(widthInput)
  const height = pixels(heightInput)
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

  function updateFiles(nextFiles: File[]) {
    setFiles(nextFiles)
    setOutcomes([])
  }

  function addFiles(selected: FileList) {
    if (busy || !selected.length) return
    const nextFiles = new Map(files.map((file) => [key(file), file]))
    for (const file of selected) nextFiles.set(key(file), file)
    updateFiles([...nextFiles.values()])
  }

  async function compress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canCompress) return
    const dimensions: DimensionConstraint =
      dimensionMode === "exact"
        ? { mode: dimensionMode, width, height, fit }
        : { mode: dimensionMode }
    setProgress(1)
    setOutcomes([])
    const names = new Set<string>()
    const results: ImageOutcome[] = []
    for (const [index, file] of files.entries()) {
      setProgress(index + 1)
      const name = outputName(file, format, names)
      try {
        results.push({
          file,
          image: {
            ...(await compressImage(file, format, limit, dimensions)),
            name,
          },
        })
      } catch (error) {
        results.push({
          file,
          error:
            error instanceof Error && error.message === "UNSUPPORTED_FORMAT"
              ? messages.unsupportedFormat
              : messages.readError,
        })
      }
    }
    setOutcomes(results)
    setProgress(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={compress}
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
              if (event.target.files) addFiles(event.target.files)
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
              addFiles(event.dataTransfer.files)
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
                    key={key(file)}
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
          onChange={(nextSettings) => {
            setSettings(nextSettings)
            setOutcomes([])
          }}
          validLimit={validLimit}
          canCompress={canCompress}
          firstFile={files[0]}
          progressLabel={progressLabel}
          messages={messages}
        />
      </form>

      <div role="status" className="sr-only">
        {progressLabel}
      </div>
      {outcomes.length > 0 && (
        <CompressionResults
          outcomes={outcomes}
          limit={limit}
          formatSize={formatSize}
          number={number}
          dimensionMode={dimensionMode}
          messages={messages}
        />
      )}
    </div>
  )
}
