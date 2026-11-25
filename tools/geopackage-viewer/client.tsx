import { useEffect, useId, useRef, useState } from "react"
import { FeatureInspector } from "@workspace/ui/components/tool/feature-inspector"
import { OfflineMap } from "@workspace/ui/components/tool/offline-map"
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
import { Database, FolderInput, Layers, Sparkles } from "@workspace/ui/icons"
import type { Entry, LayerPreview } from "./read"
import type english from "./messages/en.json"

export type Messages = { readonly [Key in keyof typeof english]: string }
type Reply =
  | { kind: "open"; entries: Entry[] | null }
  | { kind: "entry"; index: number; layer: LayerPreview | null }

function inspectable(entry?: Entry) {
  return entry?.type === "features" || entry?.type === "attributes"
}

function Status({ children }: { children: string }) {
  return (
    <p
      role="status"
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <Spinner aria-hidden="true" /> {children}
    </p>
  )
}

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const picker = useRef<HTMLInputElement>(null)
  const workerRef = useRef<Worker | null>(null)
  const id = useId()
  const [request, setRequest] = useState<{ file: File | "example" }>()
  const [entries, setEntries] = useState<Entry[] | null>()
  const [selection, setSelection] = useState(0)
  const [selected, setSelected] = useState(0)
  const [result, setResult] = useState<{
    index: number
    layer: LayerPreview | null
  }>()
  const entry = entries?.[selection]
  const layer = result?.index === selection ? result.layer : undefined

  function open(file: File | "example") {
    setEntries(undefined)
    setResult(undefined)
    setSelected(0)
    setRequest({ file })
  }

  function selectLayer(next: number, entry?: Entry) {
    setSelection(next)
    setSelected(0)
    setResult(undefined)
    if (inspectable(entry))
      workerRef.current?.postMessage({ kind: "entry", index: next })
  }

  useEffect(() => {
    if (!request) return
    const worker = new Worker(new URL("./read.worker.ts", import.meta.url), {
      type: "module",
    })
    workerRef.current = worker
    worker.onmessage = ({ data }: MessageEvent<Reply>) => {
      if (data.kind === "open") {
        setEntries(data.entries)
        if (!data.entries) return
        const firstFeature = data.entries.findIndex(
          (entry) => entry.type === "features"
        )
        const firstTable = data.entries.findIndex(inspectable)
        const initial =
          firstFeature >= 0 ? firstFeature : Math.max(0, firstTable)
        selectLayer(initial, data.entries[initial])
      } else {
        setResult({ index: data.index, layer: data.layer })
      }
    }
    worker.onerror = (event) => {
      event.preventDefault()
      setEntries(null)
      worker.terminate()
    }
    worker.postMessage({ kind: "open", file: request.file })
    return () => {
      workerRef.current = null
      worker.terminate()
    }
  }, [request])

  const alert =
    entries === null ? m.invalid : layer === null ? m.layerError : undefined
  const inspector =
    entry?.type === "attributes"
      ? { ...m, features: m.records, feature: m.record }
      : m
  return (
    <section
      data-tool="geopackage-viewer"
      className="grid min-w-0 gap-4"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        if (file) open(file)
      }}
    >
      <input
        ref={picker}
        hidden
        type="file"
        accept=".gpkg"
        aria-label={m.open}
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ""
          if (file) open(file)
        }}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => picker.current?.click()}>
          <FolderInput aria-hidden="true" />
          {m.open}
        </Button>
        <Button
          variant="outline"
          onClick={() => open("example")}
          disabled={request?.file === "example" && entries === undefined}
        >
          <Sparkles aria-hidden="true" />
          {m.example}
        </Button>
        {request && request.file !== "example" && (
          <span
            dir="auto"
            className="min-w-0 text-sm wrap-anywhere text-muted-foreground"
          >
            {request.file.name}
          </span>
        )}
      </div>
      {request && entries === undefined && <Status>{m.opening}</Status>}
      {alert && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{alert}</AlertDescription>
        </Alert>
      )}
      {!entries && (
        <Empty className="min-h-64 border border-dashed bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Database aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>
              {m.formats} {m.privacy}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {entries && !entry && (
        <p role="status" className="text-sm text-muted-foreground">
          {m.empty}
        </p>
      )}
      {entries && entry && (
        <>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <label htmlFor={id} className="text-sm font-medium">
              {m.layer}
            </label>
            <select
              id={id}
              className="h-9 max-w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm"
              value={selection}
              onChange={(event) => {
                const next = Number(event.target.value)
                selectLayer(next, entries[next])
              }}
            >
              {entries.map(({ name, title }, index) => (
                <option key={name} value={index}>
                  {title}
                </option>
              ))}
            </select>
          </div>
          {inspectable(entry) && layer === undefined && (
            <Status>{m.loading}</Status>
          )}
          {entry.type === "tiles" && (
            <Alert>
              <Layers aria-hidden="true" />
              <AlertDescription>
                <strong>{m.tiles}</strong>
                <br />
                {m.tileNotice}
              </AlertDescription>
            </Alert>
          )}
          {entry.type === "other" && (
            <p className="text-sm text-muted-foreground">{m.unsupported}</p>
          )}
          {layer && (
            <>
              {layer.truncated && (
                <p className="text-sm text-muted-foreground">
                  {m.limit.replace(
                    "{count}",
                    new Intl.NumberFormat(lang).format(layer.features.length)
                  )}
                </p>
              )}
              {entry.type === "features" && !layer.hasGeometry && (
                <p className="text-sm text-muted-foreground">{m.noGeometry}</p>
              )}
              <div
                className={
                  layer.hasGeometry
                    ? "grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(14rem,1fr)]"
                    : "min-w-0"
                }
              >
                {layer.hasGeometry && (
                  <OfflineMap
                    messages={m}
                    features={layer.features}
                    selected={selected}
                    onSelect={setSelected}
                  />
                )}
                <FeatureInspector
                  features={layer.features}
                  selected={selected}
                  onSelect={setSelected}
                  messages={inspector}
                  lang={lang}
                  formatValue={(value) =>
                    value && typeof value === "object" && "binary" in value
                      ? m.binary
                      : undefined
                  }
                />
              </div>
            </>
          )}
        </>
      )}
    </section>
  )
}
