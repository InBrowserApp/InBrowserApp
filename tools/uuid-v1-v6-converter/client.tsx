import { useEffect, useId, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { ArrowLeftRight, RefreshCcw, Trash2 } from "@workspace/ui/icons"

import { UuidFieldCard } from "./components/uuid-field-card"
import { convertUuid } from "./core/uuid-v1-v6"

import type { UuidConversionResult, UuidParseError } from "./core/uuid-v1-v6"
import type { UuidV1V6ConverterMessages } from "./types"

type SourceVersion = "v1" | "v6"

const DEFAULT_V1 = "c1ed67f0-34bd-11f0-b3fe-02d71e841f4f"
const STORAGE_KEYS = {
  source: "tools:uuid-v1-v6-converter:source",
  value: "tools:uuid-v1-v6-converter:value",
} as const

function getErrorMessage(
  messages: UuidV1V6ConverterMessages,
  source: SourceVersion,
  error: Exclude<UuidParseError, "empty">
) {
  if (source === "v1") {
    return {
      format: messages.invalidV1Format,
      variant: messages.invalidV1Variant,
      version: messages.invalidV1Version,
    }[error]
  }

  return {
    format: messages.invalidV6Format,
    variant: messages.invalidV6Variant,
    version: messages.invalidV6Version,
  }[error]
}

function resolveFieldValues(
  source: SourceVersion,
  sourceValue: string,
  result: UuidConversionResult
) {
  const emptyValues = {
    v1CopyValue: "",
    v1Value: source === "v1" ? sourceValue : "",
    v6CopyValue: "",
    v6Value: source === "v6" ? sourceValue : "",
  }

  if (result.kind !== "valid") {
    return emptyValues
  }

  return source === "v1"
    ? {
        v1CopyValue: result.input,
        v1Value: sourceValue,
        v6CopyValue: result.output,
        v6Value: result.output,
      }
    : {
        v1CopyValue: result.output,
        v1Value: result.output,
        v6CopyValue: result.input,
        v6Value: sourceValue,
      }
}

function UuidV1V6ConverterClient({
  messages,
}: Readonly<{ messages: UuidV1V6ConverterMessages }>) {
  const v1InputId = useId()
  const v6InputId = useId()
  const [source, setSource] = useState<SourceVersion>("v1")
  const [sourceValue, setSourceValue] = useState(DEFAULT_V1)
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      setHasLoadedStorage(true)
      return
    }

    const storedSource = window.localStorage.getItem(STORAGE_KEYS.source)
    const storedValue = window.localStorage.getItem(STORAGE_KEYS.value)

    if (storedSource === "v1" || storedSource === "v6") {
      setSource(storedSource)
    }

    if (storedValue !== null) {
      setSourceValue(storedValue)
    }

    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !hasLoadedStorage) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.source, source)
    window.localStorage.setItem(STORAGE_KEYS.value, sourceValue)
  }, [hasLoadedStorage, source, sourceValue])

  const result = convertUuid(
    source === "v1" ? "v1-to-v6" : "v6-to-v1",
    sourceValue
  )
  const values = resolveFieldValues(source, sourceValue, result)
  const errorMessage =
    result.kind === "invalid"
      ? getErrorMessage(messages, source, result.error)
      : null

  function handleChange(nextSource: SourceVersion, value: string) {
    setSource(nextSource)
    setSourceValue(value)
  }

  function handleLoadSample() {
    setSource("v1")
    setSourceValue(DEFAULT_V1)
  }

  function handleClear() {
    setSource("v1")
    setSourceValue("")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-start">
        <UuidFieldCard
          id={v1InputId}
          title={messages.v1Title}
          description={messages.v1Description}
          label={messages.v1Label}
          name="uuid-v1"
          placeholder={messages.v1Placeholder}
          value={values.v1Value}
          copyValue={values.v1CopyValue}
          copyLabel={messages.copyV1Label}
          copiedLabel={messages.copiedLabel}
          errorMessage={source === "v1" ? errorMessage : null}
          onChange={(value) => {
            handleChange("v1", value)
          }}
        />

        <div
          className="hidden h-12 items-center justify-center rounded-md border bg-muted text-muted-foreground lg:flex"
          aria-hidden="true"
        >
          <ArrowLeftRight />
        </div>

        <UuidFieldCard
          id={v6InputId}
          title={messages.v6Title}
          description={messages.v6Description}
          label={messages.v6Label}
          name="uuid-v6"
          placeholder={messages.v6Placeholder}
          value={values.v6Value}
          copyValue={values.v6CopyValue}
          copyLabel={messages.copyV6Label}
          copiedLabel={messages.copiedLabel}
          errorMessage={source === "v6" ? errorMessage : null}
          onChange={(value) => {
            handleChange("v6", value)
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{messages.emptyHint}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
          >
            <Trash2 data-icon="inline-start" />
            {messages.clearLabel}
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
        </div>
      </div>
    </div>
  )
}

export default UuidV1V6ConverterClient
