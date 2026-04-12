import { useEffect, useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Alert, AlertTitle } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import {
  decodeUrlComponent,
  encodeUrlComponent,
  isValidUrlComponentEncoding,
} from "./core/url-component"

type UrlComponentMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  plainTextLabel: string
  plainTextPlaceholder: string
  encodedTextLabel: string
  encodedTextPlaceholder: string
  invalidEncodedTextLabel: string
  copyPlainTextLabel: string
  copyEncodedTextLabel: string
  copiedLabel: string
  resetLabel: string
}>

type UrlComponentEncoderDecoderClientProps = Readonly<{
  messages: UrlComponentMessages
}>

const STORAGE_KEY = "tools:url-component-encoder-decoder:plain-text"
const DEFAULT_TEXT = "Hello World! 50% off & more"

function UrlComponentEncoderDecoderClient({
  messages,
}: UrlComponentEncoderDecoderClientProps) {
  const plainTextId = useId()
  const encodedTextId = useId()
  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [encodedText, setEncodedText] = useState(() =>
    encodeUrlComponent(DEFAULT_TEXT)
  )
  const [decodeError, setDecodeError] = useState(false)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedValue = window.localStorage.getItem(STORAGE_KEY)

    if (storedValue === null) {
      return
    }

    setPlainText(storedValue)
    setEncodedText(encodeUrlComponent(storedValue))
    setDecodeError(false)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY, plainText)
  }, [plainText])

  function handlePlainTextChange(nextValue: string) {
    setPlainText(nextValue)
    setEncodedText(encodeUrlComponent(nextValue))
    setDecodeError(false)
  }

  function handleEncodedTextChange(nextValue: string) {
    setEncodedText(nextValue)

    if (!isValidUrlComponentEncoding(nextValue)) {
      setDecodeError(true)
      return
    }

    setPlainText(decodeUrlComponent(nextValue))
    setDecodeError(false)
  }

  function handleReset() {
    setPlainText(DEFAULT_TEXT)
    setEncodedText(encodeUrlComponent(DEFAULT_TEXT))
    setDecodeError(false)
  }

  return (
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
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            <RefreshCcw data-icon="inline-start" />
            {messages.resetLabel}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.encodedTextLabel}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
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
            aria-invalid={decodeError}
            className="min-h-64 resize-y font-mono text-sm"
            placeholder={messages.encodedTextPlaceholder}
          />

          {decodeError ? (
            <div aria-live="polite">
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>{messages.invalidEncodedTextLabel}</AlertTitle>
              </Alert>
            </div>
          ) : null}
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
  )
}

export default UrlComponentEncoderDecoderClient
