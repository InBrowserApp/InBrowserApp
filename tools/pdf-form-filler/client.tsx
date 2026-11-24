import { useEffect, useId, useRef, useState } from "react"
import type { ReaderState } from "@workspace/pdf-reader"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Download, FilePenLine } from "@workspace/ui/icons"
import { FormNavigation } from "./form-navigation"
import type { OpenForm } from "./open-form"
import type englishMessages from "./messages/en.json"
import sampleUrl from "./sample-form.pdf?url"

export type Messages = typeof englishMessages

type View = Pick<ReaderState, "page" | "total" | "zoom">
const initialView: View = { page: 1, total: 0, zoom: 100 }
type Selection = { source: File | "sample" }
type OpenProblem = "openError" | "noFields" | "xfa" | "protected"
type OpenResult =
  | { file: File; form: OpenForm }
  | { file: File | null; problem: OpenProblem }
type ExportMode = "editable" | "flattened"
type ExportStatus = ExportMode | "downloadReady" | "saveError" | "flattenError"

const downloadButtonClass =
  "h-auto min-h-9 max-w-full py-1.5 text-start whitespace-normal aria-disabled:opacity-50"

async function loadSample(signal: AbortSignal) {
  const response = await fetch(sampleUrl, { signal })
  if (!response.ok) throw new Error("Could not load the sample PDF")
  return new File([await response.blob()], "sample-form.pdf", {
    type: "application/pdf",
  })
}

function downloadPdf(bytes: Uint8Array, filename: string) {
  const link = document.createElement("a")
  link.href = URL.createObjectURL(
    new Blob([Uint8Array.from(bytes)], { type: "application/pdf" })
  )
  link.download = filename
  link.click()
  // Give the browser time to resolve the download before releasing its URL.
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}

