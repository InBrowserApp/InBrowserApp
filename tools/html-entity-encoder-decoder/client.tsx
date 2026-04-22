import { useEffect, useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { RefreshCcw } from "@workspace/ui/icons"

import {
  decodeHtmlEntities,
  encodeHtmlEntities,
  isEncodeRange,
  isEntityFormat,
  type EncodeRange,
  type EntityFormat,
} from "./core/html-entity"
import type { HtmlEntityMessages } from "./messages"

type HtmlEntityToolClientProps = Readonly<{
  messages: HtmlEntityMessages & {
    meta: {
      name: string
      description: string
    }
  }
}>

const STORAGE_KEYS = {
  plainText: "tools:html-entity-encoder-decoder:plain-text",
  format: "tools:html-entity-encoder-decoder:format",
  range: "tools:html-entity-encoder-decoder:range",
} as const

const DEFAULT_TEXT = '<div class="hello">Hello & World</div>'
const DEFAULT_FORMAT: EntityFormat = "named"
const DEFAULT_RANGE: EncodeRange = "minimal"

function HtmlEntityEncoderDecoderClient({
  messages,
}: HtmlEntityToolClientProps) {
  const formatId = useId()
  const rangeId = useId()
  const plainTextId = useId()
  const encodedTextId = useId()

  const [format, setFormat] = useState<EntityFormat>(DEFAULT_FORMAT)
  const [range, setRange] = useState<EncodeRange>(DEFAULT_RANGE)
  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [encodedText, setEncodedText] = useState(() =>
    encodeHtmlEntities(DEFAULT_TEXT, DEFAULT_FORMAT, DEFAULT_RANGE)
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedPlainText = window.localStorage.getItem(STORAGE_KEYS.plainText)
    const storedFormat = window.localStorage.getItem(STORAGE_KEYS.format)
    const storedRange = window.localStorage.getItem(STORAGE_KEYS.range)

    const resolvedFormat = isEntityFormat(storedFormat ?? "")
      ? (storedFormat as EntityFormat)
      : DEFAULT_FORMAT
    const resolvedRange = isEncodeRange(storedRange ?? "")
      ? (storedRange as EncodeRange)
      : DEFAULT_RANGE
    const resolvedPlainText = storedPlainText ?? DEFAULT_TEXT

    setFormat(resolvedFormat)
    setRange(resolvedRange)
    setPlainText(resolvedPlainText)
    setEncodedText(
      encodeHtmlEntities(resolvedPlainText, resolvedFormat, resolvedRange)
    )
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.plainText, plainText)
  }, [plainText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.format, format)
  }, [format])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.range, range)
  }, [range])

  function handlePlainTextChange(nextValue: string) {
    setPlainText(nextValue)
    setEncodedText(encodeHtmlEntities(nextValue, format, range))
  }

  function handleEncodedTextChange(nextValue: string) {
    setEncodedText(nextValue)
    setPlainText(decodeHtmlEntities(nextValue))
  }

  function handleFormatChange(nextFormat: string) {
    if (!isEntityFormat(nextFormat)) {
      return
    }

    setFormat(nextFormat)
    setEncodedText(encodeHtmlEntities(plainText, nextFormat, range))
  }

  function handleRangeChange(nextRange: string) {
    if (!isEncodeRange(nextRange)) {
      return
    }

    setRange(nextRange)
    setEncodedText(encodeHtmlEntities(plainText, format, nextRange))
  }

  function handleReset() {
    setFormat(DEFAULT_FORMAT)
    setRange(DEFAULT_RANGE)
    setPlainText(DEFAULT_TEXT)
    setEncodedText(
      encodeHtmlEntities(DEFAULT_TEXT, DEFAULT_FORMAT, DEFAULT_RANGE)
    )
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.optionsLabel}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor={formatId} className="text-sm font-medium">
              {messages.formatLabel}
            </label>
            <Select value={format} onValueChange={handleFormatChange}>
              <SelectTrigger
                id={formatId}
                aria-label={messages.formatLabel}
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="named">
                  {messages.formatNamedLabel}
                </SelectItem>
                <SelectItem value="decimal">
                  {messages.formatDecimalLabel}
                </SelectItem>
                <SelectItem value="hex">{messages.formatHexLabel}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor={rangeId} className="text-sm font-medium">
              {messages.rangeLabel}
            </label>
            <Select value={range} onValueChange={handleRangeChange}>
              <SelectTrigger
                id={rangeId}
                aria-label={messages.rangeLabel}
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">
                  {messages.rangeMinimalLabel}
                </SelectItem>
                <SelectItem value="non-ascii">
                  {messages.rangeNonAsciiLabel}
                </SelectItem>
                <SelectItem value="all-special">
                  {messages.rangeAllSpecialLabel}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.plainTextLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id={plainTextId}
              name="plain-text"
              autoComplete="off"
              rows={10}
              aria-label={messages.plainTextLabel}
              value={plainText}
              onChange={(event) => {
                handlePlainTextChange(event.target.value)
              }}
              className="min-h-64 resize-y font-mono text-sm"
              placeholder={messages.plainTextPlaceholder}
            />
          </CardContent>
          <CardFooter className="justify-between gap-3 border-t">
            <ToolCopyButton
              value={plainText}
              copyLabel={messages.copyPlainTextLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              <RefreshCcw data-icon="inline-start" />
              {messages.resetLabel}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.encodedTextLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id={encodedTextId}
              name="encoded-text"
              autoComplete="off"
              spellCheck={false}
              rows={10}
              aria-label={messages.encodedTextLabel}
              value={encodedText}
              onChange={(event) => {
                handleEncodedTextChange(event.target.value)
              }}
              className="min-h-64 resize-y font-mono text-sm"
              placeholder={messages.encodedTextPlaceholder}
            />
          </CardContent>
          <CardFooter className="justify-end border-t">
            <ToolCopyButton
              value={encodedText}
              copyLabel={messages.copyEncodedTextLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default HtmlEntityEncoderDecoderClient
