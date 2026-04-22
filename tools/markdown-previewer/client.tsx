import DOMPurify from "dompurify"
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import GitHubDarkCss from "github-markdown-css/github-markdown-dark.css?raw"
import GitHubLightCss from "github-markdown-css/github-markdown-light.css?raw"

import {
  DEFAULT_STATE,
  STORAGE_KEY,
  readStoredState,
  serializeStoredState,
} from "./client/constants"
import { InputCard } from "./components/input-card"
import { OutputCard } from "./components/output-card"
import { PreviewControlsCard } from "./components/preview-controls-card"
import {
  buildExportDocument,
  buildMarkdownPreview,
} from "./core/markdown-preview"
import type { MarkdownPreviewerMessages, OutputMode, ThemeMode } from "./types"

type MarkdownPreviewerClientProps = Readonly<{
  messages: MarkdownPreviewerMessages
}>

function MarkdownPreviewerClient({ messages }: MarkdownPreviewerClientProps) {
  const markdownId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [markdown, setMarkdown] = useState<string>(DEFAULT_STATE.markdown)
  const [outputMode, setOutputMode] = useState<OutputMode>(
    DEFAULT_STATE.outputMode
  )
  const [sanitize, setSanitize] = useState<boolean>(DEFAULT_STATE.sanitize)
  const [showToc, setShowToc] = useState<boolean>(DEFAULT_STATE.showToc)
  const [theme, setTheme] = useState<ThemeMode>(DEFAULT_STATE.theme)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredMarkdown = useDeferredValue(markdown)
  const preview = useMemo(
    () => buildMarkdownPreview(deferredMarkdown, messages.untitledHeading),
    [deferredMarkdown, messages.untitledHeading]
  )
  const renderedHtml = useMemo(() => {
    if (!sanitize || typeof window === "undefined") {
      return preview.html
    }

    return DOMPurify.sanitize(preview.html, {
      USE_PROFILES: { html: true },
    })
  }, [preview.html, sanitize])
  const markdownThemeCss = theme === "dark" ? GitHubDarkCss : GitHubLightCss
  const scopedCss = useMemo(
    () =>
      markdownThemeCss.replaceAll(
        ".markdown-body",
        ".markdown-previewer-surface .markdown-body"
      ),
    [markdownThemeCss]
  )
  const exportedDocument = useMemo(
    () => buildExportDocument(renderedHtml, markdownThemeCss),
    [markdownThemeCss, renderedHtml]
  )
  const hasMarkdown = markdown.trim().length > 0

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedState = readStoredState(
      window.localStorage.getItem(STORAGE_KEY)
    )

    if (!storedState) {
      return
    }

    setMarkdown(storedState.markdown)
    setOutputMode(storedState.outputMode)
    setSanitize(storedState.sanitize)
    setShowToc(storedState.showToc)
    setTheme(storedState.theme)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      serializeStoredState({
        markdown,
        outputMode,
        sanitize,
        showToc,
        theme,
      })
    )
  }, [markdown, outputMode, sanitize, showToc, theme])

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
      new Blob([exportedDocument], {
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
  }, [exportedDocument, hasMarkdown])

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
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
    if (!hasMarkdown) {
      return
    }

    const printWindow = window.open("", "_blank")

    if (!printWindow) {
      return
    }

    printWindow.document.open()
    printWindow.document.write(exportedDocument)
    printWindow.document.close()
    printWindow.focus()
    printWindow.addEventListener(
      "afterprint",
      () => {
        printWindow.close()
      },
      { once: true }
    )
    window.setTimeout(() => {
      printWindow.print()
    }, 0)
  }

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.02fr)_minmax(0,1.18fr)]">
      <InputCard
        fileInputRef={fileInputRef}
        markdown={markdown}
        markdownId={markdownId}
        messages={messages}
        onClear={() => {
          startTransition(() => {
            setMarkdown("")
          })
        }}
        onImport={(event) => {
          void handleImport(event)
        }}
        onMarkdownChange={setMarkdown}
        onUseSample={() => {
          startTransition(() => {
            setMarkdown(DEFAULT_STATE.markdown)
          })
        }}
      />

      <div className="flex min-h-0 flex-col gap-6">
        <PreviewControlsCard
          messages={messages}
          onOutputModeChange={setOutputMode}
          onSanitizeChange={setSanitize}
          onShowTocChange={setShowToc}
          onThemeChange={setTheme}
          outputMode={outputMode}
          sanitize={sanitize}
          showToc={showToc}
          theme={theme}
        />

        <OutputCard
          downloadUrl={downloadUrl}
          exportedDocument={exportedDocument}
          hasMarkdown={hasMarkdown}
          messages={messages}
          onPrint={handlePrint}
          outputMode={outputMode}
          renderedHtml={renderedHtml}
          scopedCss={scopedCss}
          showToc={showToc}
          toc={preview.toc}
        />
      </div>
    </div>
  )
}

export default MarkdownPreviewerClient
