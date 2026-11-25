import { useEffect, useState } from "react"
import { failureMessage } from "@workspace/comic/errors"
import type { Comic } from "@workspace/comic/types"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { FileImage, Folder } from "@workspace/ui/icons"
import { Results } from "./results"
import { extension } from "./types"
import type { Messages } from "./types"

type State =
  | { kind: "opening" }
  | { kind: "error"; message: string }
  | { kind: "ready"; comic: Comic }

export default function Client({
  lang,
  messages: m,
}: {
  lang: string
  messages: Messages
}) {
  const [job, setJob] = useState<(State & { file: File }) | null>(null)
  const file = job?.file ?? null

  function chooseFile(file: File | null) {
    setJob(file ? { kind: "opening", file } : null)
  }

  useEffect(() => {
    if (!file) return
    const update = (state: State) =>
      setJob((current) =>
        current?.file === file ? { file, ...state } : current
      )
    if (!file.size || !extension.test(file.name)) {
      update({ kind: "error", message: m.invalid })
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    let comic: Comic | undefined
    void import("./open")
      .then(async ({ open }) => {
        signal.throwIfAborted()
        const result = await open(file, signal)
        if (signal.aborted) {
          await result.dispose()
          return
        }
        comic = result
        update({ kind: "ready", comic })
      })
      .catch((reason: unknown) => {
        if (!signal.aborted)
          update({ kind: "error", message: failureMessage(reason, m) })
      })
    return () => {
      controller.abort()
      void comic?.dispose().catch(() => {})
    }
  }, [file, m])

  return (
    <DocumentWorkspace
      tool="comic-image-extractor"
      file={file}
      onFile={chooseFile}
      accept=".cbz,.cbr,.cb7"
      active={false}
      messages={job?.kind === "opening" ? { ...m, clear: m.cancel } : m}
      renderEmpty={(open) => (
        <Empty className="min-h-60 bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileImage aria-hidden="true" />
            </EmptyMedia>
            <Button data-file-open className="min-h-11 px-4" onClick={open}>
              <Folder data-icon="inline-start" aria-hidden="true" />
              {m.open}
            </Button>
          </EmptyHeader>
          <EmptyTitle>{m.drop}</EmptyTitle>
          <EmptyDescription>{m.privacy}</EmptyDescription>
        </Empty>
      )}
    >
      {job?.kind === "opening" ? (
        <p
          role="status"
          className="flex min-h-28 items-center justify-center gap-2 p-4 text-sm"
        >
          <Spinner aria-hidden="true" className="shrink-0" />
          {m.opening}
        </p>
      ) : job?.kind === "error" ? (
        <Alert variant="destructive" className="rounded-none border-0">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{job.message}</AlertDescription>
        </Alert>
      ) : job?.kind === "ready" ? (
        <Results comic={job.comic} file={job.file} lang={lang} messages={m} />
      ) : null}
    </DocumentWorkspace>
  )
}
