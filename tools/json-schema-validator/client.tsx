import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
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
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileJson2, RefreshCcw } from "@workspace/ui/icons"

import { DEFAULT_DATA, DEFAULT_SCHEMA, STORAGE_KEYS } from "./client/constants"
import { ResultCard } from "./client/result-card"
import type { JsonSchemaMessages } from "./client/types"
import {
  validateJsonSchemaText,
  type ValidationResult,
} from "./core/validate-json-schema"

type JsonSchemaValidatorClientProps = Readonly<{
  messages: JsonSchemaMessages
}>

function JsonSchemaValidatorClient({
  messages,
}: JsonSchemaValidatorClientProps) {
  const [schemaText, setSchemaText] = useState(DEFAULT_SCHEMA)
  const [dataText, setDataText] = useState(DEFAULT_DATA)
  const [validateFormats, setValidateFormats] = useState(true)
  const [allErrors, setAllErrors] = useState(true)

  const deferredSchemaText = useDeferredValue(schemaText)
  const deferredDataText = useDeferredValue(dataText)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedSchema = window.localStorage.getItem(STORAGE_KEYS.schema)
    const storedData = window.localStorage.getItem(STORAGE_KEYS.data)
    const storedValidateFormats = window.localStorage.getItem(
      STORAGE_KEYS.validateFormats
    )
    const storedAllErrors = window.localStorage.getItem(STORAGE_KEYS.allErrors)

    if (storedSchema) {
      setSchemaText(storedSchema)
    }

    if (storedData) {
      setDataText(storedData)
    }

    if (storedValidateFormats) {
      setValidateFormats(storedValidateFormats === "true")
    }

    if (storedAllErrors) {
      setAllErrors(storedAllErrors === "true")
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.schema, schemaText)
  }, [schemaText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.data, dataText)
  }, [dataText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(
      STORAGE_KEYS.validateFormats,
      String(validateFormats)
    )
  }, [validateFormats])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.allErrors, String(allErrors))
  }, [allErrors])

  const validation = useMemo<ValidationResult>(() => {
    return validateJsonSchemaText(deferredSchemaText, deferredDataText, {
      allErrors,
      validateFormats,
    })
  }, [allErrors, deferredDataText, deferredSchemaText, validateFormats])

  const errorsJson =
    validation.state === "validated" && validation.issues.length > 0
      ? JSON.stringify(validation.issues, null, 2)
      : ""

  function loadExample() {
    startTransition(() => {
      setSchemaText(DEFAULT_SCHEMA)
      setDataText(DEFAULT_DATA)
      setValidateFormats(true)
      setAllErrors(true)
    })
  }

  function clearAll() {
    startTransition(() => {
      setSchemaText("")
      setDataText("")
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid auto-rows-fr gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>{messages.schemaLabel}</CardTitle>
              <CardDescription>{messages.schemaDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <Textarea
                value={schemaText}
                onChange={(event) => {
                  setSchemaText(event.target.value)
                }}
                className="min-h-64 flex-1 resize-y font-mono text-sm"
                placeholder={messages.schemaPlaceholder}
              />
            </CardContent>
            <CardFooter className="border-t">
              <ToolCopyButton
                value={schemaText}
                copyLabel={messages.copySchemaLabel}
                copiedLabel={messages.copiedLabel}
                variant="ghost"
              />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>{messages.dataLabel}</CardTitle>
              <CardDescription>{messages.dataDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <Textarea
                value={dataText}
                onChange={(event) => {
                  setDataText(event.target.value)
                }}
                className="min-h-64 flex-1 resize-y font-mono text-sm"
                placeholder={messages.dataPlaceholder}
              />
            </CardContent>
            <CardFooter className="border-t">
              <ToolCopyButton
                value={dataText}
                copyLabel={messages.copyDataLabel}
                copiedLabel={messages.copiedLabel}
                variant="ghost"
              />
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{messages.optionsTitle}</CardTitle>
            <CardDescription>{messages.optionsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <FieldGroup>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="validate-formats">
                    {messages.validateFormatsLabel}
                  </FieldLabel>
                  <FieldDescription>
                    {messages.validateFormatsDescription}
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="validate-formats"
                  checked={validateFormats}
                  onCheckedChange={setValidateFormats}
                  aria-label={messages.validateFormatsLabel}
                />
              </Field>

              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="all-errors">
                    {messages.allErrorsLabel}
                  </FieldLabel>
                  <FieldDescription>
                    {messages.allErrorsDescription}
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="all-errors"
                  checked={allErrors}
                  onCheckedChange={setAllErrors}
                  aria-label={messages.allErrorsLabel}
                />
              </Field>

              <Field>
                <div className="flex items-center gap-2">
                  <FieldTitle>{messages.draftLabel}</FieldTitle>
                  <Badge variant="outline" className="font-mono">
                    {validation.state === "validated" ||
                    validation.state === "schema-error"
                      ? validation.detectedDraft
                      : "2020-12"}
                  </Badge>
                </div>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={loadExample}
            >
              <FileJson2 data-icon="inline-start" />
              {messages.loadExampleLabel}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={clearAll}>
              <RefreshCcw data-icon="inline-start" />
              {messages.clearLabel}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <ResultCard
        errorsJson={errorsJson}
        messages={messages}
        validation={validation}
      />
    </div>
  )
}

export default JsonSchemaValidatorClient
