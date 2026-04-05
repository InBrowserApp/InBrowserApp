import { useEffect, useId, useMemo, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { ArrowRight, RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import { decodeBase64, encodeBase64, isValidBase64 } from "./core/base64"

type Base64Messages = Readonly<{
  meta: {
    name: string
    description: string
  }
  workspaceEyebrow: string
  workspaceDescription: string
  localOnlyLabel: string
  plainTextLabel: string
  plainTextPlaceholder: string
  plainTextDescription: string
  encodedTextLabel: string
  encodedTextPlaceholder: string
  encodedTextDescription: string
  lengthLabel: string
  invalidBase64Title: string
  invalidBase64Description: string
  copyPlainTextLabel: string
  copyEncodedTextLabel: string
  copiedLabel: string
  resetLabel: string
}>

type Base64ToolClientProps = Readonly<{
  lang: string
  messages: Base64Messages
}>

const STORAGE_KEY = "tools:base64-encoder-decoder:plain-text"
const DEFAULT_TEXT = "Hello, browser-native world!"

function Base64EncoderDecoderClient({ lang, messages }: Base64ToolClientProps) {
  const plainTextId = useId()
  const encodedTextId = useId()
  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [encodedText, setEncodedText] = useState(() =>
    encodeBase64(DEFAULT_TEXT)
  )
  const [decodeError, setDecodeError] = useState(false)
  const numberFormatter = useMemo(() => new Intl.NumberFormat(lang), [lang])

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

  const plainTextLength = numberFormatter.format(plainText.length)
  const encodedTextLength = numberFormatter.format(encodedText.length)

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 border-b border-border/70 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {messages.workspaceEyebrow}
          </p>
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-base font-semibold text-foreground sm:text-lg">
            <span>{messages.plainTextLabel}</span>
            <ArrowRight aria-hidden="true" className="text-muted-foreground" />
            <span>{messages.encodedTextLabel}</span>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {messages.workspaceDescription}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{messages.localOnlyLabel}</Badge>
          </div>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>
      </div>

      <div className="grid gap-px bg-border/70 lg:grid-cols-2">
        <section className="flex min-w-0 flex-col gap-4 bg-muted/20 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Label htmlFor={plainTextId}>{messages.plainTextLabel}</Label>
                <Badge variant="secondary">
                  {messages.lengthLabel}: {plainTextLength}
                </Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {messages.plainTextDescription}
              </p>
            </div>

            <ToolCopyButton
              value={plainText}
              copyLabel={messages.copyPlainTextLabel}
              copiedLabel={messages.copiedLabel}
              variant="outline"
            />
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
            className="resize-y bg-background font-mono text-sm"
            placeholder={messages.plainTextPlaceholder}
          />
        </section>

        <section className="flex min-w-0 flex-col gap-4 bg-muted/20 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Label htmlFor={encodedTextId}>
                  {messages.encodedTextLabel}
                </Label>
                <Badge variant="secondary">
                  {messages.lengthLabel}: {encodedTextLength}
                </Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {messages.encodedTextDescription}
              </p>
            </div>

            <ToolCopyButton
              value={encodedText}
              copyLabel={messages.copyEncodedTextLabel}
              copiedLabel={messages.copiedLabel}
              variant="outline"
            />
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
            className="resize-y bg-background font-mono text-sm"
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
        </section>
      </div>
    </div>
  )
}

export default Base64EncoderDecoderClient
