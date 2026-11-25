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

import type { DateFormat } from "./core/dates"

export type DateMessages = typeof import("./messages/en.json")

type Props = Readonly<{ lang: string; messages: DateMessages }>
type Result = Readonly<{
  start: string
  end: string
  format: DateFormat
  text: string
}>

const minDate = "0001-01-01"
const maxDate = "9999-12-31"

function readCalendarDate(form: HTMLFormElement, name: "start" | "end") {
  const input = form.elements.namedItem(name) as HTMLInputElement
  return input.valueAsDate!.toISOString().slice(0, 10)
}

export default function RandomDateClient({ lang, messages }: Props) {
  const startId = useId()
  const endId = useId()
  const formatId = useId()
  const quantityId = useId()
  const rangeErrorId = useId()
  const [result, setResult] = useState<Result | null>(null)
  const [status, setStatus] = useState<
    "starting" | "idle" | "pending" | "invalid-range" | "failed"
  >("starting")
  const output = result?.text ?? ""
  const pending = status === "pending"
  const invalidRange = status === "invalid-range"
  const direction = lang === "ar" || lang === "he" ? "rtl" : "ltr"

  useEffect(() => setStatus("idle"), [])

  function clearRangeError() {
    if (invalidRange) setStatus("idle")
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const start = readCalendarDate(event.currentTarget, "start")
    const end = readCalendarDate(event.currentTarget, "end")
    if (end < start) {
      setStatus("invalid-range")
      return
    }

    const form = new FormData(event.currentTarget)
    const format = form.get("format") as DateFormat
    const count = Number(form.get("quantity"))
    setStatus("pending")
    try {
      const { generateDates } = await import("./core/dates")
      const dates = generateDates({ start, end, format, count, lang })
      setResult({ start, end, format, text: dates.join("\n") })
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
              <FieldLabel htmlFor={startId}>{messages.start}</FieldLabel>
              <Input
                id={startId}
                name="start"
                type="date"
                min={minDate}
                max={maxDate}
                defaultValue="2020-01-01"
                required
                readOnly={pending}
                onChange={clearRangeError}
              />
            </Field>
            <Field data-invalid={invalidRange || undefined}>
              <FieldLabel htmlFor={endId}>{messages.end}</FieldLabel>
              <Input
                id={endId}
                name="end"
                type="date"
                min={minDate}
                max={maxDate}
                defaultValue="2030-12-31"
                required
                readOnly={pending}
                aria-invalid={invalidRange || undefined}
                aria-describedby={invalidRange ? rangeErrorId : undefined}
                onChange={clearRangeError}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={formatId}>{messages.format}</FieldLabel>
              <Select
                dir={direction}
                name="format"
                defaultValue="iso"
                disabled={pending}
              >
                <SelectTrigger id={formatId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="iso">{messages.iso}</SelectItem>
                    <SelectItem value="localized">
                      {messages.localized}
                    </SelectItem>
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
                max={1000}
                defaultValue={10}
                required
                readOnly={pending}
              />
            </Field>
            <Button
              type="submit"
              disabled={status === "starting"}
              aria-disabled={pending}
              className="shrink-0 aria-disabled:opacity-50"
            >
              <RefreshCcw data-icon="inline-start" />
              {pending ? messages.generating : messages.generate}
            </Button>
          </FieldGroup>
          {invalidRange && (
            <p
              id={rangeErrorId}
              role="alert"
              className="text-sm text-destructive"
            >
              {messages.invalidRange}
            </p>
          )}
          {status === "failed" && (
            <p role="alert" className="text-sm text-destructive">
              {messages.error}
            </p>
          )}
        </form>
      </CardContent>
      <Separator />
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle aria-live="polite" aria-atomic="true">
          <h2 key={result?.text}>
            {messages.results}
            {result && (
              <>
                {" · "}
                <bdi dir="ltr">
                  {result.start === result.end
                    ? result.start
                    : `${result.start} – ${result.end}`}
                </bdi>
                {` · ${messages[result.format]}`}
              </>
            )}
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
                download="random-dates.txt"
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
          dir={result?.format === "iso" ? "ltr" : undefined}
          rows={6}
          className="max-h-[min(24rem,50vh)] resize-y overflow-y-auto font-mono"
        />
      </CardContent>
    </Card>
  )
}
