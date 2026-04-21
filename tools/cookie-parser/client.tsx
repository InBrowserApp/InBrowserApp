import { useEffect, useRef, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertTitle } from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Download, RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import { ReadOnlyOutput } from "./components/read-only-output"
import {
  formatParsedCookieData,
  getDownloadFileName,
  parseCookieData,
  type HeaderType,
} from "./core/cookie"

type CookieParserMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  headerTypeLabel: string
  cookieHeaderLabel: string
  setCookieHeaderLabel: string
  inputLabel: string
  inputPlaceholder: string
  parsedJsonLabel: string
  emptyOutputDescription: string
  cookieCountLabel: string
  invalidCountLabel: string
  invalidFragmentsLabel: string
  noCookiesTitle: string
  copyResultLabel: string
  copiedLabel: string
  downloadJsonLabel: string
  resetLabel: string
}>

type CookieParserClientProps = Readonly<{
  messages: CookieParserMessages
}>

const HEADER_TYPE_STORAGE_KEY = "tools:cookie-parser:type"
const HEADER_INPUT_STORAGE_KEY = "tools:cookie-parser:input"
const DEFAULT_HEADER_TYPE = "cookie" satisfies HeaderType

const DEFAULT_INPUT_BY_TYPE = {
  cookie: "Cookie: session=abc123; theme=light; logged_in=true",
  "set-cookie":
    "Set-Cookie: session=abc123; Path=/; HttpOnly; SameSite=Lax\n" +
    "Set-Cookie: theme=dark; Max-Age=86400; Secure",
} as const satisfies Record<HeaderType, string>

function isHeaderType(value: string): value is HeaderType {
  return value === "cookie" || value === "set-cookie"
}

function getDefaultInput(type: HeaderType): string {
  return DEFAULT_INPUT_BY_TYPE[type]
}

