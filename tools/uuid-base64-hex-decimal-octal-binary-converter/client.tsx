import { useEffect, useId, useMemo, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  RefreshCcw,
  Sparkles,
  Trash2,
  TriangleAlert,
} from "@workspace/ui/icons"

import { FormatCard } from "./components/format-card"
import {
  UUID_FORMATS,
  convertUuidValue,
  createRandomUuidValues,
  createSampleUuidValues,
  type UuidFormat,
  type UuidFormatValues,
} from "./core/uuid-converter"
import type { UuidBaseConverterPageMessages } from "./types"

type UuidBaseConverterClientProps = Readonly<{
  messages: UuidBaseConverterPageMessages
}>

const STORAGE_KEY = "tools:uuid-base64-hex-decimal-octal-binary-converter:uuid"
const MULTILINE_FORMATS = new Set<UuidFormat>(["decimal", "octal", "binary"])

function UuidBaseConverterClient({ messages }: UuidBaseConverterClientProps) {
  const fieldPrefix = useId()
  const [values, setValues] = useState<UuidFormatValues>(() =>
    createSampleUuidValues()
  )
  const [invalidFormat, setInvalidFormat] = useState<UuidFormat | null>(null)
  const [cryptoUnavailable, setCryptoUnavailable] = useState(false)

  const hasValidValues = invalidFormat === null && values.uuid.length > 0
  const formatCards = useMemo(
    () =>
      UUID_FORMATS.map((format) => ({
        format,
        inputId: `${fieldPrefix}-${format}`,
        copy: messages.formats[format],
        multiline: MULTILINE_FORMATS.has(format),
      })),
    [fieldPrefix, messages.formats]
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedUuid = window.localStorage.getItem(STORAGE_KEY)

    if (!storedUuid) {
      return
    }

    const result = convertUuidValue("uuid", storedUuid)

    if (result.state === "valid") {
      setValues(result.values)
      setInvalidFormat(null)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    if (hasValidValues) {
      window.localStorage.setItem(STORAGE_KEY, values.uuid)
      return
    }

    window.localStorage.removeItem(STORAGE_KEY)
  }, [hasValidValues, values.uuid])

  function applyConversion(format: UuidFormat, nextValue: string) {
    const result = convertUuidValue(format, nextValue)

    setCryptoUnavailable(false)
    setValues(result.values)
    setInvalidFormat(result.state === "invalid" ? format : null)
  }

  function handleLoadSample() {
    setCryptoUnavailable(false)
    setValues(createSampleUuidValues())
    setInvalidFormat(null)
  }

  function handleClearAll() {
    applyConversion("uuid", "")
  }

  function handleGenerateUuid() {
    try {
      setValues(createRandomUuidValues())
      setInvalidFormat(null)
      setCryptoUnavailable(false)
    } catch {
      setCryptoUnavailable(true)
    }
  }

  const activeError = invalidFormat
    ? messages.formats[invalidFormat].invalidMessage
    : null

  return (
    <div className="flex flex-col gap-6">
      <div
        className="flex flex-wrap justify-end gap-2"
        aria-label={messages.actionsLabel}
      >
        <Button type="button" size="sm" onClick={handleGenerateUuid}>
          <Sparkles data-icon="inline-start" />
          {messages.generateUuidLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLoadSample}
        >
          <RefreshCcw data-icon="inline-start" />
          {messages.loadSampleLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClearAll}
        >
          <Trash2 data-icon="inline-start" />
          {messages.clearAllLabel}
        </Button>
      </div>

      {activeError ? (
        <div aria-live="polite">
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.invalidValueTitle}</AlertTitle>
            <AlertDescription>
              {messages.invalidValueDescription} {activeError}
            </AlertDescription>
          </Alert>
        </div>
      ) : null}

      {cryptoUnavailable ? (
        <div aria-live="polite">
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.cryptoUnavailableTitle}</AlertTitle>
            <AlertDescription>
              {messages.cryptoUnavailableDescription}
            </AlertDescription>
          </Alert>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {formatCards.map(({ copy, format, inputId, multiline }) => (
          <FormatCard
            key={format}
            format={format}
            copy={copy}
            inputId={inputId}
            invalid={invalidFormat === format}
            multiline={multiline}
            value={values[format]}
            copiedLabel={messages.copiedLabel}
            copyDisabled={!hasValidValues}
            onValueChange={applyConversion}
          />
        ))}
      </div>
    </div>
  )
}

export default UuidBaseConverterClient
