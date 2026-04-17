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
import { validateVAT, type VATValidationResult } from "./core/vat"

import type { VatMessages } from "./types"

const DEFAULT_VAT = "BE 0123.4567.49"
const STORAGE_KEY = "tools:vat-validator:input"

function getFeedbackMessage(
  validation: VATValidationResult,
  messages: VatMessages
): string {
  if (validation.isValid) return messages.valid
  if (!validation.isCountryCodeValid) return messages.invalidCountryCode
  if (!validation.isCountrySupported) return messages.unsupportedCountry
  if (!validation.isFormatValid) return messages.invalidFormat
  if (validation.isChecksumSupported && validation.isChecksumValid === false) {
    return messages.invalidChecksum
  }
  return messages.invalid
}

function useCountryDisplayName(
  countryCode: string | null,
  locale: string
): string | null {
  return useMemo(() => {
    if (!countryCode) return null
    const regionCode = countryCode === "EL" ? "GR" : countryCode

    try {
      const displayNames = new Intl.DisplayNames([locale, "en"], {
        type: "region",
      })
      return displayNames.of(regionCode) ?? null
    } catch {
      /* v8 ignore next 2 */
      return null
    }
  }, [countryCode, locale])
}

function ChecksumBadge({
  validation,
  messages,
}: Readonly<{
  validation: VATValidationResult
  messages: VatMessages
}>) {
  if (!validation.isCountrySupported || !validation.isFormatValid) {
    return <Badge variant="secondary">{messages.notChecked}</Badge>
  }
  if (!validation.isChecksumSupported) {
    return <Badge variant="secondary">{messages.notChecked}</Badge>
  }
  return (
    <Badge variant={validation.isChecksumValid ? "default" : "destructive"}>
      {validation.isChecksumValid ? messages.pass : messages.fail}
    </Badge>
  )
}

function VatValidatorClient({
  messages,
}: Readonly<{ messages: VatMessages }>) {
  const inputId = useId()
  const [input, setInput] = useState(DEFAULT_VAT)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored !== null) setInput(stored)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, input)
  }, [input])

  const validation = useMemo(() => validateVAT(input), [input])
  const hasInput = input.length > 0
  const feedbackMessage = hasInput
    ? getFeedbackMessage(validation, messages)
    : null
  const countryName = useCountryDisplayName(
    validation.countryCode,
    messages.locale
  )
  const countryDisplay = !validation.countryCode
    ? messages.notAvailable
    : !validation.isCountryCodeValid
      ? validation.countryCode
      : countryName
        ? `${countryName} (${validation.countryCode})`
        : validation.countryCode

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.vat}</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={inputId}>{messages.vat}</FieldLabel>
              <Input
                id={inputId}
                name="vat"
                autoComplete="off"
                spellCheck={false}
                value={input}
                aria-invalid={hasInput && !validation.isValid}
                placeholder={messages.placeholder}
                className="h-11 font-mono text-base"
                onChange={(event) => {
                  setInput(event.target.value)
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
            <CardDescription>
              {countryDisplay} —{" "}
              {validation.isCountrySupported
                ? messages.supported
                : messages.unsupported}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label={messages.status}
                content={
                  <Badge
                    variant={validation.isValid ? "default" : "destructive"}
                  >
                    {validation.isValid ? messages.pass : messages.fail}
                  </Badge>
                }
              />
              <DetailItem
                label={messages.country}
                content={
                  <span className="font-medium">{countryDisplay}</span>
                }
              />
              <DetailItem
                label={messages.countryStatus}
                content={
                  <Badge
                    variant={
                      validation.isCountrySupported ? "default" : "destructive"
                    }
                  >
                    {validation.isCountrySupported
                      ? messages.supported
                      : messages.unsupported}
                  </Badge>
                }
              />
              <DetailItem
                label={messages.format}
                content={
                  <span className="font-mono text-sm">
                    {validation.formatHint ?? messages.notAvailable}
                  </span>
                }
              />
              <DetailItem
                label={messages.formatStatus}
                content={
                  validation.isCountrySupported ? (
                    <Badge
                      variant={
                        validation.isFormatValid ? "default" : "destructive"
                      }
                    >
                      {validation.isFormatValid
                        ? messages.pass
                        : messages.fail}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">{messages.notChecked}</Badge>
                  )
                }
              />
              <DetailItem
                label={messages.checksum}
                content={
                  <ChecksumBadge
                    validation={validation}
                    messages={messages}
                  />
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
                label={messages.number}
                content={
                  <ValueWithCopy
                    value={validation.number ?? messages.notAvailable}
                    copyValue={validation.number ?? undefined}
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

export default VatValidatorClient
