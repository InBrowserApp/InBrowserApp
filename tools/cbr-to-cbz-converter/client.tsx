import { useEffect, useState } from "react"
import { ComicDownload } from "@workspace/ui/components/tool/comic-download"
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
import { FileArchive, Folder } from "@workspace/ui/icons"
import { RepackError } from "./types"
import type { Messages, Result } from "./types"

const extension = /\.(?:cbr|rar)$/i
type State =
  | { status: "working"; message: string }
  | { status: "error"; message: string; path?: string }
  | { status: "ready"; result: Result }

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
    setJob(file ? { file, status: "working", message: m.opening } : null)
  }

  useEffect(() => {
    if (!file) return
    const update = (state: State) =>
      setJob((current) =>
        current?.file === file ? { file, ...state } : current
      )
    if (!file.size || !extension.test(file.name)) {
      update({ status: "error", message: m.invalid })
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    const number = new Intl.NumberFormat(lang)
    void import("./convert")
      .then(async ({ repack }) => {
        signal.throwIfAborted()
        const result = await repack(file, signal, (progress) => {
          const message =
            progress === "saving"
              ? m.saving
              : m.packing
                  .replace("{page}", number.format(progress.page))
                  .replace("{total}", number.format(progress.total))
          update({ status: "working", message })
        })
        update({ status: "ready", result })
      })
      .catch((reason: unknown) => {
        if (signal.aborted) return
        const error = reason instanceof RepackError ? reason : null
        update({
          status: "error",
          message: m[error?.code ?? "damaged"],
          path: error?.path,
        })
      })
    return () => controller.abort()
  }, [file, lang, m])

  return (
    <DocumentWorkspace
      tool="cbr-to-cbz-converter"
      file={file}
      onFile={chooseFile}
      accept=".cbr,.rar,application/vnd.comicbook-rar,application/vnd.rar"
      active={false}
      messages={job?.status === "working" ? { ...m, clear: m.cancel } : m}
      renderEmpty={(open) => (
        <Empty className="min-h-60 bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileArchive aria-hidden="true" />
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
      {job?.status === "working" ? (
        <p
          role="status"
          className="flex min-h-28 items-center justify-center gap-2 p-4 text-sm"
        >
          <Spinner className="shrink-0" />
          {job.message}
        </p>
      ) : null}
      {job?.status === "error" ? (
        <Alert variant="destructive" className="rounded-none border-0">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>
            <p>{job.message}</p>
            {job.path ? (
              <p dir="auto" className="wrap-anywhere">
                {job.path}
              </p>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}
      {job?.status === "ready" ? (
        <ComicDownload
          file={job.result.cbz}
          preview={job.result}
          filename={job.file.name.replace(extension, ".cbz")}
          detail={job.result.metadata ? m.metadata : undefined}
          lang={lang}
          messages={m}
        />
      ) : null}
    </DocumentWorkspace>
  )
}
