import { useEffect, useId, useState } from "react"
import type { FormEvent } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Separator } from "@workspace/ui/components/ui/separator"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, RefreshCcw } from "@workspace/ui/icons"

import {
  generatePhoneNumbers,
  getDefaultPhoneCountry,
  MAX_PHONE_NUMBERS,
  PHONE_COUNTRIES,
  PHONE_FORMATS,
} from "./core/phone-numbers"
import type { PhoneCountry, PhoneFormat } from "./core/phone-numbers"

export type PhoneMessages = typeof import("./messages/en.json")

type Props = Readonly<{ lang: string; messages: PhoneMessages }>
type Result = Readonly<{
  country: PhoneCountry
  format: PhoneFormat
  text: string
}>

export default function RandomPhoneNumberClient({ lang, messages }: Props) {
  const countryId = useId()
  const quantityId = useId()
  const formatId = useId()
  const [ready, setReady] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [status, setStatus] = useState<"idle" | "pending" | "failed">("idle")

  const regionNames = new Intl.DisplayNames(lang, { type: "region" })
  const countries = PHONE_COUNTRIES.map((value) => ({
    value,
    label: regionNames.of(value) ?? value,
  })).sort((a, b) => a.label.localeCompare(b.label, lang))
  const output = result?.text ?? ""
  const pending = status === "pending"
  const direction = lang === "ar" || lang === "he" ? "rtl" : "ltr"

  useEffect(() => setReady(true), [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const form = new FormData(event.currentTarget)
    const country = form.get("country") as PhoneCountry
    const format = form.get("format") as PhoneFormat
    const quantity = Number(form.get("quantity"))
    setStatus("pending")
    try {
      const phoneNumbers = await generatePhoneNumbers(country, format, quantity)
      setResult({ country, format, text: phoneNumbers.join("\n") })
      setStatus("idle")
    } catch {
      setStatus("failed")
    }
  }

  return (
    <Card>
      <CardContent>
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="flex flex-col gap-4"
        >
          <FieldGroup className="grid items-end gap-4 sm:grid-cols-2 lg:flex lg:flex-row">
            <Field>
              <FieldLabel htmlFor={countryId}>{messages.country}</FieldLabel>
              <Select
                dir={direction}
                name="country"
                defaultValue={getDefaultPhoneCountry(lang)}
                disabled={pending}
              >
                <SelectTrigger id={countryId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {countries.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor={formatId}>{messages.format}</FieldLabel>
              <Select
                dir={direction}
                name="format"
                defaultValue="national"
                disabled={pending}
              >
                <SelectTrigger id={formatId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PHONE_FORMATS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {messages[value]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor={quantityId}>{messages.quantity}</FieldLabel>
              <Input
                id={quantityId}
                name="quantity"
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_PHONE_NUMBERS}
                defaultValue={10}
                required
                readOnly={pending}
              />
            </Field>
            <Button
              type="submit"
              disabled={!ready}
              aria-disabled={pending}
              className="shrink-0 aria-disabled:opacity-50"
            >
              <RefreshCcw data-icon="inline-start" />
              {pending ? messages.generating : messages.generate}
            </Button>
          </FieldGroup>
          {status === "failed" && (
            <p role="alert" className="text-sm text-destructive">
              {messages.error}
            </p>
          )}
        </form>
      </CardContent>
      <Separator />
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle aria-live="polite">
          <h2>
            {messages.results}
            {result &&
              ` · ${regionNames.of(result.country)} · ${messages[result.format]}`}
          </h2>
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <ToolCopyButton
            key={output}
            value={output}
            copyLabel={messages.copy}
            copiedLabel={messages.copied}
            failedLabel={messages.copyFailed}
          />
          {result && (
            <Button asChild variant="outline" size="sm">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(output)}`}
                download={`phone-numbers-${result.country.toLowerCase()}.txt`}
              >
                <Download data-icon="inline-start" />
                {messages.download}
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          aria-label={messages.results}
          value={output}
          placeholder={messages.placeholder}
          readOnly
          dir={result ? "ltr" : undefined}
          rows={6}
          className="max-h-[min(24rem,50vh)] resize-y overflow-y-auto font-mono"
        />
      </CardContent>
    </Card>
  )
}
