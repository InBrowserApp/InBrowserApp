import { useEffect, useId, useRef, useState } from "react"
import { OfflineMap } from "@workspace/ui/components/tool/offline-map"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { FeatureInspector } from "@workspace/ui/components/tool/feature-inspector"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { FolderInput, Layers, Sparkles } from "@workspace/ui/icons"
import type { readShapefiles } from "./read"
import type english from "./messages/en.json"

export type Messages = { readonly [Key in keyof typeof english]: string }
type Layer = ReturnType<typeof readShapefiles>[number]
type Source = File[] | "example"

const selectClass =
  "h-9 min-w-0 max-w-full rounded-md border border-input bg-background px-2 text-sm"

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const picker = useRef<HTMLInputElement>(null)
  const layerId = useId()
  const [request, setRequest] = useState<{ source: Source }>()
  const source = request?.source
  const [layers, setLayers] = useState<Layer[] | null>()
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(0)
  const layer = layers?.[current]
  const showMap = layer?.placement === "exact" || layer?.placement === "assumed"

  function open(next: Source) {
    setCurrent(0)
    setSelected(0)
    setLayers(undefined)
    setRequest({ source: next })
  }

  useEffect(() => {
    if (!request) return
    const worker = new Worker(new URL("./read.worker.ts", import.meta.url), {
      type: "module",
    })
    worker.onmessage = ({ data }: MessageEvent<Layer[] | null>) => {
      worker.terminate()
      setLayers(data)
    }
    worker.onerror = (event) => {
      event.preventDefault()
      worker.terminate()
      setLayers(null)
    }
    worker.postMessage(request.source)
    return () => worker.terminate()
  }, [request])

  return (
    <section
      data-tool="shapefile-viewer"
      className="grid min-w-0 gap-4"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const files = Array.from(event.dataTransfer.files)
        if (files.length) open(files)
      }}
    >
      <input
        ref={picker}
        hidden
        type="file"
        multiple
        accept=".zip,.shp,.shx,.dbf,.prj,.cpg"
        aria-label={m.open}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? [])
          event.target.value = ""
          if (files.length) open(files)
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
          disabled={source === "example" && layers === undefined}
        >
          <Sparkles aria-hidden="true" />
          {m.example}
        </Button>
        {Array.isArray(source) && (
          <span
            dir="auto"
            className="min-w-0 text-sm wrap-anywhere text-muted-foreground"
          >
            {new Intl.ListFormat(lang).format(source.map(({ name }) => name))}
          </span>
        )}
      </div>
      {source && layers === undefined && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Spinner aria-hidden="true" />
          {m.loading}
        </p>
      )}
      {layers === null && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{m.invalid}</AlertDescription>
        </Alert>
      )}
      {layers && layer ? (
        <>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {layers.length > 1 ? (
              <>
                <label htmlFor={layerId} className="text-sm font-medium">
                  {m.layer}
                </label>
                <select
                  id={layerId}
                  className={selectClass}
                  value={current}
                  onChange={(event) => {
                    setCurrent(Number(event.target.value))
                    setSelected(0)
                  }}
                >
                  {layers.map(({ name }, index) => (
                    <option key={index} value={index}>
                      {name}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <span dir="auto" className="text-sm font-medium wrap-anywhere">
                {layer.name}
              </span>
            )}
          </div>
          {layer.placement !== "exact" && (
            <p className="text-sm text-muted-foreground">
              {layer.placement === "empty" ? m.noGeometry : m[layer.placement]}
            </p>
          )}
          <div
            className={
              showMap
                ? "grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(14rem,1fr)]"
                : "min-w-0"
            }
          >
            {showMap && (
              <OfflineMap
                messages={m}
                features={layer.features}
                selected={selected}
                onSelect={setSelected}
              />
            )}
            <FeatureInspector
              features={layer.features}
              messages={m}
              lang={lang}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </>
      ) : (
        <Empty className="min-h-64 border border-dashed bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Layers aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>
              {m.formats} {m.privacy}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  )
}
