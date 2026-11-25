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
  generateNames,
  getDefaultNameLocale,
  MAX_NAMES,
  NAME_LOCALES,
  NAME_TYPES,
} from "./core/names"
import type { NameLocale, NameType } from "./core/names"

export type NameMessages = typeof import("./messages/en.json")

type Props = Readonly<{ lang: string; messages: NameMessages }>
type Result = Readonly<{ locale: NameLocale; type: NameType; text: string }>

export default function RandomNameClient({ lang, messages }: Props) {
  const localeId = useId()
  const quantityId = useId()
  const typeId = useId()
  const [locale, setLocale] = useState(() => getDefaultNameLocale(lang))
  const [type, setType] = useState<NameType>("full")
  const [result, setResult] = useState<Result | null>(null)
  const [status, setStatus] = useState<"idle" | "pending" | "failed">("idle")

  const languageNames = new Intl.DisplayNames(lang, { type: "language" })
  const locales = NAME_LOCALES.map((value) => ({
    value,
    label: languageNames.of(value) ?? value,
  })).sort((a, b) => a.label.localeCompare(b.label, lang))
  const output = result?.text ?? ""
  const pending = status === "pending"
  const direction = lang === "ar" || lang === "he" ? "rtl" : "ltr"

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const quantity = Number(new FormData(event.currentTarget).get("quantity"))
    setStatus("pending")
    try {
      const names = await generateNames(locale, type, quantity)
      setResult({ locale, type, text: names.join("\n") })
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
              <FieldLabel htmlFor={localeId}>{messages.locale}</FieldLabel>
              <Select
                dir={direction}
                value={locale}
                onValueChange={(value) => setLocale(value as NameLocale)}
                disabled={pending}
              >
                <SelectTrigger id={localeId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {locales.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor={typeId}>{messages.nameType}</FieldLabel>
              <Select
                dir={direction}
                value={type}
                onValueChange={(value) => setType(value as NameType)}
                disabled={pending}
              >
                <SelectTrigger id={typeId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {NAME_TYPES.map((value) => (
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
                max={MAX_NAMES}
                defaultValue={10}
                required
                disabled={pending}
              />
            </Field>
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
            {result &&
              ` · ${languageNames.of(result.locale)} · ${messages[result.type]}`}
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
                download={`names-${result.locale.toLowerCase()}.txt`}
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
          dir={result ? "auto" : undefined}
          rows={6}
        />
      </CardContent>
    </Card>
  )
}
