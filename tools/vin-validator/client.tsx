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
import { validateVIN, type VINValidationResult } from "./core/vin"

type VinMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  vin: string
  placeholder: string
  valid: string
  invalid: string
  invalidLength: string
  invalidCharacters: string
  invalidChecksum: string
  result: string
  status: string
  length: string
  lengthCheck: string
  characterCheck: string
  checkDigit: string
  expected: string
  actual: string
  normalized: string
  pass: string
  fail: string
  notAvailable: string
  allowedCharacters: string
  copyLabel: string
  copiedLabel: string
}>

const DEFAULT_VIN = "1M8GDM9AXKP042788"
const STORAGE_KEY = "tools:vin-validator:vin"

function getFeedbackMessage(
  validation: VINValidationResult,
  messages: VinMessages
) {
  if (validation.isValid) return messages.valid
  if (!validation.isLengthValid) return messages.invalidLength
  if (!validation.isCharacterValid) return messages.invalidCharacters
  if (!validation.isCheckDigitValid) return messages.invalidChecksum
  return messages.invalid
}

function VinValidatorClient({ messages }: Readonly<{ messages: VinMessages }>) {
  const inputId = useId()
  const [vin, setVin] = useState(DEFAULT_VIN)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (storedValue) {
      setVin(storedValue)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY, vin)
  }, [vin])

  const validation = useMemo(() => validateVIN(vin), [vin])
  const hasInput = vin.length > 0
  const feedbackMessage = hasInput
    ? getFeedbackMessage(validation, messages)
    : null
  const resultDescription = hasInput
    ? messages.status +
      ": " +
      (validation.isValid ? messages.valid : messages.invalid) +
      " / " +
      messages.checkDigit +
      ": " +
      (validation.isCheckDigitValid ? messages.pass : messages.fail)
    : ""

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.vin}</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={inputId}>{messages.vin}</FieldLabel>
              <Input
                id={inputId}
                name="vin"
                autoComplete="off"
                spellCheck={false}
                value={vin}
                aria-invalid={hasInput && !validation.isValid}
                placeholder={messages.placeholder}
                className="h-11 font-mono text-base"
                onChange={(event) => {
                  setVin(event.target.value)
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
                label={messages.status}
                content={
                  <Badge
                    variant={validation.isValid ? "default" : "destructive"}
                  >
                    {validation.isValid ? messages.valid : messages.invalid}
                  </Badge>
                }
              />
              <DetailItem
                label={messages.length}
                content={
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {validation.normalized.length + " / 17"}
                    </span>
                    <Badge
                      variant={
                        validation.isLengthValid ? "default" : "destructive"
                      }
                    >
                      {validation.isLengthValid ? messages.pass : messages.fail}
                    </Badge>
                  </div>
                }
              />
              <DetailItem
                label={messages.lengthCheck}
                content={
                  <Badge
                    variant={
                      validation.isLengthValid ? "default" : "destructive"
                    }
                  >
                    {validation.isLengthValid ? messages.pass : messages.fail}
                  </Badge>
                }
              />
              <DetailItem
                label={messages.characterCheck}
                content={
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={
                        validation.isCharacterValid ? "default" : "destructive"
                      }
                    >
                      {validation.isCharacterValid
                        ? messages.pass
                        : messages.fail}
                    </Badge>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {messages.allowedCharacters}
                    </span>
                  </div>
                }
              />
              <DetailItem
                label={messages.checkDigit}
                content={
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={
                        validation.isCheckDigitValid
                          ? "default"
                          : validation.expectedCheckDigit
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {validation.isCheckDigitValid
                        ? messages.pass
                        : validation.expectedCheckDigit
                          ? messages.fail
                          : messages.notAvailable}
                    </Badge>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      <span>
                        {messages.expected +
                          ": " +
                          (validation.expectedCheckDigit ??
                            messages.notAvailable)}
                      </span>
                      <span>
                        {messages.actual +
                          ": " +
                          (validation.actualCheckDigit ??
                            messages.notAvailable)}
                      </span>
                    </div>
                  </div>
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
            </dl>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

export default VinValidatorClient
