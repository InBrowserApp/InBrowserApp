import { useEffect, useId, useRef, useState } from "react"
import { ImageUp } from "@workspace/ui/icons"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { cn } from "@workspace/ui/lib/utils"
import { convertFile, formatLabels, formats } from "./core/conversion"
import type { Format } from "./core/conversion"
import type { Messages } from "./messages"
import { Results } from "./results"
import { ImageQueue, type Entry } from "./image-queue"

const accept =
  ".jpg,.jpeg,.jpe,.jfif,.png,.apng,.gif,.bmp,.dib,.webp,.avif,.tif,.tiff,.btf,.tf8,.bigtiff,.ico,.heic,.heif,.jxl,.jp2,.j2k,.j2c,.jpc"

type Progress = { file: number; image?: { current: number; total: number } }

export default function BatchImageConverter({
  lang,
  messages: m,
}: {
  lang: string
  messages: Messages
}) {
  const id = useId()
  const picker = useRef<HTMLInputElement>(null)
  const active = useRef<AbortController | null>(null)
  const nextId = useRef(0)
  const [entries, setEntries] = useState<Entry[]>([])
  const [format, setFormat] = useState<Format>("jpg")
  const [quality, setQuality] = useState(90)
  const [progress, setProgress] = useState<Progress>()
  const busy = progress !== undefined
  const [dragging, setDragging] = useState(false)
  const number = new Intl.NumberFormat(lang)
  const outputs = entries.flatMap((entry) => entry.result?.outputs ?? [])
  const incomplete = entries.some(({ result }) => result?.failure !== undefined)

  useEffect(() => () => active.current?.abort(), [])

  function addFiles(files: FileList | null) {
    if (active.current || !files?.length) return
    const added = Array.from(files, (file) => ({ id: nextId.current++, file }))
    setEntries((current) => [...current, ...added])
  }

  function fileProgress(template: string, current: number, total: number) {
    return template
      .replace("{current}", number.format(current))
      .replace("{total}", number.format(total))
  }

  async function convert() {
    if (active.current || !entries.length) return
    const controller = new AbortController()
    const { signal } = controller
    active.current = controller
    setEntries((current) => current.map(({ id, file }) => ({ id, file })))
    const names = new Set<string>()

    try {
      for (const [file, entry] of entries.entries()) {
        setProgress({ file: file + 1 })
        const result = await convertFile(
          entry.file,
          format,
          quality,
          names,
          signal,
          (current, total) =>
            setProgress({ file: file + 1, image: { current, total } })
        )
        signal.throwIfAborted()
        setEntries((current) =>
          current.map((item) =>
            item.id === entry.id ? { ...item, result } : item
          )
        )
      }
    } catch (reason) {
      if (!signal.aborted) throw reason
    } finally {
      active.current = null
      setProgress(undefined)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid items-start gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          <CardContent className="space-y-4">
            <div
              className={cn(
                "flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30 px-4 py-6 text-center transition-colors",
                dragging && "border-primary bg-primary/5"
              )}
              onDragOver={(event) => {
                event.preventDefault()
                if (!busy) {
                  event.dataTransfer.dropEffect = "copy"
                  setDragging(true)
                }
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
              onDrop={(event) => {
                event.preventDefault()
                setDragging(false)
                addFiles(event.dataTransfer.files)
              }}
            >
              <div className="rounded-lg border bg-background p-2.5 text-muted-foreground">
                <ImageUp aria-hidden="true" className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold">{m.drop}</p>
                <p className="text-xs text-muted-foreground">{m.formats}</p>
              </div>
              <input
                ref={picker}
                aria-label={m.choose}
                type="file"
                accept={accept}
                multiple
                disabled={busy}
                hidden
                onChange={(event) => {
                  addFiles(event.currentTarget.files)
                  event.currentTarget.value = ""
                }}
              />
              <Button
                variant="outline"
                type="button"
                disabled={busy}
                onClick={() => picker.current?.click()}
              >
                {m.choose}
              </Button>
            </div>
            {entries.length > 0 && (
              <ImageQueue
                id={`${id}-queue`}
                entries={entries}
                busy={busy}
                messages={m}
                onRemove={(entryId) =>
                  setEntries((current) =>
                    current.filter(({ id }) => id !== entryId)
                  )
                }
                onClear={() => setEntries([])}
              />
            )}
            <p className="text-xs text-muted-foreground">{m.privacy}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{m.settings}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <fieldset disabled={busy}>
              <legend className="mb-2 text-sm font-medium">{m.format}</legend>
              <div className="grid grid-cols-3 gap-2">
                {formats.map((option) => (
                  <label key={option} className="min-w-0">
                    <input
                      type="radio"
                      className="peer sr-only"
                      name={`${id}-format`}
                      value={option}
                      checked={format === option}
                      onChange={() => setFormat(option)}
                    />
                    <span className="flex h-9 cursor-pointer items-center justify-center rounded-md border text-sm font-medium peer-checked:border-primary peer-checked:bg-primary/5 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-disabled:cursor-default peer-disabled:opacity-60">
                      {formatLabels[option]}
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {format === "jpg" ? m.jpgHint : m.alphaHint}
              </p>
            </fieldset>
            {format !== "png" && (
              <div className="space-y-2">
                <label
                  htmlFor={`${id}-quality`}
                  className="flex justify-between gap-3 text-sm font-medium"
                >
                  {m.quality}
                  <bdi dir="ltr" className="tabular-nums">
                    {number.format(quality)}%
                  </bdi>
                </label>
                <input
                  id={`${id}-quality`}
                  type="range"
                  min={1}
                  max={100}
                  value={quality}
                  disabled={busy}
                  onChange={(event) =>
                    setQuality(event.currentTarget.valueAsNumber)
                  }
                  className="block w-full accent-primary"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={busy || entries.length === 0}
                onClick={convert}
              >
                {m.convert}
              </Button>
              {busy && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => active.current?.abort()}
                >
                  {m.cancel}
                </Button>
              )}
            </div>
            <div
              role="status"
              className="text-sm text-muted-foreground empty:hidden"
            >
              {progress && (
                <>
                  <p>
                    {fileProgress(m.progress, progress.file, entries.length)}
                  </p>
                  {progress.image && progress.image.total > 1 && (
                    <p>
                      {fileProgress(
                        m.fileProgress,
                        progress.image.current,
                        progress.image.total
                      )}
                    </p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {(outputs.length > 0 || incomplete) && (
        <Results
          images={outputs}
          countLabel={m.ready.replace("{count}", number.format(outputs.length))}
          incomplete={incomplete}
          busy={busy}
          messages={m}
        />
      )}
    </div>
  )
}
