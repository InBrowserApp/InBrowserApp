import { useEffect, useState } from "react"

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
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import { decodeBase64, encodeBase64, isValidBase64 } from "./core/base64"

type Base64Messages = Readonly<{
  meta: {
    name: string
    description: string
  }
  plainTextLabel: string
  plainTextPlaceholder: string
  plainTextDescription: string
  encodedTextLabel: string
  encodedTextPlaceholder: string
  encodedTextDescription: string
  invalidBase64Title: string
  invalidBase64Description: string
  copyPlainTextLabel: string
  copyEncodedTextLabel: string
  copiedLabel: string
  resetLabel: string
}>

type Base64ToolClientProps = Readonly<{
  language: string
  messages: Base64Messages
}>

const STORAGE_KEY = "tools:base64-encoder-decoder:plain-text"
const DEFAULT_TEXT = "Hello, browser-native world!"

function Base64EncoderDecoderClient({ messages }: Base64ToolClientProps) {
  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [encodedText, setEncodedText] = useState(() =>
    encodeBase64(DEFAULT_TEXT)
  )
  const [decodeError, setDecodeError] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const storedValue = window.localStorage.getItem(STORAGE_KEY)

    if (!storedValue) {
      return
    }

    setPlainText(storedValue)
    setEncodedText(encodeBase64(storedValue))
    setDecodeError(false)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, plainText)
  }, [plainText])

  function handlePlainTextChange(nextValue: string) {
    setPlainText(nextValue)
    setEncodedText(encodeBase64(nextValue))
    setDecodeError(false)
  }

  function handleEncodedTextChange(nextValue: string) {
    setEncodedText(nextValue)

    if (!isValidBase64(nextValue)) {
      setDecodeError(true)
      return
    }

    setPlainText(decodeBase64(nextValue))
    setDecodeError(false)
  }

  function handleReset() {
    setPlainText(DEFAULT_TEXT)
    setEncodedText(encodeBase64(DEFAULT_TEXT))
    setDecodeError(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{messages.plainTextLabel}</CardTitle>
            <CardDescription>{messages.plainTextDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={plainText}
              onChange={(event) => {
                handlePlainTextChange(event.target.value)
              }}
              className="min-h-56 resize-y font-mono text-sm"
              placeholder={messages.plainTextPlaceholder}
            />
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <ToolCopyButton
              value={plainText}
              copyLabel={messages.copyPlainTextLabel}
              copiedLabel={messages.copiedLabel}
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
          <CardHeader>
            <CardTitle>{messages.encodedTextLabel}</CardTitle>
            <CardDescription>{messages.encodedTextDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              value={encodedText}
              onChange={(event) => {
                handleEncodedTextChange(event.target.value)
              }}
              aria-invalid={decodeError}
              className="min-h-56 resize-y font-mono text-sm"
              placeholder={messages.encodedTextPlaceholder}
            />

            {decodeError ? (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>{messages.invalidBase64Title}</AlertTitle>
                <AlertDescription>
                  {messages.invalidBase64Description}
                </AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
          <CardFooter className="justify-end">
            <ToolCopyButton
              value={encodedText}
              copyLabel={messages.copyEncodedTextLabel}
              copiedLabel={messages.copiedLabel}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Base64EncoderDecoderClient
