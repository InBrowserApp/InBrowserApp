import { useEffect, useId, useMemo, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { BadgeCheck, TriangleAlert } from "@workspace/ui/icons"

import { DetailItem, ValueWithCopy } from "./components/result-detail"
import { validateISBN, type ISBNValidationResult } from "./core/isbn"

type IsbnMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  isbn: string
  placeholder: string
  valid: string
  invalid: string
  invalidChecksum: string
  invalidLength: string
  invalidFormat: string
  result: string
  type: string
  normalized: string
  checksum: string
  checkDigit: string
  expected: string
  actual: string
  pass: string
  fail: string
  unknown: string
  isbn10: string
  isbn13: string
  prefix: string
  digits: string
  notAvailable: string
  notConvertible: string
  copyLabel: string
  copiedLabel: string
}>

const DEFAULT_ISBN = "978-0-306-40615-7"
const STORAGE_KEY = "tools:isbn-validator:isbn"

function getFeedbackMessage(
  validation: ISBNValidationResult,
  messages: IsbnMessages
) {
  if (validation.isValid) return messages.valid
  if (!validation.isLengthValid) return messages.invalidLength
  if (!validation.isFormatValid) return messages.invalidFormat
  if (!validation.isChecksumValid) return messages.invalidChecksum
  return messages.invalid
}

function getTypeLabel(
  validation: ISBNValidationResult,
  messages: IsbnMessages
) {
  if (validation.type === "isbn-10") return messages.isbn10
  if (validation.type === "isbn-13") return messages.isbn13
  return messages.unknown
}

function getIsbn10Display(
  validation: ISBNValidationResult,
  messages: IsbnMessages
) {
  if (!validation.isValid) return messages.notAvailable
  if (validation.type === "isbn-13" && validation.prefix !== "978") {
    return messages.notConvertible
  }
  return validation.isbn10 ?? messages.notAvailable
}

function getIsbn13Display(
  validation: ISBNValidationResult,
  messages: IsbnMessages
) {
  if (!validation.isValid) return messages.notAvailable
  return validation.isbn13 ?? messages.notAvailable
}

function IsbnValidatorClient({
  messages,
}: Readonly<{ messages: IsbnMessages }>) {
  const inputId = useId()
  const [isbn, setIsbn] = useState(DEFAULT_ISBN)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (storedValue) {
      setIsbn(storedValue)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY, isbn)
  }, [isbn])

  const validation = useMemo(() => validateISBN(isbn), [isbn])
  const hasInput = isbn.length > 0
  const feedbackMessage = hasInput
    ? getFeedbackMessage(validation, messages)
    : null
  const typeLabel = getTypeLabel(validation, messages)
  const isbn10Display = getIsbn10Display(validation, messages)
  const isbn13Display = getIsbn13Display(validation, messages)
  const prefixDisplay =
    validation.type === "isbn-13" ? (validation.prefix ?? "-") : "-"
  const resultDescription =
    typeLabel +
    " / " +
    messages.checksum +
    ": " +
    (validation.isChecksumValid ? messages.pass : messages.fail)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.isbn}</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={inputId}>{messages.isbn}</FieldLabel>
              <Input
                id={inputId}
                name="isbn"
                autoComplete="off"
                spellCheck={false}
                value={isbn}
                aria-invalid={hasInput && !validation.isValid}
                placeholder={messages.placeholder}
                className="h-11 font-mono text-base"
                onChange={(event) => {
                  setIsbn(event.target.value)
                }}
              />
            </FieldContent>
          </Field>

          {feedbackMessage ? (
            <div aria-live="polite">
              {validation.isValid ? (
                <Alert>
                  <BadgeCheck />
                  <AlertTitle>{messages.valid}</AlertTitle>
                  <AlertDescription>{feedbackMessage}</AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <TriangleAlert />
                  <AlertTitle>{messages.invalid}</AlertTitle>
                  <AlertDescription>{feedbackMessage}</AlertDescription>
                </Alert>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {hasInput ? (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.result}</CardTitle>
            <CardDescription>{resultDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label={messages.type}
                content={<span className="font-medium">{typeLabel}</span>}
              />
              <DetailItem
                label={messages.checksum}
                content={
                  <Badge
                    variant={
                      validation.isChecksumValid ? "default" : "destructive"
                    }
                  >
                    {validation.isChecksumValid ? messages.pass : messages.fail}
                  </Badge>
                }
              />
              <DetailItem
                label={messages.normalized}
                content={
                  <ValueWithCopy
                    value={validation.normalized || "-"}
                    copyValue={validation.normalized || undefined}
                    copyLabel={messages.copyLabel}
                    copiedLabel={messages.copiedLabel}
                    monospace
                  />
                }
              />
              <DetailItem
                label={messages.checkDigit}
                content={
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      {messages.expected +
                        ": " +
                        (validation.expectedCheckDigit ?? "-")}
                    </span>
                    <span>
                      {messages.actual +
                        ": " +
                        (validation.actualCheckDigit ?? "-")}
                    </span>
                  </div>
                }
              />
              <DetailItem
                label={messages.isbn10}
                content={
                  <ValueWithCopy
                    value={isbn10Display}
                    copyValue={validation.isbn10 ?? undefined}
                    copyLabel={messages.copyLabel}
                    copiedLabel={messages.copiedLabel}
                    monospace
                  />
                }
              />
              <DetailItem
                label={messages.isbn13}
                content={
                  <ValueWithCopy
                    value={isbn13Display}
                    copyValue={validation.isbn13 ?? undefined}
                    copyLabel={messages.copyLabel}
                    copiedLabel={messages.copiedLabel}
                    monospace
                  />
                }
              />
              <DetailItem label={messages.prefix} content={prefixDisplay} />
              <DetailItem
                label={messages.digits}
                content={
                  <span className="font-medium">{validation.length}</span>
                }
              />
            </dl>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

export default IsbnValidatorClient