function CookieParserClient({ messages }: CookieParserClientProps) {
  const downloadUrlRef = useRef<string | null>(null)

  const [headerType, setHeaderType] = useState<HeaderType>(DEFAULT_HEADER_TYPE)
  const [headerInput, setHeaderInput] = useState(
    getDefaultInput(DEFAULT_HEADER_TYPE)
  )
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedHeaderType =
      window.localStorage.getItem(HEADER_TYPE_STORAGE_KEY) ?? ""
    const nextHeaderType: HeaderType = isHeaderType(storedHeaderType)
      ? storedHeaderType
      : DEFAULT_HEADER_TYPE
    const storedHeaderInput = window.localStorage.getItem(
      HEADER_INPUT_STORAGE_KEY
    )

    setHeaderType(nextHeaderType)
    setHeaderInput(storedHeaderInput ?? getDefaultInput(nextHeaderType))
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(HEADER_TYPE_STORAGE_KEY, headerType)
  }, [headerType])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(HEADER_INPUT_STORAGE_KEY, headerInput)
  }, [headerInput])

  const hasInput = headerInput.trim() !== ""
  const parsedResult = parseCookieData(headerType, headerInput)
  const outputText = hasInput ? formatParsedCookieData(parsedResult) : ""
  const hasCookies = parsedResult.cookies.length > 0

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (!outputText) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([outputText], {
        type: "application/json;charset=utf-8",
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
  }, [outputText])

  function handleHeaderTypeChange(nextValue: string) {
    if (!isHeaderType(nextValue)) {
      return
    }

    const shouldSwapExample =
      headerInput.trim() === "" || headerInput === getDefaultInput(headerType)

    setHeaderType(nextValue)

    if (shouldSwapExample) {
      setHeaderInput(getDefaultInput(nextValue))
    }
  }

  function handleReset() {
    setHeaderInput(getDefaultInput(headerType))
  }

  return (
    <div className="grid gap-6">
      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.headerTypeLabel}</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <ToggleGroup
            type="single"
            value={headerType}
            onValueChange={handleHeaderTypeChange}
            variant="outline"
            aria-label={messages.headerTypeLabel}
            className="flex w-full flex-wrap"
          >
            <ToggleGroupItem
              value="cookie"
              className="flex-1 sm:flex-none"
              aria-label={messages.cookieHeaderLabel}
            >
              {messages.cookieHeaderLabel}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="set-cookie"
              className="flex-1 sm:flex-none"
              aria-label={messages.setCookieHeaderLabel}
            >
              {messages.setCookieHeaderLabel}
            </ToggleGroupItem>
          </ToggleGroup>
        </ToolPanelCardContent>
      </ToolPanelCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
        <ToolPanelCard>
          <CardHeader className="border-b">
            <CardTitle>{messages.inputLabel}</CardTitle>
            <CardDescription>{messages.inputPlaceholder}</CardDescription>
          </CardHeader>
          <ToolPanelCardContent className="gap-4">
            <Textarea
              name="cookie-header-input"
              rows={10}
              autoComplete="off"
              spellCheck={false}
              aria-label={messages.inputLabel}
              value={headerInput}
              onChange={(event) => {
                setHeaderInput(event.target.value)
              }}
              placeholder={messages.inputPlaceholder}
              className="min-h-72 resize-y font-mono text-sm"
            />
          </ToolPanelCardContent>
          <ToolPanelCardFooter className="justify-end border-t">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              <RefreshCcw data-icon="inline-start" />
              {messages.resetLabel}
            </Button>
          </ToolPanelCardFooter>
        </ToolPanelCard>

        <ToolPanelCard>
          <CardHeader className="border-b">
            <CardTitle>{messages.parsedJsonLabel}</CardTitle>
            <CardDescription>{messages.meta.description}</CardDescription>
          </CardHeader>
          <ToolPanelCardContent className="gap-4">
            {hasInput ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {messages.cookieCountLabel}: {parsedResult.cookies.length}
                  </Badge>
                  <Badge
                    variant={
                      parsedResult.invalid.length > 0
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {messages.invalidCountLabel}: {parsedResult.invalid.length}
                  </Badge>
                </div>

                {!hasCookies ? (
                  <div aria-live="polite">
                    <Alert variant="destructive">
                      <TriangleAlert />
                      <AlertTitle>{messages.noCookiesTitle}</AlertTitle>
                    </Alert>
                  </div>
                ) : null}

                <ReadOnlyOutput
                  ariaLabel={messages.parsedJsonLabel}
                  value={outputText}
                  className="max-h-[min(32rem,60vh)] min-h-72 overflow-auto"
                />

                {parsedResult.invalid.length > 0 ? (
                  <div className="grid gap-3 rounded-lg border border-dashed px-4 py-3">
                    <div className="text-sm font-medium">
                      {messages.invalidFragmentsLabel}
                    </div>
                    <ul className="grid gap-2">
                      {parsedResult.invalid.map((fragment, index) => (
                        <li
                          key={`${fragment}-${index}`}
                          className="rounded-md bg-muted px-3 py-2 font-mono text-sm break-all"
                        >
                          {fragment}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
                {messages.emptyOutputDescription}
              </div>
            )}
          </ToolPanelCardContent>
          <ToolPanelCardFooter className="flex flex-wrap gap-3 border-t">
            <ToolCopyButton
              value={outputText}
              copyLabel={messages.copyResultLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />

            {downloadUrl ? (
              <Button asChild type="button" variant="ghost" size="sm">
                <a
                  href={downloadUrl}
                  download={getDownloadFileName(headerType)}
                >
                  <Download data-icon="inline-start" />
                  {messages.downloadJsonLabel}
                </a>
              </Button>
            ) : (
              <Button type="button" variant="ghost" size="sm" disabled>
                <Download data-icon="inline-start" />
                {messages.downloadJsonLabel}
              </Button>
            )}
          </ToolPanelCardFooter>
        </ToolPanelCard>
      </div>
    </div>
  )
}

export default CookieParserClient
