import { useEffect, useState } from "react"
import { DocumentHtmlResult } from "@workspace/ui/components/tool/document-html-result"
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
import { FileText, Folder } from "@workspace/ui/icons"
import type { convert } from "./convert"
import { extension } from "./types"
import type { Messages } from "./types"

type State =
  | { kind: "working"; message: string }
  | { kind: "error"; message: string }
  | { kind: "ready"; output: Awaited<ReturnType<typeof convert>> }

export default function Client({ messages: m }: { messages: Messages }) {
  const [job, setJob] = useState<(State & { file: File }) | null>(null)
  const file = job?.file ?? null

  function chooseFile(file: File | null) {
    setJob(file ? { file, kind: "working", message: m.reading } : null)
  }

  useEffect(() => {
    if (!file) return
    const update = (state: State) =>
      setJob((current) =>
        current?.file === file ? { file, ...state } : current
      )
    if (!extension.test(file.name) || !file.size) {
      update({ kind: "error", message: !file.size ? m.invalid : m.unsupported })
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    let errorMessage = (_reason: unknown) => m.engineUnavailable
    void import("./convert")
      .then(async ({ convert, failure }) => {
        signal.throwIfAborted()
        errorMessage = (reason) => m[failure(reason)]
        const output = await convert(file, signal, m, () =>
          update({ kind: "working", message: m.saving })
        )
        signal.throwIfAborted()
        update({ kind: "ready", output })
      })
      .catch((reason: unknown) => {
        if (!signal.aborted)
          update({ kind: "error", message: errorMessage(reason) })
      })
    return () => controller.abort()
  }, [file, m])

  return (
    <DocumentWorkspace
      tool="epub-to-word-converter"
      file={file}
      onFile={chooseFile}
      accept=".epub,application/epub+zip"
      active={job?.kind === "ready"}
      messages={job?.kind === "working" ? { ...m, clear: m.cancel } : m}
      renderEmpty={(open) => (
        <Empty className="min-h-60 bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText aria-hidden="true" />
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
      {job?.kind === "working" ? (
        <p
          role="status"
          className="flex min-h-28 items-center justify-center gap-2 p-4 text-sm"
        >
          <Spinner aria-hidden="true" className="shrink-0" />
          {job.message}
        </p>
      ) : job?.kind === "error" ? (
        <Alert variant="destructive" className="rounded-none border-0">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{job.message}</AlertDescription>
        </Alert>
      ) : job?.kind === "ready" ? (
        <DocumentHtmlResult
          html={job.output.preview.html}
          title={job.output.preview.title}
          file={job.output.file}
          filename={job.file.name.replace(extension, ".docx")}
          messages={m}
          notes={
            <details className="shrink-0 border-b px-3 py-2 text-sm">
              <summary className="cursor-pointer font-medium">
                {m.notes}
              </summary>
              {job.output.notes.map((note) => (
                <p key={note} className="pt-2 text-muted-foreground">
                  {note}
                </p>
              ))}
            </details>
          }
        />
      ) : null}
    </DocumentWorkspace>
  )
}
