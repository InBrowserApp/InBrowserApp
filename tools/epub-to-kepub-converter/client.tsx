import { useEffect, useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
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
import { BookOpen, Folder } from "@workspace/ui/icons"
import { KepubError, type Messages } from "./types"

const extension = /\.epub$/i

type Job =
  | { status: "working"; message: string }
  | { status: "error"; message: string }
  | { status: "ready"; file: Blob; title?: string }

export default function Client({
  lang,
  title,
  messages: m,
}: {
  lang: string
  title: string
  messages: Messages
}) {
  const [job, setJob] = useState<(Job & { source: File }) | null>(null)
  const source = job?.source ?? null

  function chooseFile(file: File | null) {
    setJob(
      file ? { source: file, status: "working", message: m.opening } : null
    )
  }

  useEffect(() => {
    if (!source) return
    const update = (state: Job) =>
      setJob((current) =>
        current?.source === source ? { source, ...state } : current
      )
    if (!extension.test(source.name) || !source.size) {
      update({
        status: "error",
        message: extension.test(source.name) ? m.damaged : m.invalid,
      })
      return
    }
    const controller = new AbortController()
    const { signal } = controller
    const number = new Intl.NumberFormat(lang)
    void import("./convert")
      .then(async ({ convertEpub }) => {
        const result = await convertEpub(source, signal, (progress) =>
          update({
            status: "working",
            message:
              progress === "saving"
                ? m.saving
                : m.converting
                    .replace("{current}", number.format(progress.current))
                    .replace("{total}", number.format(progress.total)),
          })
        )
        update({ status: "ready", ...result })
      })
      .catch((error: unknown) => {
        if (!signal.aborted) {
          update({
            status: "error",
            message: m[error instanceof KepubError ? error.code : "damaged"],
          })
        }
      })
    return () => controller.abort()
  }, [source, lang, m])

  return (
    <DocumentWorkspace
      tool="epub-to-kepub-converter"
      file={source}
      onFile={chooseFile}
      accept=".epub,application/epub+zip"
      active={false}
      messages={{
        ...m,
        reader: title,
        clear: job?.status === "working" ? m.cancel : m.clear,
      }}
      renderEmpty={(open) => (
        <Empty className="min-h-60 bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen aria-hidden="true" />
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
          <AlertDescription>{job.message}</AlertDescription>
        </Alert>
      ) : null}
      {job?.status === "ready" ? (
        <div className="space-y-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div role="status" className="min-w-0 text-sm">
              <p className="font-medium">{m.ready}</p>
              <p className="wrap-anywhere text-muted-foreground">
                <bdi>{job.title || job.source.name}</bdi>
              </p>
            </div>
            <DocumentDownload
              file={job.file}
              filename={job.source.name.replace(
                /(?:\.kepub)?\.epub$/i,
                ".kepub.epub"
              )}
              label={m.download}
            />
          </div>
          <p className="text-sm text-muted-foreground">{m.transfer}</p>
        </div>
      ) : null}
    </DocumentWorkspace>
  )
}
