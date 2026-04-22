import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import { DEFAULT_SAMPLE_MARKDOWN, STORAGE_KEYS } from "./client/constants"
import type { MarkdownToHtmlMessages } from "./client/types"
import { HtmlOutputCard } from "./components/html-output-card"
import { MarkdownInputCard } from "./components/markdown-input-card"
import { PreviewCard } from "./components/preview-card"
import {
  buildPreviewDocument,
  getTextMetrics,
  renderMarkdownToHtml,
} from "./core/markdown"

type MarkdownToHtmlConverterClientProps = Readonly<{
  messages: MarkdownToHtmlMessages
}>

function MarkdownToHtmlConverterClient({
  messages,
}: MarkdownToHtmlConverterClientProps) {
  const textareaId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [markdown, setMarkdown] = useState("")
  const [sanitize, setSanitize] = useState(true)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredMarkdown = useDeferredValue(markdown)
  const html = renderMarkdownToHtml(deferredMarkdown, { sanitize })
  const previewDocument = buildPreviewDocument(html, messages.meta.name)
  const inputMetrics = getTextMetrics(markdown)
  const outputMetrics = getTextMetrics(html)

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

    const printWindow = window.open("", "_blank", "noopener,noreferrer")

    if (!printWindow) {
      return
    }

    printWindow.document.open()
    printWindow.document.write(previewDocument)
    printWindow.document.close()
    printWindow.focus()
    printWindow.onafterprint = () => {
      printWindow.close()
    }
    printWindow.addEventListener("load", () => {
      printWindow.print()
    })
  }

  function handleLoadSample() {
    startTransition(() => {
      setMarkdown(DEFAULT_SAMPLE_MARKDOWN)
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
        />
      </div>

      <PreviewCard
        messages={messages}
        html={html}
        previewDocument={previewDocument}
        sanitize={sanitize}
        onSanitizeChange={setSanitize}
        onPrint={handlePrint}
      />
    </div>
  )
}

export default MarkdownToHtmlConverterClient
