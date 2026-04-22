import { useEffect, useId, useState } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { FileText, Trash2, TriangleAlert } from "@workspace/ui/icons"

import { BaseSection } from "./components/base-section"
import { CustomSection } from "./components/custom-section"
import {
  BASE_FIELD_IDS,
  clampCustomBase,
  createEmptyValues,
  formatAllBaseValues,
  parseFieldInput,
} from "./core/number-base"

import type { BaseSectionItem } from "./components/base-section"
import type { BaseFieldId } from "./core/number-base"
import type { NumberBaseConverterMessages } from "./types"

const DEFAULT_SOURCE_FIELD = "decimal" satisfies BaseFieldId
const DEFAULT_SOURCE_VALUE = "255"
const DEFAULT_CUSTOM_BASE = 58
const STORAGE_KEYS = {
  customBase: "tools:number-base-converter:custom-base",
  sourceField: "tools:number-base-converter:source-field",
  sourceValue: "tools:number-base-converter:source-value",
} as const

function NumberBaseConverterClient({
  messages,
}: Readonly<{ messages: NumberBaseConverterMessages }>) {
  const [customBase, setCustomBase] = useState(DEFAULT_CUSTOM_BASE)
  const [customBaseDraft, setCustomBaseDraft] = useState(
    String(DEFAULT_CUSTOM_BASE)
  )
  const [sourceField, setSourceField] =
    useState<BaseFieldId>(DEFAULT_SOURCE_FIELD)
  const [sourceValue, setSourceValue] = useState(DEFAULT_SOURCE_VALUE)
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)

  const commonFields: readonly BaseSectionItem[] = [
    {
      field: "binary",
      id: useId(),
      label: messages.binaryLabel,
      placeholder: messages.binaryPlaceholder,
    },
    {
      field: "octal",
      id: useId(),
      label: messages.octalLabel,
      placeholder: messages.octalPlaceholder,
    },
    {
      field: "decimal",
      id: useId(),
      inputMode: "numeric",
      label: messages.decimalLabel,
      placeholder: messages.decimalPlaceholder,
    },
    {
      field: "hexadecimal",
      id: useId(),
      label: messages.hexadecimalLabel,
      placeholder: messages.hexadecimalPlaceholder,
    },
  ]
  const extendedFields: readonly BaseSectionItem[] = [
    {
      field: "base32",
      id: useId(),
      label: messages.base32Label,
      placeholder: messages.base32Placeholder,
    },
    {
      field: "base36",
      id: useId(),
      label: messages.base36Label,
      placeholder: messages.base36Placeholder,
    },
    {
      field: "base62",
      id: useId(),
      label: messages.base62Label,
      placeholder: messages.base62Placeholder,
    },
    {
      field: "base64",
      id: useId(),
      label: messages.base64Label,
      placeholder: messages.base64Placeholder,
    },
  ]
  const customValueId = useId()
  const customBaseId = useId()

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      setHasLoadedStorage(true)
      return
    }

    const storedField = window.localStorage.getItem(STORAGE_KEYS.sourceField)
    const storedValue = window.localStorage.getItem(STORAGE_KEYS.sourceValue)
    const storedCustomBase = window.localStorage.getItem(
      STORAGE_KEYS.customBase
    )

    if (storedField && BASE_FIELD_IDS.includes(storedField as BaseFieldId)) {
      setSourceField(storedField as BaseFieldId)
    }

    if (storedValue !== null) {
      setSourceValue(storedValue)
    }

    if (storedCustomBase !== null) {
      const nextCustomBase = clampCustomBase(Number(storedCustomBase))

      setCustomBase(nextCustomBase)
      setCustomBaseDraft(String(nextCustomBase))
    }

    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !hasLoadedStorage) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.sourceField, sourceField)
    window.localStorage.setItem(STORAGE_KEYS.sourceValue, sourceValue)
    window.localStorage.setItem(STORAGE_KEYS.customBase, String(customBase))
  }, [customBase, hasLoadedStorage, sourceField, sourceValue])

  const parseResult = parseFieldInput(sourceField, sourceValue, customBase)
  const displayValues =
    parseResult.kind === "valid"
      ? formatAllBaseValues(parseResult.value, customBase)
      : createEmptyValues()

  if (parseResult.kind === "invalid") {
    displayValues[sourceField] = sourceValue
  }

  const fieldLabels = {
    binary: messages.binaryLabel,
    octal: messages.octalLabel,
    decimal: messages.decimalLabel,
    hexadecimal: messages.hexadecimalLabel,
    base32: messages.base32Label,
    base36: messages.base36Label,
    base62: messages.base62Label,
    base64: messages.base64Label,
    custom: messages.customLabel,
  } as const satisfies Record<BaseFieldId, string>

  function handleFieldChange(field: BaseFieldId, value: string) {
    setSourceField(field)
    setSourceValue(value)
  }

  function handleCustomBaseCommit() {
    const normalizedBase = clampCustomBase(Number(customBaseDraft))

    if (parseResult.kind === "valid") {
      setSourceField("decimal")
      setSourceValue(displayValues.decimal)
    }

    setCustomBase(normalizedBase)
    setCustomBaseDraft(String(normalizedBase))
  }

  function handleLoadSample() {
    setSourceField(DEFAULT_SOURCE_FIELD)
    setSourceValue(DEFAULT_SOURCE_VALUE)
    setCustomBase(DEFAULT_CUSTOM_BASE)
    setCustomBaseDraft(String(DEFAULT_CUSTOM_BASE))
  }

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.converterTitle}</CardTitle>
        <CardDescription>{messages.converterDescription}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="gap-6">
        <BaseSection
          title={messages.commonBasesTitle}
          description={messages.commonBasesDescription}
          items={commonFields}
          values={displayValues}
          invalidField={
            parseResult.kind === "invalid" ? sourceField : undefined
          }
          copyLabel={messages.copyValueLabel}
          copiedLabel={messages.copiedLabel}
          onChange={handleFieldChange}
        />

        <BaseSection
          title={messages.extendedBasesTitle}
          description={messages.extendedBasesDescription}
          items={extendedFields}
          values={displayValues}
          invalidField={
            parseResult.kind === "invalid" ? sourceField : undefined
          }
          copyLabel={messages.copyValueLabel}
          copiedLabel={messages.copiedLabel}
          onChange={handleFieldChange}
        />

        <CustomSection
          title={messages.customBaseTitle}
          description={messages.customBaseDescription}
          baseDraft={customBaseDraft}
          baseValueId={customBaseId}
          valueLabel={messages.customBaseValueLabel}
          label={messages.customLabel}
          placeholder={messages.customPlaceholder}
          value={displayValues.custom}
          valueId={customValueId}
          invalid={parseResult.kind === "invalid" && sourceField === "custom"}
          copyLabel={messages.copyValueLabel}
          copiedLabel={messages.copiedLabel}
          onBaseChange={setCustomBaseDraft}
          onBaseCommit={handleCustomBaseCommit}
          onValueChange={handleFieldChange}
        />

        <div className="grid gap-3 rounded-xl border border-dashed border-border/80 bg-muted/30 p-4 text-sm text-muted-foreground">
          <p>{messages.standardAlphabetHint}</p>
          <p>{messages.base64AlphabetHint}</p>
        </div>

        {parseResult.kind === "invalid" ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>
              {messages.invalidValueMessage.replace(
                "{base}",
                fieldLabels[sourceField]
              )}
            </AlertDescription>
          </Alert>
        ) : null}
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="justify-start gap-3 border-t">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLoadSample}
        >
          <FileText data-icon="inline-start" />
          {messages.loadSampleLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setSourceField(DEFAULT_SOURCE_FIELD)
            setSourceValue("")
          }}
        >
          <Trash2 data-icon="inline-start" />
          {messages.clearAllLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export default NumberBaseConverterClient
