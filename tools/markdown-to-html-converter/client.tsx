import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import { STORAGE_KEYS } from "./client/constants"
import type { MarkdownToHtmlMessages, MetricLabels } from "./client/types"
import { HtmlOutputCard } from "./components/html-output-card"
import { MarkdownInputCard } from "./components/markdown-input-card"
import { PreviewCard } from "./components/preview-card"
import {
  buildPreviewDocument,
  getTextMetrics,
  renderMarkdownToHtml,
} from "./core/markdown"
import type { TextMetrics } from "./core/markdown"

type MarkdownToHtmlConverterClientProps = Readonly<{
  lang: string
  messages: MarkdownToHtmlMessages
}>

function MarkdownToHtmlConverterClient({
  lang,
  messages,
}: MarkdownToHtmlConverterClientProps) {
  const textareaId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const printFrameRef = useRef<HTMLIFrameElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [markdown, setMarkdown] = useState("")
  const [sanitize, setSanitize] = useState(true)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredMarkdown = useDeferredValue(markdown)
  const html = renderMarkdownToHtml(deferredMarkdown, { sanitize })
  const previewDocument = buildPreviewDocument(html, messages.meta.name, {
    dir: getTextDirection(lang),
    lang,
  })
  const inputMetrics = formatMetrics(getTextMetrics(markdown), lang)
  const outputMetrics = formatMetrics(getTextMetrics(html), lang)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedMarkdown = window.localStorage.getItem(STORAGE_KEYS.markdown)
    const storedSanitize = window.localStorage.getItem(STORAGE_KEYS.sanitize)

    if (storedMarkdown !== null) {
      setMarkdown(storedMarkdown)
    }

    if (storedSanitize !== null) {
      setSanitize(storedSanitize === "true")
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.markdown, markdown)
  }, [markdown])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.sanitize, String(sanitize))
  }, [sanitize])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (html.length === 0) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([html], { type: "text/html;charset=utf-8" })
    )

    downloadUrlRef.current = nextUrl
    setDownloadUrl(nextUrl)

    return () => {
      if (downloadUrlRef.current === nextUrl) {
        URL.revokeObjectURL(nextUrl)
        downloadUrlRef.current = null
      }
    }
  }, [html])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const nextMarkdown = await file.text()

    startTransition(() => {
      setMarkdown(nextMarkdown)
    })
  }

  function handlePrint() {
    if (html.length === 0) {
      return
    }

    const printWindow = printFrameRef.current?.contentWindow

    if (!printWindow) {
      return
    }

    printWindow.focus()
    printWindow.print()
  }

  function handleLoadSample() {
    startTransition(() => {
      setMarkdown(messages.sampleMarkdown)
    })
  }

  function handleReset() {
    setMarkdown("")
    setSanitize(true)
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2 xl:items-stretch">
        <MarkdownInputCard
          messages={messages}
          markdown={markdown}
          metrics={inputMetrics}
          textareaId={textareaId}
          fileInputRef={fileInputRef}
          onMarkdownChange={setMarkdown}
          onFileChange={(event) => {
            void handleFileChange(event)
          }}
          onLoadSample={handleLoadSample}
          onReset={handleReset}
        />

        <HtmlOutputCard
          messages={messages}
          html={html}
          metrics={outputMetrics}
          downloadUrl={downloadUrl}
          sanitize={sanitize}
          onSanitizeChange={setSanitize}
        />
      </div>

      <PreviewCard
        messages={messages}
        html={html}
        previewDocument={previewDocument}
        onPrint={handlePrint}
      />

      <iframe
        ref={printFrameRef}
        title={messages.printHtmlLabel}
        sandbox="allow-modals allow-same-origin"
        srcDoc={previewDocument}
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none fixed top-0 left-[-100vw] h-px w-px opacity-0"
      />
    </div>
  )
}

function formatMetrics(metrics: TextMetrics, lang: string): MetricLabels {
  const formatter = new Intl.NumberFormat(lang)

  return {
    characters: formatter.format(metrics.characters),
    lines: formatter.format(metrics.lines),
    nonEmptyLines: formatter.format(metrics.nonEmptyLines),
  }
}

function getTextDirection(lang: string) {
  return ["ar", "he"].includes(lang.split("-")[0] ?? "") ? "rtl" : "ltr"
}

export default MarkdownToHtmlConverterClient
