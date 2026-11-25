import { useEffect, useRef, useState } from "react"
import type { Reader, ReaderState } from "@workspace/pdf-reader"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { DocumentToolbar } from "@workspace/ui/components/tool/document-toolbar"
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
import { Folder, ScanText } from "@workspace/ui/icons"
import type { Messages, Reply, Result } from "./types"

const extension = /\.djvu?$/i
type Job =
  | { status: "working" | "error"; message: string }
  | { status: "ready"; result: Result }

const initial: ReaderState = {
  page: 1,
  total: 0,
  zoom: 100,
  current: 0,
  matches: 0,
  searching: false,
  query: "",
}

export default function Client({
  lang,
  messages: m,
}: {
  lang: string
  messages: Messages
}) {
  const [job, setJob] = useState<(Job & { file: File }) | null>(null)
  const [reader, setReader] = useState<Reader | null>(null)
  const [state, setState] = useState(initial)
  const [previewFailed, setPreviewFailed] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const file = job?.file ?? null
  const result = job?.status === "ready" ? job.result : null

  function chooseFile(next: File | null) {
    setJob(next ? { file: next, status: "working", message: m.opening } : null)
    setReader(null)
    setState(initial)
    setPreviewFailed(false)
  }

  useEffect(() => {
    if (!file) return
    let worker: Worker | undefined
    const update = (state: Job) =>
      setJob((current) =>
        current?.file === file ? { file, ...state } : current
      )
    const progress = (message: string) => update({ status: "working", message })
    const fail = (message: string) => {
      worker?.terminate()
      update({ status: "error", message })
    }
    if (!file.size || !extension.test(file.name)) {
      fail(m.invalid)
      return
    }
    const number = new Intl.NumberFormat(lang)
    try {
      worker = new Worker(new URL("./convert.worker.ts", import.meta.url), {
        type: "module",
      })
      worker.onmessage = ({ data }: MessageEvent<Reply>) => {
        switch (data.type) {
          case "page":
            progress(
              m.converting
                .replace("{page}", number.format(data.page))
                .replace("{total}", number.format(data.total))
            )
            break
          case "saving":
            progress(m.saving)
            break
          case "ready":
            worker?.terminate()
            update({ status: "ready", result: data.result })
            break
          case "pageError":
            fail(m.pageError.replace("{page}", number.format(data.page)))
            break
          default:
            fail(m[data.type])
        }
      }
      worker.onerror = () => fail(m.failed)
      worker.postMessage(file)
    } catch {
      fail(m.failed)
    }
    return () => worker?.terminate()
  }, [file, lang, m])

  useEffect(() => {
    if (!result || !container.current) return
    const element = container.current
    const controller = new AbortController()
    const { signal } = controller
    function displayFailure() {
      if (!signal.aborted) setPreviewFailed(true)
      controller.abort()
    }
    void import("@workspace/pdf-reader")
      .then(({ openReader }) => {
        signal.throwIfAborted()
        return openReader({
          file: result.pdf,
          container: element,
          signal,
          onChange: (update) => {
            if (!signal.aborted) setState((old) => ({ ...old, ...update }))
          },
          onError: displayFailure,
          onPassword: displayFailure,
        })
      })
      .then((instance) => {
        if (signal.aborted) return
        instance.zoom("page-fit")
        setReader(instance)
      })
      .catch(displayFailure)
    return () => controller.abort()
  }, [result])

  const number = new Intl.NumberFormat(lang)
  return (
    <DocumentWorkspace
      tool="djvu-to-pdf-converter"
      file={file}
      onFile={chooseFile}
      accept=".djvu,.djv,image/vnd.djvu"
      active={Boolean(result && !previewFailed)}
      messages={job?.status === "working" ? { ...m, clear: m.cancel } : m}
      renderEmpty={(open) => (
        <Empty className="min-h-60 bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ScanText aria-hidden="true" />
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
      {job?.status === "error" ? (
        <Alert variant="destructive" className="rounded-none border-0">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{job.message}</AlertDescription>
        </Alert>
      ) : null}
      {job?.status === "working" ? (
        <p
          role="status"
          className="flex min-h-28 items-center justify-center gap-2 p-4 text-sm"
        >
          <Spinner className="shrink-0" />
          {job.message}
        </p>
      ) : null}
      {result && file ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b p-2">
            <div role="status" className="text-sm text-muted-foreground">
              <p>
                {m.ready
                  .replace("{searchable}", number.format(result.searchable))
                  .replace("{total}", number.format(result.total))}
              </p>
              {result.searchable < result.total ? (
                <a
                  href={`${lang === "en" ? "" : "/" + lang}/tools/pdf-ocr/`}
                  className="underline underline-offset-4"
                >
                  {m.addText}
                </a>
              ) : null}
            </div>
            <DocumentDownload
              file={result.pdf}
              filename={file.name.replace(extension, ".pdf")}
              label={m.download}
            />
          </div>
          {previewFailed ? (
            <p role="status" className="p-4 text-sm">
              {m.previewError}
            </p>
          ) : null}
          {reader && state.total && !previewFailed ? (
            <DocumentToolbar messages={m} state={state} reader={reader} />
          ) : null}
          <div
            className={
              previewFailed
                ? "hidden"
                : "relative min-h-32 min-w-0 flex-1 bg-muted"
            }
          >
            <div
              ref={container}
              className="pdf-reader-container absolute inset-0 overflow-auto"
              dir="ltr"
              // The scrollable PDF preview supports keyboard scrolling.
              // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex={0}
              role="region"
              aria-label={m.reader}
              aria-busy={!reader}
            >
              <div className="pdfViewer" />
            </div>
          </div>
        </>
      ) : null}
    </DocumentWorkspace>
  )
}
