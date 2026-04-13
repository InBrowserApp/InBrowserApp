import { useEffect, useId, useState } from "react"

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { RefreshCcw } from "@workspace/ui/icons"

import {
  ESCAPE_FORMATS,
  escapeUnicode,
  unescapeUnicode,
  type EscapeFormat,
} from "./core/unicode-escape"

type UnicodeEscapeUnescapeMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  plainTextLabel: string
  plainTextDescription: string
  plainTextPlaceholder: string
  escapeFormatLabel: string
  escapedTextLabel: string
  escapedTextDescription: string
  escapedTextPlaceholder: string
  copyPlainTextLabel: string
  copyEscapedTextLabel: string
  copiedLabel: string
  resetLabel: string
}>

type UnicodeEscapeUnescapeClientProps = Readonly<{
  messages: UnicodeEscapeUnescapeMessages
}>

const STORAGE_PREFIX = "tools:unicode-escape-unescape"
const DEFAULT_TEXT = "Hello 你好 🎉"
const DEFAULT_FORMAT: EscapeFormat = "js"

function UnicodeEscapeUnescapeClient({
  messages,
}: UnicodeEscapeUnescapeClientProps) {
  const plainTextId = useId()
  const escapedTextId = useId()
  const formatId = useId()

  const [format, setFormat] = useState<EscapeFormat>(DEFAULT_FORMAT)
  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [escapedText, setEscapedText] = useState(() =>
    escapeUnicode(DEFAULT_TEXT, DEFAULT_FORMAT)
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedPlain = window.localStorage.getItem(
      `${STORAGE_PREFIX}:plain-text`
    )
    const storedFormat = window.localStorage.getItem(
      `${STORAGE_PREFIX}:format`
    ) as EscapeFormat | null

    const resolvedFormat =
      storedFormat && ESCAPE_FORMATS.some((f) => f.value === storedFormat)
        ? storedFormat
        : DEFAULT_FORMAT

    if (storedPlain !== null) {
      setPlainText(storedPlain)
      setFormat(resolvedFormat)
      setEscapedText(escapeUnicode(storedPlain, resolvedFormat))
    } else if (storedFormat) {
      setFormat(resolvedFormat)
      setEscapedText(escapeUnicode(DEFAULT_TEXT, resolvedFormat))
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(`${STORAGE_PREFIX}:plain-text`, plainText)
  }, [plainText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(`${STORAGE_PREFIX}:format`, format)
  }, [format])

  function handlePlainTextChange(nextValue: string) {
    setPlainText(nextValue)
    setEscapedText(escapeUnicode(nextValue, format))
  }

  function handleEscapedTextChange(nextValue: string) {
    setEscapedText(nextValue)
    setPlainText(unescapeUnicode(nextValue))
  }

  function handleFormatChange(nextFormat: EscapeFormat) {
    setFormat(nextFormat)
    setEscapedText(escapeUnicode(plainText, nextFormat))
  }

  function handleReset() {
    setPlainText(DEFAULT_TEXT)
    setFormat(DEFAULT_FORMAT)
    setEscapedText(escapeUnicode(DEFAULT_TEXT, DEFAULT_FORMAT))
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-3">
        <label htmlFor={formatId} className="text-sm font-medium">
          {messages.escapeFormatLabel}
        </label>
        <Select value={format} onValueChange={handleFormatChange}>
          <SelectTrigger
            id={formatId}
            aria-label={messages.escapeFormatLabel}
            className="w-auto"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ESCAPE_FORMATS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label} ({f.example})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.plainTextLabel}</CardTitle>
            <CardDescription>{messages.plainTextDescription}</CardDescription>
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
            <CardTitle>{messages.escapedTextLabel}</CardTitle>
            <CardDescription>{messages.escapedTextDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id={escapedTextId}
              name="escaped-text"
              autoComplete="off"
              spellCheck={false}
              rows={10}
              aria-label={messages.escapedTextLabel}
              value={escapedText}
              onChange={(event) => {
                handleEscapedTextChange(event.target.value)
              }}
              className="min-h-64 resize-y font-mono text-sm"
              placeholder={messages.escapedTextPlaceholder}
            />
          </CardContent>
          <CardFooter className="justify-end border-t">
            <ToolCopyButton
              value={escapedText}
              copyLabel={messages.copyEscapedTextLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default UnicodeEscapeUnescapeClient
