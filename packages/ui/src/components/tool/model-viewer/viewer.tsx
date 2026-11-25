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
import { Box, Folder, FolderInput } from "../../../icons"
import { cn } from "../../../lib/utils"
import { useWorkspaceFocus } from "../../../lib/use-workspace-focus"
import { ViewportFrame } from "../viewport-focus"
import { exampleFile, getModelFormat, loadModel } from "./load-model"
import type { ChangeEvent } from "react"
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
  const focus = useWorkspaceFocus()
  const input = useRef<HTMLInputElement>(null)
  const folder = useRef<HTMLInputElement>(null)
  const chooseButton = useRef<HTMLButtonElement>(null)
  const emptyActions = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef(false)
  const sequence = useRef(0)
  const [model, setModel] = useState<OpenModel>()
  const [status, setStatus] = useState<
    "loading" | "invalid" | "missingCompanions"
  >()
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
    const restore = restoreFocus.current
    restoreFocus.current = false
    const active = document.activeElement
    if (focus.focused && !focus.frame.current?.contains(active)) {
      focus.focusButton.current?.focus({ preventScroll: true })
    } else if (restore && active === document.body) {
      chooseButton.current?.focus()
    }
  }, [model, focus.focused, focus.frame, focus.focusButton])

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
    } catch (error) {
      if (request === sequence.current) {
        setStatus(
          error instanceof Error && error.cause === "missingCompanions"
            ? "missingCompanions"
            : "invalid"
        )
      }
    }
  }

  function pickFiles(event: ChangeEvent<HTMLInputElement>) {
    void open(Array.from(event.currentTarget.files ?? []))
    event.currentTarget.value = ""
  }

  const choose = (
    <Button ref={chooseButton} onClick={() => input.current?.click()}>
      <Folder data-icon="inline-start" aria-hidden="true" />
      {m.open}
    </Button>
  )
  const chooseFolder = options.companions && (
    <Button variant="outline" onClick={() => folder.current?.click()}>
      <FolderInput data-icon="inline-start" aria-hidden="true" />
      {m.openFolder}
    </Button>
  )
  const opening = (
    <p
      role="status"
      className="flex min-h-10 shrink-0 items-center gap-2 px-3 text-sm"
    >
      <Spinner aria-hidden="true" />
      {m.loading}
    </p>
  )
  const openError = status && status !== "loading" && (
    <Alert variant="destructive" className="shrink-0">
      <AlertDescription>{m[status]}</AlertDescription>
    </Alert>
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
        onChange={pickFiles}
      />
      {options.companions && (
        <input
          ref={folder}
          type="file"
          hidden
          multiple
          {...{ webkitdirectory: "" }}
          onChange={pickFiles}
        />
      )}
      {!model && openError}
      {model ? (
        <>
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            {choose}
            {chooseFolder}
            <p
              dir="auto"
              className="min-w-0 flex-1 truncate text-sm font-medium"
              title={model.name}
            >
              {model.name}
            </p>
          </div>
          <ViewportFrame label={m.viewport} focus={focus}>
            {status === "loading" ? opening : openError}
            {model.missingResources && (
              <Alert className="shrink-0">
                <AlertDescription>{m.missingResources}</AlertDescription>
              </Alert>
            )}
            <Suspense fallback={opening}>
              <ModelPanel
                key={model.object.uuid}
                model={model}
                lang={lang}
                messages={m}
                focus={focus}
              />
            </Suspense>
            {dragging && (
              <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-background/85 p-4 text-center text-sm font-medium">
                {m.release}
              </div>
            )}
          </ViewportFrame>
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
              {options.companions && (
                <>
                  {m.companionHelp}
                  <br />
                </>
              )}
              {m.privacy}
            </EmptyDescription>
          </EmptyHeader>
          <div
            ref={emptyActions}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {choose}
            {chooseFolder}
            <Button variant="outline" onClick={() => void open()}>
              {m.example}
            </Button>
          </div>
          {status === "loading" && opening}
        </Empty>
      )}
    </section>
  )
}