export default function Client({
  lang,
  messages: m,
}: {
  lang: string
  messages: Messages
}) {
  const container = useRef<HTMLDivElement>(null)
  const request = useRef<AbortController | null>(null)
  const exportInProgress = useRef<AbortSignal | null>(null)
  const hintId = useId()
  const [selection, setSelection] = useState<Selection | null>(null)
  const [result, setResult] = useState<OpenResult | null>(null)
  const [view, setView] = useState(initialView)
  const [renderError, setRenderError] = useState(false)
  const [status, setStatus] = useState<ExportStatus | null>(null)
  const source = selection?.source
  const file = source === "sample" ? (result?.file ?? null) : (source ?? null)
  const form = result && "form" in result ? result.form : null
  const problem =
    result && "problem" in result
      ? result.problem
      : renderError
        ? "renderError"
        : null
  const loading = selection !== null && result === null
  const saving = status === "editable" || status === "flattened"

  function select(source: File | "sample" | null) {
    request.current?.abort()
    setSelection(source === null ? null : { source })
    setResult(null)
    setView(initialView)
    setRenderError(false)
    setStatus(null)
  }

  useEffect(() => {
    if (!selection || !container.current) return
    const { source } = selection
    const controller = new AbortController()
    request.current = controller
    const { signal } = controller
    const element = container.current

    async function load() {
      let file = source === "sample" ? null : source
      let engine: typeof import("./open-form") | undefined
      try {
        engine = await import("./open-form")
        signal.throwIfAborted()
        file ??= await loadSample(signal)
        signal.throwIfAborted()
        const form = await engine.openForm(
          file,
          element,
          signal,
          ({ page, total, zoom }) => {
            if (signal.aborted) return
            setView((current) => ({
              page: page ?? current.page,
              total: total ?? current.total,
              zoom: zoom ?? current.zoom,
            }))
            if (page !== undefined) setRenderError(false)
          },
          () => setRenderError(true)
        )
        if (!signal.aborted) setResult({ file, form })
      } catch (error) {
        if (!signal.aborted) {
          const problem =
            engine && error instanceof engine.FormOpenError
              ? error.problem
              : "openError"
          setResult({ file, problem })
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [selection])

  async function save(mode: ExportMode) {
    const signal = request.current?.signal
    if (
      !file ||
      !form ||
      !signal ||
      signal.aborted ||
      exportInProgress.current === signal
    )
      return
    exportInProgress.current = signal
    setStatus(mode)
    try {
      const { pdf } = form
      let bytes = await (pdf.annotationStorage.size
        ? pdf.saveDocument()
        : pdf.getData())
      if (mode === "flattened") {
        const { flattenForm } = await import("./flatten-form")
        signal.throwIfAborted()
        bytes = await flattenForm(bytes, pdf, signal)
      }
      signal.throwIfAborted()
      const suffix = mode === "editable" ? "filled" : "flattened"
      downloadPdf(bytes, `${file.name.replace(/\.pdf$/i, "")}-${suffix}.pdf`)
      setStatus("downloadReady")
    } catch {
      if (!signal.aborted)
        setStatus(mode === "editable" ? "saveError" : "flattenError")
    } finally {
      if (exportInProgress.current === signal) exportInProgress.current = null
    }
  }

  return (
    <DocumentWorkspace
      tool="pdf-form-filler"
      file={file}
      onFile={select}
      accept=".pdf,application/pdf"
      active={Boolean(form)}
      fitContent
      messages={m}
    >
      {problem && (
        <Alert
          variant={problem === "noFields" ? "default" : "destructive"}
          className="m-3 w-auto"
        >
          <AlertDescription>{m[problem]}</AlertDescription>
        </Alert>
      )}
      {!loading && !form ? (
        <Empty className="min-h-52 border-none p-6 sm:p-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FilePenLine aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={() => select("sample")}>
              {m.sample}
            </Button>
          </EmptyContent>
        </Empty>
      ) : null}
      {form ? (
        <FormNavigation
          reader={form.reader}
          {...view}
          lang={lang}
          messages={m}
        />
      ) : null}
      <div
        className={
          form
            ? "relative h-[clamp(16rem,43svh,24rem)] overflow-hidden bg-muted group-data-[focus]/workspace:h-auto group-data-[focus]/workspace:flex-1 sm:h-[clamp(16rem,52vh,36rem)]"
            : loading
              ? "relative h-52"
              : "hidden"
        }
      >
        <div
          ref={container}
          className="pdf-reader-container absolute inset-0 overflow-auto"
          dir="ltr"
          role="region"
          aria-label={m.reader}
          aria-describedby={form ? hintId : undefined}
          inert={!form || saving}
          // Keep the scrollable preview keyboard-accessible.
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          <div className="pdfViewer" />
        </div>
        {loading ? (
          <p
            role="status"
            className="absolute inset-0 flex items-center justify-center gap-2 bg-background p-6"
          >
            <Spinner aria-hidden="true" />
            {m.loading}
          </p>
        ) : null}
      </div>
      {form ? (
        <div className="shrink-0 space-y-2 border-t p-3">
          <p id={hintId} className="text-sm text-muted-foreground">
            {m.editHint}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              className={downloadButtonClass}
              aria-disabled={saving}
              onClick={() => void save("editable")}
            >
              {status === "editable" ? (
                <Spinner aria-hidden="true" />
              ) : (
                <Download aria-hidden="true" />
              )}
              {m.downloadEditable}
            </Button>
            <Button
              className={downloadButtonClass}
              variant="outline"
              aria-disabled={saving}
              onClick={() => void save("flattened")}
            >
              {status === "flattened" ? (
                <Spinner aria-hidden="true" />
              ) : (
                <Download aria-hidden="true" />
              )}
              {m.downloadFlattened}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{m.flattenHint}</p>
          <p role="status" className="text-sm empty:sr-only">
            {saving
              ? m.saving
              : status === "downloadReady"
                ? m.downloadReady
                : ""}
          </p>
          {status === "saveError" || status === "flattenError" ? (
            <Alert variant="destructive">
              <AlertDescription>{m[status]}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      ) : null}
    </DocumentWorkspace>
  )
}
