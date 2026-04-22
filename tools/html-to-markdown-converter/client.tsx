import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, FileText, RefreshCcw, Sparkles } from "@workspace/ui/icons"

import { DEFAULT_UI_STATE, STORAGE_KEYS } from "./client/constants"
import { FormatOptionsPanel } from "./components/format-options-panel"
import { HighlightedMarkdown } from "./components/highlighted-markdown"
import {
  convertHtmlToMarkdown,
  isBulletListMarker,
  isCodeBlockStyle,
  isHeadingStyle,
  type BulletListMarker,
  type CodeBlockStyle,
  type HeadingStyle,
} from "./core/html-to-markdown"

export type HtmlToMarkdownMessages = Readonly<{
  toolbarLabel: string
  importFromFileLabel: string
  useSampleLabel: string
  clearLabel: string
  inputLabel: string
  inputDescription: string
  inputPlaceholder: string
  optionsTitle: string
  optionsDescription: string
  headingStyleLabel: string
  headingStyleAtxLabel: string
  headingStyleSetextLabel: string
  bulletStyleLabel: string
  bulletStyleDashLabel: string
  bulletStyleAsteriskLabel: string
  bulletStylePlusLabel: string
  codeBlockStyleLabel: string
  codeBlockStyleFencedLabel: string
  codeBlockStyleIndentedLabel: string
  outputLabel: string
  outputDescription: string
  outputEmptyDescription: string
  copyMarkdownLabel: string
  downloadMarkdownLabel: string
  copiedLabel: string
  conversionErrorTitle: string
}>

type HtmlToMarkdownConverterClientProps = Readonly<{
  messages: HtmlToMarkdownMessages
}>

function HtmlToMarkdownConverterClient({
  messages,
}: HtmlToMarkdownConverterClientProps) {
  const htmlTextId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [htmlText, setHtmlText] = useState(DEFAULT_UI_STATE.htmlText)
  const [headingStyle, setHeadingStyle] = useState<HeadingStyle>(
    DEFAULT_UI_STATE.headingStyle
  )
  const [bulletListMarker, setBulletListMarker] = useState<BulletListMarker>(
    DEFAULT_UI_STATE.bulletListMarker
  )
  const [codeBlockStyle, setCodeBlockStyle] = useState<CodeBlockStyle>(
    DEFAULT_UI_STATE.codeBlockStyle
  )
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredHtmlText = useDeferredValue(htmlText)
  const result = convertHtmlToMarkdown(deferredHtmlText, {
    headingStyle,
    bulletListMarker,
    codeBlockStyle,
  })
  const markdownOutputState =
    result.state === "converted"
      ? "success"
      : result.state === "error"
        ? "error"
        : "empty"

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedHtmlText = window.localStorage.getItem(STORAGE_KEYS.htmlText)
    const storedHeadingStyle = window.localStorage.getItem(
      STORAGE_KEYS.headingStyle
    )
    const storedBulletListMarker = window.localStorage.getItem(
      STORAGE_KEYS.bulletListMarker
    )
    const storedCodeBlockStyle = window.localStorage.getItem(
      STORAGE_KEYS.codeBlockStyle
    )

    if (storedHtmlText !== null) {
      setHtmlText(storedHtmlText)
    }

    if (storedHeadingStyle && isHeadingStyle(storedHeadingStyle)) {
      setHeadingStyle(storedHeadingStyle)
    }

    if (storedBulletListMarker && isBulletListMarker(storedBulletListMarker)) {
      setBulletListMarker(storedBulletListMarker)
    }

    if (storedCodeBlockStyle && isCodeBlockStyle(storedCodeBlockStyle)) {
      setCodeBlockStyle(storedCodeBlockStyle)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.htmlText, htmlText)
    window.localStorage.setItem(STORAGE_KEYS.headingStyle, headingStyle)
    window.localStorage.setItem(STORAGE_KEYS.bulletListMarker, bulletListMarker)
    window.localStorage.setItem(STORAGE_KEYS.codeBlockStyle, codeBlockStyle)
  }, [bulletListMarker, codeBlockStyle, headingStyle, htmlText])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (result.state !== "converted") {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([result.markdown], {
        type: "text/markdown;charset=utf-8",
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
  }, [result.markdown, result.state])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const nextText = await file.text()

    startTransition(() => {
      setHtmlText(nextText)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <FormatOptionsPanel
        messages={messages}
        headingStyle={headingStyle}
        bulletListMarker={bulletListMarker}
        codeBlockStyle={codeBlockStyle}
        onHeadingStyleChange={setHeadingStyle}
        onBulletListMarkerChange={setBulletListMarker}
        onCodeBlockStyleChange={setCodeBlockStyle}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.inputLabel}</CardTitle>
            <CardDescription>{messages.inputDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <Textarea
              id={htmlTextId}
              aria-label={messages.inputLabel}
              spellCheck={false}
              value={htmlText}
              onChange={(event) => {
                setHtmlText(event.target.value)
              }}
              placeholder={messages.inputPlaceholder}
              className="min-h-96 flex-1 resize-y font-mono text-sm"
            />
          </CardContent>
          <CardFooter
            className="flex-wrap justify-start gap-3 border-t"
            aria-label={messages.toolbarLabel}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                fileInputRef.current?.click()
              }}
            >
              <FileText data-icon="inline-start" />
              {messages.importFromFileLabel}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                startTransition(() => {
                  setHtmlText(DEFAULT_UI_STATE.htmlText)
                })
              }}
            >
              <Sparkles data-icon="inline-start" />
              {messages.useSampleLabel}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                startTransition(() => {
                  setHtmlText("")
                })
              }}
            >
              <RefreshCcw data-icon="inline-start" />
              {messages.clearLabel}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm,.txt,text/html,text/plain"
              aria-label={messages.importFromFileLabel}
              className="sr-only"
              onChange={(event) => {
                void handleFileChange(event)
              }}
            />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.outputLabel}</CardTitle>
            <CardDescription>{messages.outputDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <HighlightedMarkdown
              ariaLabel={messages.outputLabel}
              emptyDescription={messages.outputEmptyDescription}
              errorTitle={messages.conversionErrorTitle}
              errorDescription={result.state === "error" ? result.message : ""}
              state={markdownOutputState}
              value={result.state === "converted" ? result.markdown : ""}
            />
          </CardContent>
          <CardFooter className="justify-end gap-3 border-t">
            <ToolCopyButton
              value={result.state === "converted" ? result.markdown : ""}
              copyLabel={messages.copyMarkdownLabel}
              copiedLabel={messages.copiedLabel}
              disabled={result.state !== "converted"}
            />

            {downloadUrl ? (
              <Button asChild size="sm">
                <a href={downloadUrl} download="converted.md">
                  <Download data-icon="inline-start" />
                  {messages.downloadMarkdownLabel}
                </a>
              </Button>
            ) : (
              <Button type="button" size="sm" disabled>
                <Download data-icon="inline-start" />
                {messages.downloadMarkdownLabel}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default HtmlToMarkdownConverterClient
