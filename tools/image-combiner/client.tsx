import {
  useEffect,
  useEffectEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"

import { ImageUp } from "@workspace/ui/icons"

import { ImageList } from "./components/image-list"
import { Preview } from "./components/preview"
import { SettingsCard, type Settings } from "./components/settings"
import {
  composeLayout,
  outputIsTooLarge,
  type Composition,
} from "./core/layout"
import { downloadPng } from "./render"
import type { Messages, SourceImage } from "./types"

const defaults: Settings = {
  layout: "horizontal",
  columns: "2",
  gap: "8",
  transparent: true,
  color: "#ffffff",
  matched: false,
  width: "",
  height: "",
}

function positiveInteger(value: string) {
  const number = Math.floor(Number(value))
  return number > 0 ? Math.min(number, Number.MAX_SAFE_INTEGER) : undefined
}

export default function ImageCombiner({
  lang,
  messages,
}: {
  lang: string
  messages: Messages
}) {
  const inputId = useId()
  const urls = useRef(new Set<string>())
  const [images, setImages] = useState<SourceImage[]>([])
  const [settings, setSettings] = useState(defaults)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [failedFiles, setFailedFiles] = useState<string[]>([])
  const [exporting, setExporting] = useState(false)
  const [failedExport, setFailedExport] = useState<{
    composition: Composition
    background: string | null
  } | null>(null)
  const { layout, columns, gap, matched, width, height } = settings
  const composition = useMemo(
    () =>
      composeLayout(images, {
        layout,
        columns: positiveInteger(columns) ?? 1,
        gap: positiveInteger(gap) ?? 0,
        match: matched
          ? { width: positiveInteger(width), height: positiveInteger(height) }
          : null,
      }),
    [images, layout, columns, gap, matched, width, height]
  )
  const background = settings.transparent ? null : settings.color
  const oversized = outputIsTooLarge(composition)
  const exportFailed =
    failedExport?.composition === composition &&
    failedExport.background === background

  function release(url: string) {
    URL.revokeObjectURL(url)
    urls.current.delete(url)
  }

  async function addFiles(files: readonly File[]) {
    if (files.length === 0 || loading) return

    setLoading(true)
    const results = await Promise.all(
      files.map(async (file) => {
        const url = URL.createObjectURL(file)
        urls.current.add(url)
        try {
          const image = new Image()
          image.src = url
          await image.decode()
          return {
            name: file.name,
            image,
            width: image.naturalWidth,
            height: image.naturalHeight,
          }
        } catch {
          release(url)
          return { name: file.name }
        }
      })
    )
    const loaded = results.filter(
      (result): result is SourceImage => !!result.image
    )
    setImages((current) => current.concat(loaded))
    setFailedFiles(
      results.filter((result) => !result.image).map(({ name }) => name)
    )
    setLoading(false)
  }

  const addPastedImages = useEffectEvent((event: ClipboardEvent) => {
    const files = Array.from(event.clipboardData?.files ?? []).filter((file) =>
      file.type.startsWith("image/")
    )
    void addFiles(files)
  })
  useEffect(() => {
    const objectUrls = urls.current
    const handlePaste = (event: ClipboardEvent) => addPastedImages(event)
    window.addEventListener("paste", handlePaste)
    return () => {
      window.removeEventListener("paste", handlePaste)
      for (const url of objectUrls) URL.revokeObjectURL(url)
      objectUrls.clear()
    }
  }, [])

  function move(index: number, offset: number) {
    setImages((current) => {
      const next = [...current]
      const moved = next.splice(index, 1)
      next.splice(index + offset, 0, ...moved)
      return next
    })
  }

  function remove(image: SourceImage) {
    release(image.image.src)
    setImages((current) => current.filter((item) => item !== image))
  }

  async function download() {
    setExporting(true)
    setFailedExport(null)
    try {
      await downloadPng(composition, images, background)
    } catch {
      setFailedExport({ composition, background })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div
      className="grid items-start gap-5 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]"
      data-tool="image-combiner"
    >
      <div className="grid min-w-0 gap-5">
        <div className="relative grid gap-2">
          <input
            accept="image/*"
            aria-describedby={`${inputId}-hint`}
            aria-label={messages.addImages}
            className="peer sr-only"
            disabled={loading}
            id={inputId}
            multiple
            name="images"
            onChange={(event) => {
              void addFiles(Array.from(event.currentTarget.files ?? []))
              event.currentTarget.value = ""
            }}
            type="file"
          />
          <label
            className="flex min-h-25 cursor-pointer touch-manipulation flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed bg-card p-4 text-center peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-disabled:cursor-wait hover:border-ring hover:bg-muted/50 data-[dragging=true]:border-ring data-[dragging=true]:bg-muted"
            data-dragging={dragging}
            htmlFor={inputId}
            onDragLeave={() => setDragging(false)}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              void addFiles(Array.from(event.dataTransfer.files))
            }}
          >
            <span className="pointer-events-none inline-flex items-center gap-2 font-semibold">
              <ImageUp aria-hidden="true" className="size-4" />
              <span aria-live="polite">
                {loading ? messages.reading : messages.addImages}
              </span>
            </span>
            <span
              className="pointer-events-none text-xs/5 text-muted-foreground"
              id={`${inputId}-hint`}
            >
              {messages.dropOrPaste}
            </span>
          </label>
          {failedFiles.length > 0 && (
            <ul
              className="grid gap-1 text-sm wrap-anywhere text-destructive"
              role="status"
            >
              {failedFiles.map((name, index) => (
                <li key={index}>
                  {messages.unreadable.replace("{name}", () => name)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <SettingsCard
          messages={messages}
          settings={settings}
          update={(change) =>
            setSettings((current) => ({ ...current, ...change }))
          }
        />
      </div>
      <div className="grid min-w-0 gap-5">
        <Preview
          background={background}
          composition={composition}
          oversized={oversized}
          exportFailed={exportFailed}
          exporting={exporting}
          images={images}
          lang={lang}
          messages={messages}
          onDownload={() => void download()}
        />
        {images.length > 0 && (
          <ImageList
            images={images}
            messages={messages}
            move={move}
            remove={remove}
          />
        )}
      </div>
    </div>
  )
}
