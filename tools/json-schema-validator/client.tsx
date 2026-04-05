import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react"

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
import { Label } from "@workspace/ui/components/ui/label"
import { Switch } from "@workspace/ui/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  BadgeCheck,
  FileJson2,
  RefreshCcw,
  TriangleAlert,
} from "@workspace/ui/icons"

import {
  validateJsonSchemaText,
  type ValidationResult,
} from "./core/validate-json-schema"

type JsonSchemaMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  schemaLabel: string
  schemaDescription: string
  schemaPlaceholder: string
  dataLabel: string
  dataDescription: string
  dataPlaceholder: string
  optionsTitle: string
  optionsDescription: string
  validateFormatsLabel: string
  validateFormatsDescription: string
  allErrorsLabel: string
  allErrorsDescription: string
  draftLabel: string
  idleTitle: string
  idleDescription: string
  parseErrorTitle: string
  schemaErrorTitle: string
  validTitle: string
  validDescription: string
  invalidTitle: string
  invalidDescription: string
  errorPathLabel: string
  errorKeywordLabel: string
  errorMessageLabel: string
  resultTitle: string
  resultDescription: string
  copySchemaLabel: string
  copyDataLabel: string
  copyErrorsLabel: string
  copiedLabel: string
  loadExampleLabel: string
  clearLabel: string
}>

type JsonSchemaValidatorClientProps = Readonly<{
  messages: JsonSchemaMessages
}>

const DEFAULT_SCHEMA = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "integer", "minimum": 0 }
  },
  "required": ["id", "name"],
  "additionalProperties": false
}`

const DEFAULT_DATA = `{
  "id": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  "name": "Ada Lovelace",
  "age": 37
}`

const STORAGE_KEYS = {
  allErrors: "tools:json-schema-validator:all-errors",
  data: "tools:json-schema-validator:data",
  schema: "tools:json-schema-validator:schema",
  validateFormats: "tools:json-schema-validator:validate-formats",
} as const

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
    if (typeof window === "undefined") {
      return
    }

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
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.schema, schemaText)
  }, [schemaText])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.data, dataText)
  }, [dataText])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEYS.validateFormats,
      String(validateFormats)
    )
  }, [validateFormats])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

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
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>{messages.schemaLabel}</CardTitle>
              <CardDescription>{messages.schemaDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={schemaText}
                onChange={(event) => {
                  setSchemaText(event.target.value)
                }}
                className="min-h-64 resize-y font-mono text-sm"
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
            <CardContent>
              <Textarea
                value={dataText}
                onChange={(event) => {
                  setDataText(event.target.value)
                }}
                className="min-h-64 resize-y font-mono text-sm"
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
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Label>{messages.validateFormatsLabel}</Label>
                <p className="text-sm leading-6 text-muted-foreground">
                  {messages.validateFormatsDescription}
                </p>
              </div>
              <Switch
                checked={validateFormats}
                onCheckedChange={setValidateFormats}
                aria-label={messages.validateFormatsLabel}
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Label>{messages.allErrorsLabel}</Label>
                <p className="text-sm leading-6 text-muted-foreground">
                  {messages.allErrorsDescription}
                </p>
              </div>
              <Switch
                checked={allErrors}
                onCheckedChange={setAllErrors}
                aria-label={messages.allErrorsLabel}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {messages.draftLabel}
              </span>
              <Badge variant="outline" className="font-mono">
                {validation.state === "validated" ||
                validation.state === "schema-error"
                  ? validation.detectedDraft
                  : "2020-12"}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <Button
              type="button"
              variant="outline"
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

      <Card>
        <CardHeader>
          <CardTitle>{messages.resultTitle}</CardTitle>
          <CardDescription>{messages.resultDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {validation.state === "idle" ? (
            <Alert>
              <FileJson2 />
              <AlertTitle>{messages.idleTitle}</AlertTitle>
              <AlertDescription>{messages.idleDescription}</AlertDescription>
            </Alert>
          ) : null}

          {validation.state === "parse-error" ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>{messages.parseErrorTitle}</AlertTitle>
              <AlertDescription>
                <span className="font-medium">
                  {validation.source === "schema"
                    ? messages.schemaLabel
                    : messages.dataLabel}
                  :
                </span>{" "}
                {validation.message}
              </AlertDescription>
            </Alert>
          ) : null}

          {validation.state === "schema-error" ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>{messages.schemaErrorTitle}</AlertTitle>
              <AlertDescription>{validation.message}</AlertDescription>
            </Alert>
          ) : null}

          {validation.state === "validated" && validation.valid ? (
            <Alert>
              <BadgeCheck />
              <AlertTitle>{messages.validTitle}</AlertTitle>
              <AlertDescription>{messages.validDescription}</AlertDescription>
            </Alert>
          ) : null}

          {validation.state === "validated" && !validation.valid ? (
            <>
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>{messages.invalidTitle}</AlertTitle>
                <AlertDescription>
                  {messages.invalidDescription}
                </AlertDescription>
              </Alert>

              <div className="rounded-xl border border-border/70">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{messages.errorPathLabel}</TableHead>
                      <TableHead>{messages.errorKeywordLabel}</TableHead>
                      <TableHead>{messages.errorMessageLabel}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validation.issues.map((issue) => (
                      <TableRow
                        key={`${issue.path}:${issue.keyword}:${issue.message}`}
                      >
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {issue.path}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {issue.keyword}
                        </TableCell>
                        <TableCell>{issue.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : null}
        </CardContent>
        {errorsJson ? (
          <CardFooter className="justify-end">
            <ToolCopyButton
              value={errorsJson}
              copyLabel={messages.copyErrorsLabel}
              copiedLabel={messages.copiedLabel}
            />
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}

export default JsonSchemaValidatorClient
