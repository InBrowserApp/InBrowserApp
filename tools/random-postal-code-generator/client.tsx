import { useId, useState } from "react"
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
import { Separator } from "@workspace/ui/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, RefreshCcw } from "@workspace/ui/icons"

import {
  generatePostalCodes,
  getDefaultPostalCountry,
  MAX_POSTAL_CODES,
  POSTAL_COUNTRIES,
} from "./core/postal-codes"
import type { PostalCountry, ZipFormat } from "./core/postal-codes"

export type PostalCodeMessages = typeof import("./messages/en.json")

type Props = Readonly<{ lang: string; messages: PostalCodeMessages }>
type Result = Readonly<{
  country: PostalCountry
  format: ZipFormat
  text: string
}>

export default function RandomPostalCodeClient({ lang, messages }: Props) {
  const countryId = useId()
  const quantityId = useId()
  const formatId = useId()
  const [country, setCountry] = useState(() => getDefaultPostalCountry(lang))
  const [zipFormat, setZipFormat] = useState<ZipFormat>("zip5")
  const [result, setResult] = useState<Result | null>(null)
  const [status, setStatus] = useState<"idle" | "pending" | "failed">("idle")

  const regionNames = new Intl.DisplayNames(lang, { type: "region" })
  const countries = POSTAL_COUNTRIES.map((value) => ({
    value,
    label: regionNames.of(value) ?? value,
  })).sort((a, b) => a.label.localeCompare(b.label, lang))
  const output = result?.text ?? ""
  const pending = status === "pending"
  const zipLabels = { zip5: messages.zip5, zip4: "ZIP+4" }
  const direction = lang === "ar" || lang === "he" ? "rtl" : "ltr"

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const quantity = Number(new FormData(event.currentTarget).get("quantity"))
    setStatus("pending")
    try {
      const codes = await generatePostalCodes(country, quantity, zipFormat)
      setResult({ country, format: zipFormat, text: codes.join("\n") })
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
                value={country}
                onValueChange={(value) => setCountry(value as PostalCountry)}
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
              <FieldLabel htmlFor={quantityId}>{messages.quantity}</FieldLabel>
              <Input
                id={quantityId}
                name="quantity"
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_POSTAL_CODES}
                defaultValue={10}
                required
                disabled={pending}
              />
            </Field>
            {country === "US" && (
              <Field>
                <FieldLabel htmlFor={formatId}>{messages.zipFormat}</FieldLabel>
                <Select
                  dir={direction}
                  value={zipFormat}
                  onValueChange={(value) => setZipFormat(value as ZipFormat)}
                  disabled={pending}
                >
                  <SelectTrigger id={formatId} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="zip5">{zipLabels.zip5}</SelectItem>
                      <SelectItem value="zip4">{zipLabels.zip4}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
            <Button type="submit" disabled={pending} className="shrink-0">
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
            {result && ` · ${regionNames.of(result.country)}`}
            {result?.country === "US" && ` · ${zipLabels[result.format]}`}
          </h2>
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <ToolCopyButton
            value={output}
            copyLabel={messages.copy}
            copiedLabel={messages.copied}
          />
          {result && (
            <Button asChild variant="outline" size="sm">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(output)}`}
                download={`postal-codes-${result.country.toLowerCase()}.txt`}
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
          className="font-mono"
        />
      </CardContent>
    </Card>
  )
}
