import { lazy, Suspense, useEffect, useRef, useState } from "react"
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
  const chooseButton = useRef<HTMLButtonElement>(null)
  const emptyActions = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef(false)
  const sequence = useRef(0)
  const [model, setModel] = useState<OpenModel>()
  const [status, setStatus] = useState<"loading" | "invalid">()
  const [dragging, setDragging] = useState(false)
  const options = getModelFormat(format)
  useEffect(
    () => () => {
      sequence.current += 1
    },
    []
  )
  useEffect(() => model?.dispose, [model])
  useEffect(() => {
    if (!restoreFocus.current) return
    restoreFocus.current = false
    if (document.activeElement === document.body) chooseButton.current?.focus()
  }, [model])

  async function open(files?: File[]) {
    if (files?.length === 0) return
    const request = ++sequence.current
    setStatus("loading")
    try {
      const next = await loadModel(files ?? [await exampleFile(format)], format)
      if (request !== sequence.current) {
        next.dispose()
        return
      }
      restoreFocus.current =
        emptyActions.current?.contains(document.activeElement) ?? false
      setModel(next)
      setStatus(undefined)
    } catch {
      if (request === sequence.current) setStatus("invalid")
    }
  }

  const choose = (
    <Button ref={chooseButton} onClick={() => input.current?.click()}>
      <Folder data-icon="inline-start" aria-hidden="true" />
      {m.open}
    </Button>
  )
  const opening = (
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
        multiple={Boolean(options.companions)}
        accept={[
          ...options.extensions,
          ...(options.companions?.accept ?? []),
        ].join(",")}
        onChange={(event) => {
          void open(Array.from(event.currentTarget.files ?? []))
          event.currentTarget.value = ""
        }}
      />
      {status === "invalid" && (
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
          {status === "loading" && opening}
          {model.missingResources && (
            <Alert>
              <AlertDescription>{m.missingResources}</AlertDescription>
            </Alert>
          )}
          <Suspense fallback={opening}>
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
                {[
                  ...options.extensions,
                  ...(options.companions?.labels ?? []),
                ].join(" · ")}
              </span>
              <br />
              {m.privacy}
            </EmptyDescription>
          </EmptyHeader>
          <div
            ref={emptyActions}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {choose}
            <Button variant="outline" onClick={() => void open()}>
              {m.example}
            </Button>
          </div>
          {status === "loading" && opening}
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
