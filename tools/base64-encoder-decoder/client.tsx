import { useEffect, useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import { Separator } from "@workspace/ui/components/ui/separator"
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
  messages: Base64Messages
}>

const STORAGE_KEY = "tools:base64-encoder-decoder:plain-text"
const DEFAULT_TEXT = "Hello, browser-native world!"

function Base64EncoderDecoderClient({ messages }: Base64ToolClientProps) {
  const plainTextId = useId()
  const encodedTextId = useId()
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
    <div className="flex flex-col lg:flex-row">
      <section className="flex min-w-0 flex-1 flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={plainTextId}>{messages.plainTextLabel}</Label>
          <p className="text-sm leading-6 text-muted-foreground">
            {messages.plainTextDescription}
          </p>
        </div>

        <Textarea
          id={plainTextId}
          name="plain-text"
          autoComplete="off"
          rows={10}
          value={plainText}
          onChange={(event) => {
            handlePlainTextChange(event.target.value)
          }}
          className="min-h-72 resize-y font-mono text-sm"
          placeholder={messages.plainTextPlaceholder}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
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
        </div>
      </section>

      <Separator className="mx-5 sm:mx-6 lg:hidden" />
      <Separator
        orientation="vertical"
        className="my-12 hidden h-auto lg:block"
      />

      <section className="flex min-w-0 flex-1 flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={encodedTextId}>{messages.encodedTextLabel}</Label>
          <p className="text-sm leading-6 text-muted-foreground">
            {messages.encodedTextDescription}
          </p>
        </div>

        <Textarea
          id={encodedTextId}
          name="base64-output"
          autoComplete="off"
          spellCheck={false}
          rows={10}
          value={encodedText}
          onChange={(event) => {
            handleEncodedTextChange(event.target.value)
          }}
          aria-invalid={decodeError}
          className="min-h-72 resize-y font-mono text-sm"
          placeholder={messages.encodedTextPlaceholder}
        />

        <div aria-live="polite">
          {decodeError ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>{messages.invalidBase64Title}</AlertTitle>
              <AlertDescription>
                {messages.invalidBase64Description}
              </AlertDescription>
            </Alert>
          ) : null}
        </div>

        <div className="flex justify-end">
          <ToolCopyButton
            value={encodedText}
            copyLabel={messages.copyEncodedTextLabel}
            copiedLabel={messages.copiedLabel}
            variant="ghost"
          />
        </div>
      </section>
    </div>
  )
}

export default Base64EncoderDecoderClient
