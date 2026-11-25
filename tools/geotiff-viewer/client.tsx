import { useEffect, useId, useRef, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  Folder,
  ImageIcon,
  Minus,
  Plus,
  Scan,
  Sparkles,
} from "@workspace/ui/icons"
import type english from "./messages/en.json"
import type { RasterDetails, RasterPreview } from "./raster"

export type Messages = { readonly [Key in keyof typeof english]: string }

function Preview({
  data,
  label,
  zoom,
}: {
  data: RasterPreview
  label: string
  zoom: number
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    canvas.current
      ?.getContext("2d")
      ?.putImageData(new ImageData(data.pixels, data.width, data.height), 0, 0)
  }, [data])
  return (
    <div
      role="region"
      aria-label={label}
      // Allow keyboard scrolling when the raster is zoomed.
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      dir="ltr"
      className="max-h-[min(58vh,34rem)] min-w-0 overflow-auto rounded-lg bg-muted p-2 focus-visible:outline-2 focus-visible:outline-ring"
    >
      <canvas
        ref={canvas}
        aria-hidden="true"
        width={data.width}
        height={data.height}
        className="mx-auto block h-auto max-w-none rounded-sm object-contain"
        style={{
          width: `${zoom * 100}%`,
          maxHeight: `calc((min(58vh, 34rem) - 1rem) * ${zoom})`,
        }}
      />
    </div>
  )
}

function Details({
  details,
  lang,
  messages: m,
}: {
  details: RasterDetails
  lang: string
  messages: Messages
}) {
  const number = new Intl.NumberFormat(lang)
  const precise = new Intl.NumberFormat(lang, {
    maximumSignificantDigits: 12,
    useGrouping: false,
  })
  const fields = [
    [
      m.dimensions,
      `${number.format(details.width)} × ${number.format(details.height)}`,
    ],
    [m.bands, number.format(details.bands)],
    [m.crs, details.crs],
    [
      m.bounds,
      details.bounds?.map((value) => precise.format(value)).join(" · "),
    ],
    [m.noData, details.noData === null ? null : String(details.noData)],
  ]
  return (
    <aside className="min-w-0 space-y-2 rounded-lg border p-3 sm:p-4">
      <h2 className="font-semibold">{m.details}</h2>
      <dl className="divide-y text-sm">
        {fields.map(([label, value]) => (
          <div key={label} className="space-y-1 py-2">
            <dt className="text-muted-foreground">{label}</dt>
            <dd
              className="wrap-anywhere tabular-nums"
              dir={value ? "ltr" : undefined}
            >
              {value ?? m.unavailable}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const [request, setRequest] = useState<{
    source: File | "example"
    band?: number
  }>()
  const source = request?.source
  const band = request?.band
  const [loaded, setLoaded] = useState<{ file: File; preview: RasterPreview }>()
  const [error, setError] = useState(false)
  const [zoom, setZoom] = useState(1)
  const selectId = useId()
  const file = source === "example" ? (loaded?.file ?? null) : (source ?? null)
  const result = loaded?.preview

  function open(next: File | "example" | null) {
    setZoom(1)
    setLoaded(undefined)
    setError(false)
    setRequest(next ? { source: next } : undefined)
  }

  useEffect(() => {
    if (!request) return
    const worker = new Worker(new URL("./raster.worker.ts", import.meta.url), {
      type: "module",
    })
    worker.onmessage = ({
      data,
    }: MessageEvent<{ file: File; preview: RasterPreview } | null>) => {
      worker.terminate()
      if (data) setLoaded(data)
      else setError(true)
    }
    worker.onerror = (event) => {
      event.preventDefault()
      worker.terminate()
      setError(true)
    }
    worker.postMessage(request)
    return () => worker.terminate()
  }, [request])

  const loading =
    source &&
    !error &&
    (!result || (band !== undefined && result.band !== band))
  const number = new Intl.NumberFormat(lang)
  return (
    <DocumentWorkspace
      tool="geotiff-viewer"
      file={file}
      onFile={open}
      accept=".tif,.tiff,image/tiff"
      active={Boolean(result)}
      fitContent
      messages={m}
      renderEmpty={(chooseFile) => (
        <Empty className="min-h-72">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ImageIcon aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>
              {m.formats} {m.privacy}
            </EmptyDescription>
          </EmptyHeader>
          <div className="flex flex-wrap justify-center gap-2">
            <Button data-file-open onClick={chooseFile}>
              <Folder aria-hidden="true" />
              {m.open}
            </Button>
            <Button
              variant="outline"
              disabled={Boolean(loading)}
              onClick={() => open("example")}
            >
              <Sparkles aria-hidden="true" />
              {m.example}
            </Button>
          </div>
        </Empty>
      )}
    >
      {error && (
        <Alert variant="destructive" role="alert" className="m-3 w-auto">
          <AlertDescription>{m.error}</AlertDescription>
        </Alert>
      )}
      {loading && (
        <p
          role="status"
          className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground"
        >
          <Spinner aria-hidden="true" /> {m.loading}
        </p>
      )}
      {result && (
        <div className="grid min-w-0 items-start gap-3 overflow-auto p-3 lg:grid-cols-[minmax(0,3fr)_minmax(13rem,1fr)]">
          <div className="grid min-w-0 gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm font-medium" htmlFor={selectId}>
                  {m.display}
                </label>
                <select
                  id={selectId}
                  className="h-9 max-w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={band ?? result.band}
                  onChange={(event) => {
                    setError(false)
                    setRequest({
                      source: file!,
                      band: Number(event.target.value),
                    })
                  }}
                >
                  {result.details.color && (
                    <option value={-1}>{m.color}</option>
                  )}
                  {Array.from({ length: result.details.bands }, (_, index) => (
                    <option key={index} value={index}>
                      {m.band.replace("{number}", number.format(index + 1))}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-1">
                <DocumentIconButton
                  label={m.zoomOut}
                  disabled={zoom <= 1}
                  onClick={() => setZoom(Math.max(1, zoom / 1.5))}
                >
                  <Minus aria-hidden="true" />
                </DocumentIconButton>
                <DocumentIconButton
                  label={m.zoomIn}
                  disabled={zoom >= 6}
                  onClick={() => setZoom(Math.min(6, zoom * 1.5))}
                >
                  <Plus aria-hidden="true" />
                </DocumentIconButton>
                <DocumentIconButton label={m.fit} onClick={() => setZoom(1)}>
                  <Scan aria-hidden="true" />
                </DocumentIconButton>
              </div>
            </div>
            {!error && !loading && (
              <Preview data={result} label={m.preview} zoom={zoom} />
            )}
          </div>
          <Details details={result.details} lang={lang} messages={m} />
        </div>
      )}
    </DocumentWorkspace>
  )
}
