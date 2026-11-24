import { lazy, Suspense, useEffect, useState } from "react"
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
import { Box, Folder } from "@workspace/ui/icons"
import { loadStep } from "./load-step"
import example from "./mounting-bracket.step?raw"
import type Messages from "./messages/en.json"
import type { StepModel } from "./step-data"

const ModelPanel = lazy(() => import("./model-panel"))

type ModelState = "loading" | "invalid" | "loadError" | StepModel

function Loading({ label }: { label: string }) {
  return (
    <p
      role="status"
      className="flex min-h-64 flex-1 items-center justify-center gap-2 p-6 text-sm"
    >
      <Spinner aria-hidden="true" />
      {label}
    </p>
  )
}

function OpenModel({
  file,
  lang,
  messages,
  focusOnOpen,
}: {
  file: File
  lang: string
  messages: typeof Messages
  focusOnOpen: boolean
}) {
  const [model, setModel] = useState<ModelState>("loading")
  useEffect(() => {
    const controller = new AbortController()
    void loadStep(file, controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setModel(data ?? "invalid")
      },
      () => {
        if (!controller.signal.aborted) setModel("loadError")
      }
    )
    return () => controller.abort()
  }, [file])

  const loading = <Loading label={messages.loading} />
  if (model === "loading") return loading
  if (typeof model === "string") {
    return (
      <Alert variant="destructive" className="m-3 w-auto">
        <AlertDescription>{messages[model]}</AlertDescription>
      </Alert>
    )
  }
  return (
    <Suspense fallback={loading}>
      <ModelPanel
        model={model}
        filename={file.name}
        lang={lang}
        messages={messages}
        focusOnOpen={focusOnOpen}
      />
    </Suspense>
  )
}

export default function Client({
  messages: m,
  lang,
}: {
  messages: typeof Messages
  lang: string
}) {
  const [selection, setSelection] = useState<{
    file: File | null
    id: number
    focusOnOpen: boolean
  }>({
    file: null,
    id: 0,
    focusOnOpen: false,
  })
  function open(file: File | null, focusOnOpen = false) {
    setSelection((current) => ({ file, id: current.id + 1, focusOnOpen }))
  }
  return (
    <DocumentWorkspace
      tool="step-viewer"
      file={selection.file}
      onFile={open}
      accept=".step,.stp"
      active={Boolean(selection.file)}
      fitContent
      messages={m}
      renderEmpty={(chooseFile) => (
        <Empty className="min-h-72">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Box aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>
              {m.formats}
              <br />
              {m.privacy}
            </EmptyDescription>
          </EmptyHeader>
          <div className="flex flex-wrap justify-center gap-2">
            <Button data-file-open onClick={chooseFile}>
              <Folder data-icon="inline-start" aria-hidden="true" />
              {m.open}
            </Button>
            <Button
              variant="outline"
              onClick={(event) =>
                open(
                  new File([example], "mounting-bracket.step"),
                  event.detail === 0
                )
              }
            >
              {m.example}
            </Button>
          </div>
        </Empty>
      )}
    >
      {selection.file && (
        <OpenModel
          key={selection.id}
          file={selection.file}
          lang={lang}
          messages={m}
          focusOnOpen={selection.focusOnOpen}
        />
      )}
    </DocumentWorkspace>
  )
}
