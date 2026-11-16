import { useRef, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"
import { Settings } from "./client/settings"
import { Upload } from "./client/upload"
import { Preview } from "./client/preview"
import { Output } from "./client/output"
import { LayersCard } from "./client/layers-card"
import { useDocument } from "./client/use-document"
import { useLayerEditor } from "./client/use-layer-editor"
import { usePreparedLayers } from "./client/prepared-layers"
import type { Messages } from "./types"

const samplePage = { width: 612, height: 792, x: 0, y: 0, rotation: 0 }

function Client({ messages: m }: Readonly<{ messages: Messages }>) {
  const doc = useDocument(m)
  const [currentPage, setCurrentPage] = useState(1)
  const input = useRef<HTMLInputElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const count = doc.source?.pages.length ?? 0
  const page = Math.min(currentPage, count || 1)
  const geometry = doc.source?.pages[page - 1] ?? samplePage
  const editor = useLayerEditor(geometry, doc.invalidate)
  const { activeId } = editor
  const { prepared, tasks } = usePreparedLayers(editor.layers, count, m)
  const selected = prepared.find((item) => item.layer.id === activeId)
  const aspect = selected?.mark ? selected.mark.width / selected.mark.height : 4
  const busy = doc.status === "generating"
  const preparing = prepared.some((item) => item.preparing)
  const canGenerate = Boolean(
    doc.source &&
    prepared.length &&
    !preparing &&
    doc.status === "idle" &&
    prepared.every((item) => item.mark && !item.error && !item.rangeError)
  )

  function backToPreview() {
    preview.current?.scrollIntoView({ block: "start" })
    preview.current
      ?.querySelector<HTMLButtonElement>(
        'button[data-layer-id][aria-pressed="true"]'
      )
      ?.focus({ preventScroll: true })
  }

  return (
    <div
      role="group"
      aria-label={m.layersTitle}
      className="space-y-6"
      onKeyDown={(event) => {
        if (
          busy ||
          (!event.ctrlKey && !event.metaKey) ||
          event.key.toLowerCase() !== "z" ||
          (event.target as HTMLElement).closest(
            "input, textarea, select, [contenteditable=true]"
          )
        )
          return
        event.preventDefault()
        if (event.shiftKey) editor.redo()
        else editor.undo()
      }}
    >
      {tasks}
      <input
        ref={input}
        className="hidden"
        type="file"
        name="watermark-add-image"
        aria-label={m.addImage}
        accept="image/png,image/jpeg,.png,.jpg,.jpeg"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) editor.add("image", file)
          event.target.value = ""
        }}
      />
      <Upload
        messages={m}
        source={doc.source}
        reading={doc.status === "reading"}
        disabled={busy}
        onSelect={(file) => {
          if (file) {
            editor.end(true)
            setCurrentPage(1)
            void doc.select(file)
          }
        }}
        onClear={() => {
          editor.end(true)
          setCurrentPage(1)
          doc.clear()
        }}
      />
      {doc.error ? (
        <Alert variant="destructive" role="alert">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>{m.errorTitle}</AlertTitle>
          <AlertDescription>{doc.error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="grid items-start gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <LayersCard
            items={prepared}
            selectedId={activeId}
            messages={m}
            onSelect={editor.select}
            onAdd={(kind) =>
              kind === "image" ? input.current?.click() : editor.add("text")
            }
            onDuplicate={() => editor.duplicate(aspect)}
            onDelete={() => editor.remove()}
            onOrder={editor.reorder}
            onUndo={editor.undo}
            onRedo={editor.redo}
            canUndo={editor.canUndo}
            canRedo={editor.canRedo}
            disabled={busy}
          />
        </div>
        <div
          ref={preview}
          className="min-w-0 scroll-mt-6 space-y-4 lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1"
        >
          <Preview
            key={doc.source?.file.name ?? "sample"}
            messages={m}
            source={doc.source}
            items={prepared}
            selectedId={activeId}
            page={page}
            onPage={setCurrentPage}
            geometry={geometry}
            disabled={busy}
            onSelect={editor.select}
            onChange={editor.optionsChange}
            onStart={editor.begin}
            onEnd={editor.end}
            onDelete={editor.remove}
          />
          <Output
            messages={m}
            result={doc.result}
            busy={busy}
            preparing={preparing}
            canGenerate={canGenerate}
            onGenerate={() => {
              if (canGenerate) {
                editor.end()
                void doc.generate(
                  prepared.map((item) => ({
                    mark: item.mark!,
                    options: item.layer.options,
                    pages: item.pages,
                  }))
                )
              }
            }}
          />
        </div>
        {selected ? (
          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <Settings
              key={activeId}
              options={selected.layer.options}
              onChange={(value) => editor.optionsChange(activeId, value)}
              messages={m}
              image={selected.layer.image?.file ?? null}
              onImage={(file) => {
                if (file)
                  editor.updateLayer(activeId, (layer) => ({
                    ...layer,
                    image: { id: crypto.randomUUID(), file },
                  }))
              }}
              markError={
                selected.error ? m[selected.error as keyof Messages] : ""
              }
              range={selected.layer.range}
              onRange={(range) =>
                editor.updateLayer(activeId, (layer) => ({ ...layer, range }))
              }
              rangeError={selected.rangeError}
              disabled={busy}
              geometry={geometry}
              aspect={aspect}
              onBack={backToPreview}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Client
