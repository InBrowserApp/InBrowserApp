import { useEffect, useId, useRef, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Label } from "@workspace/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import {
  parseCookieHeader,
  parseSetCookieHeaders,
  type ParsedCookieHeader,
  type ParsedSetCookieHeaders,
} from "./core/cookie"
import type { CookieParserMessages } from "./messages"

type HeaderType = "cookie" | "set-cookie"
type ParsedResult = ParsedCookieHeader | ParsedSetCookieHeaders

type CookieParserClientProps = Readonly<{
  messages: CookieParserMessages & {
    meta: {
      name: string
      description: string
    }
  }
}>

const STORAGE_KEYS = {
  headerType: "tools:cookie-parser:type",
  input: "tools:cookie-parser:input",
} as const

const DEFAULT_INPUTS: Record<HeaderType, string> = {
  cookie: "Cookie: session=abc123; theme=light; logged_in=true",
  "set-cookie":
    "Set-Cookie: session=abc123; Path=/; HttpOnly; Secure\n" +
    "Set-Cookie: theme=light; Path=/; Max-Age=3600",
}

function isHeaderType(value: string): value is HeaderType {
  return value === "cookie" || value === "set-cookie"
}

function parseInput(headerType: HeaderType, inputText: string): ParsedResult {
  return headerType === "cookie"
    ? parseCookieHeader(inputText)
    : parseSetCookieHeaders(inputText)
}

function CookieParserClient({ messages }: CookieParserClientProps) {
  const headerTypeId = useId()
  const downloadUrlRef = useRef<string | null>(null)

  const [headerType, setHeaderType] = useState<HeaderType>("cookie")
  const [inputText, setInputText] = useState(DEFAULT_INPUTS.cookie)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedHeaderType = window.localStorage.getItem(
      STORAGE_KEYS.headerType
    )
    const storedInput = window.localStorage.getItem(STORAGE_KEYS.input)

    if (storedHeaderType && isHeaderType(storedHeaderType)) {
      setHeaderType(storedHeaderType)
      setInputText(DEFAULT_INPUTS[storedHeaderType])
    }

    if (storedInput !== null) {
      setInputText(storedInput)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.headerType, headerType)
  }, [headerType])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.input, inputText)
  }, [inputText])

  const hasInput = inputText.trim().length > 0
  const parsed = parseInput(headerType, inputText)
  const outputText = hasInput ? JSON.stringify(parsed, null, 2) : ""
  const downloadFileName =
    headerType === "cookie" ? "cookies.json" : "set-cookie.json"
  const invalidSegments = parsed.invalid.join(", ")

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
      new Blob([outputText], { type: "application/json;charset=utf-8" })
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

    setHeaderType(nextValue)
    setInputText((currentValue) =>
      currentValue === DEFAULT_INPUTS.cookie ||
      currentValue === DEFAULT_INPUTS["set-cookie"]
        ? DEFAULT_INPUTS[nextValue]
        : currentValue
    )
  }

  function handleReset() {
    setInputText(DEFAULT_INPUTS[headerType])
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.configurationLabel}</CardTitle>
          <CardDescription>{messages.configurationDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:max-w-xs">
          <Label htmlFor={headerTypeId}>{messages.headerTypeLabel}</Label>
          <Select value={headerType} onValueChange={handleHeaderTypeChange}>
            <SelectTrigger
              id={headerTypeId}
              aria-label={messages.headerTypeLabel}
              className="w-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cookie">
                {messages.headerCookieLabel}
              </SelectItem>
              <SelectItem value="set-cookie">
                {messages.headerSetCookieLabel}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.inputLabel}</CardTitle>
            <CardDescription>{messages.inputDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={12}
              autoComplete="off"
              spellCheck={false}
              aria-label={messages.inputLabel}
              value={inputText}
              onChange={(event) => {
                setInputText(event.target.value)
              }}
              placeholder={messages.inputPlaceholder}
              className="min-h-80 resize-y font-mono text-sm"
            />
          </CardContent>
          <CardFooter className="justify-end border-t">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              <RefreshCcw data-icon="inline-start" />
              {messages.resetExampleLabel}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.outputLabel}</CardTitle>
            <CardDescription>{messages.outputDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              rows={12}
              readOnly
              spellCheck={false}
              aria-label={messages.outputLabel}
              value={outputText}
              placeholder={messages.outputPlaceholder}
              className="min-h-80 resize-y font-mono text-sm"
            />

            {hasInput && parsed.cookies.length === 0 ? (
              <Alert>
                <TriangleAlert />
                <AlertTitle>{messages.noCookiesFoundLabel}</AlertTitle>
              </Alert>
            ) : null}

            {parsed.invalid.length > 0 ? (
              <Alert>
                <TriangleAlert />
                <AlertTitle>{messages.invalidSegmentsLabel}</AlertTitle>
                <AlertDescription className="font-mono break-all">
                  {invalidSegments}
                </AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
          <CardFooter className="justify-end gap-3 border-t">
            <ToolCopyButton
              value={outputText}
              copyLabel={messages.copyOutputLabel}
              copiedLabel={messages.copiedLabel}
              disabled={!outputText}
            />

            {downloadUrl ? (
              <Button asChild size="sm">
                <a href={downloadUrl} download={downloadFileName}>
                  <Download data-icon="inline-start" />
                  {messages.downloadJsonLabel}
                </a>
              </Button>
            ) : (
              <Button type="button" size="sm" disabled>
                <Download data-icon="inline-start" />
                {messages.downloadJsonLabel}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default CookieParserClient
