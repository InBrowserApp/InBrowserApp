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
import { FileArchive, Folder } from "@workspace/ui/icons"
import { RepackError } from "./types"
import type { Messages, Result } from "./types"

const extension = /\.(?:cbr|rar)$/i
type State =
  | { status: "working"; message: string }
  | { status: "error"; message: string; path?: string }
  | { status: "ready"; result: Result }

function Cover({ file }: { file: Blob }) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    const src = URL.createObjectURL(file)
    setUrl(src)
    return () => URL.revokeObjectURL(src)
  }, [file])
  return url ? (
    <img
      src={url}
      alt=""
      className="h-36 max-w-40 rounded-md object-contain"
      onError={() => setUrl("")}
    />
  ) : null
}

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
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
            <div role="status" className="text-sm">
              <p className="font-medium">
                {m.ready.replace(
                  "{total}",
                  new Intl.NumberFormat(lang).format(job.result.total)
                )}
              </p>
              {job.result.metadata ? (
                <p className="text-muted-foreground">{m.metadata}</p>
              ) : null}
            </div>
            <DocumentDownload
              file={job.result.cbz}
              filename={job.file.name.replace(extension, ".cbz")}
              label={m.download}
            />
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-4 bg-muted/25 p-4">
            {job.result.cover ? <Cover file={job.result.cover} /> : null}
            <dl className="grid min-w-0 flex-1 basis-36 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">{m.first}</dt>
                <dd className="wrap-anywhere">
                  <bdi>{job.result.first}</bdi>
                </dd>
              </div>
              {job.result.total > 1 ? (
                <div>
                  <dt className="text-muted-foreground">{m.last}</dt>
                  <dd className="wrap-anywhere">
                    <bdi>{job.result.last}</bdi>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </>
      ) : null}
    </DocumentWorkspace>
  )
}
