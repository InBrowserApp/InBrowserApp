import { useEffect, useMemo, useState } from "react"
import { exampleDrawing } from "@workspace/dxf-drawing/example"
import { exportSvg } from "@workspace/dxf-drawing/vector"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { FileDropPicker } from "@workspace/ui/components/tool/file-drop-picker"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Layers, Ruler } from "@workspace/ui/icons"
import { useMeshWorker } from "@workspace/ui/lib/use-mesh-worker"
import type { VectorDrawing } from "@workspace/dxf-drawing/vector"
import type { DrawingResult } from "./dxf.worker"
import type English from "./messages/en.json"

type Messages = typeof English

function VectorPreview({ svg, label }: { svg: Blob; label: string }) {
  const [resource, setResource] = useState<{ file: Blob; url: string }>()
  useEffect(() => {
    const url = URL.createObjectURL(svg)
    setResource({ file: svg, url })
    return () => URL.revokeObjectURL(url)
  }, [svg])

  return (
    resource?.file === svg && (
      <img
        src={resource.url}
        alt={label}
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain p-5"
      />
    )
  )
}

function DrawingPanel({
  drawing,
  fileName,
  lang,
  focusOnReady,
  messages: m,
}: {
  drawing: VectorDrawing
  fileName: string
  lang: string
  focusOnReady: boolean
  messages: Messages
}) {
  const { layers } = drawing
  const [selected, setSelected] = useState(
    () =>
      new Set(
        layers.filter((layer) => layer.visible).map((layer) => layer.name)
      )
  )
  const result = useMemo(
    () => exportSvg(drawing, selected),
    [drawing, selected]
  )
  const dimensions = new Intl.NumberFormat(lang, {
    maximumSignificantDigits: 6,
  })
  const physicalSize = Boolean(drawing.millimetersPerUnit)
  const allSelected = selected.size === layers.length
  const noneSelected = selected.size === 0

  function toggle(name: string) {
    setSelected((previous) => {
      const next = new Set(previous)
      if (!next.delete(name)) next.add(name)
      return next
    })
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-background">
      <div className="grid min-w-0 md:grid-cols-[15rem_minmax(0,1fr)]">
        <fieldset
          className="min-w-0 border-b p-4 md:border-e md:border-b-0"
          aria-label={m.layers}
        >
          <div className="flex flex-wrap items-center gap-2 font-medium">
            <Layers className="size-4 shrink-0" aria-hidden="true" />
            {m.layers}
          </div>
          {layers.length > 1 && (
            <div className="mt-2 flex flex-wrap gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="px-2 aria-disabled:opacity-50"
                aria-disabled={allSelected || undefined}
                onClick={
                  allSelected
                    ? undefined
                    : () =>
                        setSelected(new Set(layers.map((layer) => layer.name)))
                }
              >
                {m.selectAll}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="px-2 aria-disabled:opacity-50"
                aria-disabled={noneSelected || undefined}
                onClick={
                  noneSelected ? undefined : () => setSelected(new Set())
                }
              >
                {m.clear}
              </Button>
            </div>
          )}
          <div className="mt-2 max-h-48 space-y-1 overflow-auto md:max-h-80">
            {layers.map(({ name, label, color }) => (
              <label
                key={name}
                className="flex min-h-9 cursor-pointer items-center gap-2 rounded-md px-2 text-sm hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={selected.has(name)}
                  onChange={() => toggle(name)}
                  className="size-4 shrink-0 accent-primary"
                />
                <span
                  className="size-3 shrink-0 rounded-sm border border-black/10"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <bdi className="min-w-0 wrap-anywhere">{label}</bdi>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="relative grid min-h-56 place-items-center overflow-hidden bg-white md:min-h-96">
          {result ? (
            <VectorPreview svg={result.svg} label={m.preview} />
          ) : (
            <p className="px-4 text-center text-sm text-neutral-600">
              {m.noLayers}
            </p>
          )}
        </div>
      </div>
      {result && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t p-3">
          <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
            <span className="text-muted-foreground">{m.size}</span>
            <span className="font-medium tabular-nums">
              <bdi dir="ltr">
                {dimensions.format(result.width)} ×{" "}
                {dimensions.format(result.height)}
                {physicalSize && " mm"}
              </bdi>
              {!physicalSize && ` ${m.fileUnits}`}
            </span>
          </p>
          <DocumentDownload
            file={result.svg}
            filename={`${fileName.replace(/\.dxf$/i, "") || "drawing"}.svg`}
            label={m.download}
            focusOnReady={focusOnReady}
          />
        </div>
      )}
    </section>
  )
}

export default function DxfToSvg({
  lang,
  messages: m,
}: {
  lang: string
  messages: Messages
}) {
  const { result, status, run } = useMeshWorker<DrawingResult>(
    exampleDrawing,
    () =>
      new Worker(new URL("./dxf.worker.ts", import.meta.url), {
        type: "module",
      }),
    (file) => ({ file, lang })
  )
  const [focusOnReady, setFocusOnReady] = useState(false)
  const [loaded, setLoaded] = useState<{
    id: number
    name: string
    drawing: VectorDrawing
  }>()
  if (result?.data.kind === "ready" && result.id !== loaded?.id) {
    setLoaded({
      id: result.id,
      name: result.file.name,
      drawing: result.data.drawing,
    })
  }
  const outcome = status ?? result?.data.kind
  const error =
    outcome && outcome !== "working" && outcome !== "ready"
      ? m[outcome]
      : undefined

  function open(file?: File) {
    setFocusOnReady(
      !file && document.activeElement instanceof HTMLButtonElement
    )
    void run(file)
  }

  return (
    <div className="grid min-w-0 gap-3">
      <FileDropPicker
        name={loaded?.name ?? ""}
        accept=".dxf"
        formats=".dxf"
        icon={Ruler}
        labels={{
          chooseFile: m.open,
          changeFile: m.change,
          dropHint: m.drop,
          privacy: m.privacy,
        }}
        example={{ label: m.example, onClick: () => open() }}
        onFile={open}
      />
      {outcome === "working" && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Spinner aria-hidden="true" />
          {m.reading}
        </p>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loaded && (
        <DrawingPanel
          key={loaded.id}
          drawing={loaded.drawing}
          fileName={loaded.name}
          lang={lang}
          focusOnReady={focusOnReady}
          messages={m}
        />
      )}
    </div>
  )
}
