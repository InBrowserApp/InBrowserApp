import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { disposeModel } from "@workspace/model-mesh/dispose"
import { Alert, AlertDescription } from "../../ui/alert"
import { Button } from "../../ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../ui/empty"
import { Spinner } from "../../ui/spinner"
import { Box, Folder } from "../../../icons"
import { cn } from "../../../lib/utils"
import { exampleFile, getModelFormat, loadModel } from "./load-model"
import type { ModelFormat, OpenModel } from "./load-model"
import type { ModelViewerMessages } from "./messages"

const ModelPanel = lazy(() => import("./panel"))

export default function ModelViewer({
  format,
  lang,
  messages: m,
}: {
  format: ModelFormat
  lang: string
  messages: ModelViewerMessages
}) {
  const input = useRef<HTMLInputElement>(null)
  const sequence = useRef(0)
  const [model, setModel] = useState<OpenModel>()
  const [loading, setLoading] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [dragging, setDragging] = useState(false)
  const options = getModelFormat(format)
  useEffect(
    () => () => {
      sequence.current += 1
    },
    []
  )
  useEffect(
    () => () => {
      if (model) disposeModel(model.object)
    },
    [model]
  )

  async function open(files: File[]) {
    if (!files.length) return
    const request = ++sequence.current
    setLoading(true)
    setInvalid(false)
    try {
      const next = await loadModel(files, format)
      if (request === sequence.current) setModel(next)
      else disposeModel(next.object)
    } catch {
      if (request === sequence.current) setInvalid(true)
    } finally {
      if (request === sequence.current) setLoading(false)
    }
  }

  const choose = (
    <Button onClick={() => input.current?.click()}>
      <Folder data-icon="inline-start" aria-hidden="true" />
      {m.open}
    </Button>
  )
  const status = (
    <p role="status" className="flex min-h-10 items-center gap-2 px-3 text-sm">
      <Spinner aria-hidden="true" />
      {m.loading}
    </p>
  )
  return (
    <section
      className={cn(
        "relative grid min-w-0 gap-3 rounded-lg",
        dragging && "ring-2 ring-ring"
      )}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          setDragging(false)
        }
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        void open(Array.from(event.dataTransfer.files))
      }}
    >
      <input
        ref={input}
        type="file"
        hidden
        multiple={options.multiple}
        accept={options.accept}
        onChange={(event) => {
          void open(Array.from(event.currentTarget.files ?? []))
          event.currentTarget.value = ""
        }}
      />
      {invalid && (
        <Alert variant="destructive">
          <AlertDescription>{m.invalid}</AlertDescription>
        </Alert>
      )}
      {model ? (
        <>
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            {choose}
            <p
              dir="auto"
              className="min-w-0 flex-1 truncate text-sm font-medium"
              title={model.name}
            >
              {model.name}
            </p>
          </div>
          {loading && status}
          {model.missingResources && (
            <Alert>
              <AlertDescription>{m.missingResources}</AlertDescription>
            </Alert>
          )}
          <Suspense fallback={status}>
            <ModelPanel
              key={model.object.uuid}
              model={model}
              lang={lang}
              messages={m}
            />
          </Suspense>
        </>
      ) : (
        <Empty className="min-h-72 border border-dashed bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Box aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{dragging ? m.release : m.drop}</EmptyTitle>
            <EmptyDescription>
              <span dir="ltr" className="font-mono">
                {options.accept
                  .replaceAll(",", " · ")
                  .replace("image/*", "PNG · JPG · WebP")}
              </span>
              <br />
              {m.privacy}
            </EmptyDescription>
          </EmptyHeader>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {choose}
            <Button
              variant="outline"
              onClick={() => void open([exampleFile(format)])}
            >
              {m.example}
            </Button>
          </div>
          {loading && status}
        </Empty>
      )}
      {model && dragging && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center rounded-lg bg-background/85 p-4 text-center text-sm font-medium">
          {m.release}
        </div>
      )}
    </section>
  )
}
