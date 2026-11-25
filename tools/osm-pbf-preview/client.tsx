import { useEffect, useRef, useState } from "react"
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
import { FolderInput, Map, Sparkles } from "@workspace/ui/icons"
import type english from "./messages/en.json"
import type { OsmPreview } from "./read"

export type Messages = { readonly [Key in keyof typeof english]: string }
type Source = File | "example"

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const picker = useRef<HTMLInputElement>(null)
  const [request, setRequest] = useState<{ source: Source }>()
  const source = request?.source
  const [preview, setPreview] = useState<OsmPreview | null>()
  const [selected, setSelected] = useState(0)
  const number = new Intl.NumberFormat(lang)

  function open(next: Source) {
    setSelected(0)
    setPreview(undefined)
    setRequest({ source: next })
  }

  useEffect(() => {
    if (!request) return
    const worker = new Worker(new URL("./read.worker.ts", import.meta.url), {
      type: "module",
    })
    worker.onmessage = ({ data }: MessageEvent<OsmPreview | null>) => {
      worker.terminate()
      setPreview(data)
    }
    worker.onerror = (event) => {
      event.preventDefault()
      worker.terminate()
      setPreview(null)
    }
    worker.postMessage(request.source)
    return () => worker.terminate()
  }, [request])

  return (
    <section
      data-tool="osm-pbf-preview"
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
        accept=".osm.pbf,.pbf"
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
          disabled={source === "example" && preview === undefined}
        >
          <Sparkles aria-hidden="true" />
          {m.example}
        </Button>
        {source && source !== "example" && (
          <span
            dir="auto"
            className="min-w-0 text-sm wrap-anywhere text-muted-foreground"
          >
            {source.name}
          </span>
        )}
      </div>
      {source && preview === undefined && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Spinner aria-hidden="true" />
          {m.loading}
        </p>
      )}
      {preview === null && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{m.invalid}</AlertDescription>
        </Alert>
      )}
      {preview ? (
        <>
          <dl className="grid grid-cols-3 gap-3 rounded-lg border bg-card px-4 py-3 text-card-foreground">
            {(["nodes", "ways", "relations"] as const).map((kind) => (
              <div key={kind} className="min-w-0">
                <dt className="text-sm wrap-anywhere text-muted-foreground">
                  {m[kind]}
                </dt>
                <dd className="text-lg font-semibold tabular-nums">
                  {number.format(preview.counts[kind])}
                </dd>
              </div>
            ))}
          </dl>
          {preview.features.length ? (
            <>
              <p className="text-sm text-muted-foreground">{m.sample}</p>
              <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(14rem,1fr)]">
                <div className="grid min-w-0 gap-2">
                  <OfflineMap
                    messages={m}
                    features={preview.features}
                    selected={selected}
                    onSelect={setSelected}
                  />
                  {source !== "example" && (
                    <a
                      className="w-fit text-xs text-muted-foreground underline underline-offset-2"
                      href="https://www.openstreetmap.org/copyright"
                    >
                      {m.attribution}
                    </a>
                  )}
                </div>
                <FeatureInspector
                  messages={m}
                  lang={lang}
                  features={preview.features}
                  selected={selected}
                  onSelect={setSelected}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{m.noFeatures}</p>
          )}
        </>
      ) : (
        <Empty className="min-h-64 border border-dashed bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Map aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.formats}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  )
}
