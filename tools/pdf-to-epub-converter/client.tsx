import { useEffect, useRef, useState } from "react"
import { defaultLanguage } from "@workspace/ocr-models/languages"
import { DocumentHtmlResult } from "@workspace/ui/components/tool/document-html-result"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { OcrLanguagePicker } from "@workspace/ui/components/tool/ocr-language-picker"
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
import { BookOpen, Folder } from "@workspace/ui/icons"
import type { convertPdf } from "./convert"
import { pdfExtension, type Messages, type Progress } from "./types"

type Job =
  | { status: "working"; progress: Progress }
  | { status: "error"; message: string }
  | { status: "ready"; result: Awaited<ReturnType<typeof convertPdf>> }

function validPdf(file: File) {
  return (
    file.size > 0 &&
    (file.type === "application/pdf" || pdfExtension.test(file.name))
  )
}

export default function Client({
  lang,
  messages: m,
}: {
  lang: string
  messages: Messages
}) {
  const [file, setFile] = useState<File | null>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [language, setLanguage] = useState(() => defaultLanguage(lang))
  const [includeEnglish, setIncludeEnglish] = useState(false)
  const active = useRef<AbortController | null>(null)
  const startButton = useRef<HTMLButtonElement>(null)
  const busy = job?.status === "working"
  const format = new Intl.NumberFormat(lang).format

  function stop() {
    const controller = active.current
    active.current = null
    controller?.abort()
  }

  useEffect(() => stop, [])

  function choose(next: File | null) {
    stop()
    setFile(next)
    setJob(
      next && !validPdf(next) ? { status: "error", message: m.invalid } : null
    )
  }

  async function start() {
    if (!file || !validPdf(file) || active.current) return
    const controller = new AbortController()
    active.current = controller
    setJob({ status: "working", progress: { stage: "opening" } })
    try {
      const { convertPdf } = await import("./convert")
      const result = await convertPdf(file, {
        signal: controller.signal,
        language,
        includeEnglish,
        lang,
        messages: m,
        onProgress: (progress) => {
          if (active.current === controller)
            setJob({ status: "working", progress })
        },
      })
      if (active.current === controller) setJob({ status: "ready", result })
    } catch (error) {
      if (active.current === controller) {
        const name = error instanceof Error ? error.name : ""
        const message =
          name === "PasswordException"
            ? m.protected
            : name === "InvalidPDFException"
              ? m.invalid
              : m.processingError
        setJob({ status: "error", message })
      }
    } finally {
      if (active.current === controller) active.current = null
    }
  }

  function cancel() {
    stop()
    setJob(null)
    startButton.current?.focus()
  }

  const progress = busy ? job.progress : null
  const status =
    progress &&
    ("page" in progress
      ? m[progress.stage]
          .replace("{page}", format(progress.page))
          .replace("{total}", format(progress.total))
      : m[progress.stage])

  return (
    <DocumentWorkspace
      tool="pdf-to-epub-converter"
      file={file}
      onFile={choose}
      accept=".pdf,application/pdf"
      active={job?.status === "ready"}
      messages={m}
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
      {file && validPdf(file) ? (
        <div className="shrink-0 space-y-3 border-b p-3 sm:p-4">
          <div className="flex flex-wrap items-end gap-3">
            <OcrLanguagePicker
              lang={lang}
              language={language}
              disabled={busy}
              messages={m}
              onChange={setLanguage}
            />
            {language !== "eng" ? (
              <label className="flex min-h-8 cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 shrink-0 accent-primary"
                  disabled={busy}
                  checked={includeEnglish}
                  onChange={(event) => setIncludeEnglish(event.target.checked)}
                />
                {m.includeEnglish}
              </label>
            ) : null}
            <Button
              ref={startButton}
              className="min-h-10 whitespace-normal"
              aria-disabled={busy || undefined}
              variant={busy || job?.status === "ready" ? "outline" : "default"}
              onClick={() => void start()}
            >
              {m.start}
            </Button>
            {busy ? (
              <Button variant="outline" className="min-h-10" onClick={cancel}>
                {m.cancel}
              </Button>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">{m.ocrHint}</p>
        </div>
      ) : null}
      {progress && status ? (
        <div className="space-y-2 p-4">
          <p role="status" className="text-sm">
            {status}
          </p>
          <progress
            aria-label={status}
            value={
              "page" in progress
                ? (progress.page - 1 + progress.fraction) / progress.total
                : undefined
            }
            max={1}
            className="h-2 w-full accent-primary"
          />
        </div>
      ) : null}
      {job?.status === "error" ? (
        <Alert variant="destructive" className="rounded-none border-0">
          <AlertTitle>{m.error}</AlertTitle>
          <AlertDescription>{job.message}</AlertDescription>
        </Alert>
      ) : null}
      {file && job?.status === "ready" ? (
        <DocumentHtmlResult
          html={job.result.preview.html}
          title={job.result.preview.title}
          file={job.result.file}
          filename={file.name.replace(pdfExtension, "") + ".epub"}
          messages={m}
          notes={
            <div className="shrink-0 space-y-2 border-b px-3 py-2 text-sm">
              {job.result.imagePages > 0 ? (
                <p role="status">
                  {m.imagePages.replace(
                    "{count}",
                    format(job.result.imagePages)
                  )}
                </p>
              ) : null}
              <details>
                <summary className="cursor-pointer font-medium">
                  {m.notes}
                </summary>
                <p className="pt-2 text-muted-foreground">{m.layoutNotice}</p>
              </details>
            </div>
          }
        />
      ) : null}
    </DocumentWorkspace>
  )
}
