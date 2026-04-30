import DOMPurify from "dompurify"
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import {
  DEFAULT_MARKDOWN,
  DEFAULT_PREVIEW_THEME,
  IMPORT_ACCEPT,
  STORAGE_KEYS,
} from "./constants"
import {
  buildMarkdownPreview,
  createExportHtmlDocument,
  slugifyHeading,
} from "./core/markdown-preview"
import type { PreviewTheme } from "./core/preview-options"
import { EditorCard } from "./components/editor-card"
import { PreviewCard } from "./components/preview-card"

import type { MarkdownPreviewerMessages, PreviewBadge } from "./types"

type MarkdownPreviewerClientProps = Readonly<{
  messages: MarkdownPreviewerMessages
  language: string
  direction: "ltr" | "rtl"
}>

function normalizePreviewTheme(value: string | null): PreviewTheme {
  return value === "slate" ? "slate" : DEFAULT_PREVIEW_THEME
}

function normalizeBoolean(value: string | null, fallback: boolean) {
  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  return fallback
}

function sanitizePreviewHtml(html: string) {
  if (typeof window === "undefined") {
    return html
  }

  return DOMPurify(window).sanitize(html)
}

function MarkdownPreviewerClient({
  messages,
  language,
  direction,
}: MarkdownPreviewerClientProps) {
  const textareaId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>(
    DEFAULT_PREVIEW_THEME
  )
  const [sanitizeHtml, setSanitizeHtml] = useState(true)
  const [showOutline, setShowOutline] = useState(true)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredMarkdown = useDeferredValue(markdown)
  const preview = buildMarkdownPreview(
    deferredMarkdown,
    messages.untitledHeadingLabel
  )
  const renderedHtml = sanitizeHtml
    ? sanitizePreviewHtml(preview.html)
    : preview.html
  const exportHtml = createExportHtmlDocument({
    title: preview.documentTitle || messages.meta.name,
    html: renderedHtml,
    theme: previewTheme,
    language,
    direction,
  })
  const hasMarkdown = markdown.trim().length > 0
  const downloadFileName = `${slugifyHeading(preview.documentTitle)}.html`

  const badges: readonly PreviewBadge[] = [
    {
      key: "words",
      label: messages.wordsLabel,
      value: preview.stats.words,
    },
    {
      key: "headings",
      label: messages.headingsLabel,
      value: preview.stats.headings,
    },
    {
      key: "links",
      label: messages.linksLabel,
      value: preview.stats.links,
    },
    {
      key: "images",
      label: messages.imagesLabel,
      value: preview.stats.images,
    },
    {
      key: "readTimeMinutes",
      label: messages.readTimeLabel,
      value: preview.stats.readTimeMinutes,
    },
  ]

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedMarkdown = window.localStorage.getItem(STORAGE_KEYS.markdown)
    const storedPreviewTheme = window.localStorage.getItem(
      STORAGE_KEYS.previewTheme
    )
    const storedSanitizeHtml = window.localStorage.getItem(
      STORAGE_KEYS.sanitizeHtml
    )
    const storedShowOutline = window.localStorage.getItem(
      STORAGE_KEYS.showOutline
    )

    if (storedMarkdown !== null) {
      setMarkdown(storedMarkdown)
    }

    setPreviewTheme(normalizePreviewTheme(storedPreviewTheme))
    setSanitizeHtml(normalizeBoolean(storedSanitizeHtml, true))
    setShowOutline(normalizeBoolean(storedShowOutline, true))
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.markdown, markdown)
  }, [markdown])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.previewTheme, previewTheme)
  }, [previewTheme])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.sanitizeHtml, String(sanitizeHtml))
  }, [sanitizeHtml])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.showOutline, String(showOutline))
  }, [showOutline])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (!hasMarkdown) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([exportHtml], {
        type: "text/html;charset=utf-8",
      })
    )

    downloadUrlRef.current = nextUrl
    setDownloadUrl(nextUrl)

    return () => {
      if (downloadUrlRef.current === nextUrl) {
        URL.revokeObjectURL(nextUrl)
        downloadUrlRef.current = null
      }
    }
  }, [exportHtml, hasMarkdown])

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

  function openImportDialog() {
    fileInputRef.current?.click()
  }

  function handleLoadSample() {
    if (markdown !== DEFAULT_MARKDOWN) {
      const shouldReplace = window.confirm(messages.loadSampleConfirmMessage)

      if (!shouldReplace) {
        return
      }
    }

    startTransition(() => {
      setMarkdown(DEFAULT_MARKDOWN)
    })
  }

  function handleClear() {
    if (!hasMarkdown) {
      return
    }

    const shouldClear = window.confirm(messages.clearConfirmMessage)

    if (!shouldClear) {
      return
    }

    startTransition(() => {
      setMarkdown("")
    })
  }

  function handlePrint() {
    if (!hasMarkdown) {
      return
    }

    const printWindow = window.open("", "_blank")

    if (!printWindow) {
      return
    }

    printWindow.document.open()
    printWindow.document.write(exportHtml)
    printWindow.document.close()
    printWindow.focus()
    printWindow.onafterprint = () => {
      printWindow.close()
    }
    printWindow.addEventListener("load", () => {
      printWindow.print()
    })
  }

  return (
    <div className="grid gap-6">
      <EditorCard
        messages={messages}
        markdown={markdown}
        textareaId={textareaId}
        onMarkdownChange={setMarkdown}
        onImportClick={openImportDialog}
        onLoadSample={handleLoadSample}
        onClear={handleClear}
      />

      <PreviewCard
        messages={messages}
        hasMarkdown={hasMarkdown}
        previewTheme={previewTheme}
        sanitizeHtml={sanitizeHtml}
        showOutline={showOutline}
        renderedHtml={renderedHtml}
        exportHtml={exportHtml}
        badges={badges}
        tocItems={preview.toc}
        downloadUrl={downloadUrl}
        downloadFileName={downloadFileName}
        onPreviewThemeChange={setPreviewTheme}
        onSanitizeHtmlChange={setSanitizeHtml}
        onShowOutlineChange={setShowOutline}
        onPrint={handlePrint}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept={IMPORT_ACCEPT}
        aria-label={messages.importLabel}
        className="sr-only"
        onChange={(event) => {
          void handleFileChange(event)
        }}
      />
    </div>
  )
}

export default MarkdownPreviewerClient
