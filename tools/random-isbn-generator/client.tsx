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
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
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

import { generateIsbns } from "./core/isbns"
import type { IsbnFormat } from "./core/isbns"

export type IsbnMessages = typeof import("./messages/en.json")

type Props = Readonly<{ lang: string; messages: IsbnMessages }>
type Result = Readonly<{ variant: IsbnFormat["variant"]; text: string }>

export default function RandomIsbnClient({ lang, messages }: Props) {
  const formatId = useId()
  const quantityId = useId()
  const hyphensId = useId()
  const [result, setResult] = useState<Result | null>(null)
  const [status, setStatus] = useState<
    "starting" | "idle" | "pending" | "failed"
  >("starting")
  const pending = status === "pending"
  const output = result?.text ?? ""
  const direction = lang === "ar" || lang === "he" ? "rtl" : "ltr"

  useEffect(() => setStatus("idle"), [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const form = new FormData(event.currentTarget)
    const variant = form.get("variant") === "10" ? 10 : 13
    const separator = form.has("hyphens") ? "-" : ""
    const quantity = Number(form.get("quantity"))
    setStatus("pending")
    try {
      const isbns = await generateIsbns({ variant, separator }, quantity)
      setResult({ variant, text: isbns.join("\n") })
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
          className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]"
        >
          <Field>
            <FieldLabel htmlFor={formatId}>{messages.format}</FieldLabel>
            <Select
              name="variant"
              defaultValue="13"
              dir={direction}
              disabled={pending}
            >
              <SelectTrigger id={formatId} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="13">ISBN-13</SelectItem>
                  <SelectItem value="10">ISBN-10</SelectItem>
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
          <Field orientation="horizontal" className="min-h-8">
            <Checkbox
              id={hyphensId}
              name="hyphens"
              defaultChecked
              disabled={pending}
            />
            <FieldLabel htmlFor={hyphensId}>{messages.hyphens}</FieldLabel>
          </Field>
          <Button
            type="submit"
            disabled={status === "starting"}
            aria-disabled={pending}
            className="aria-disabled:opacity-50"
          >
            <RefreshCcw data-icon="inline-start" />
            {pending ? messages.generating : messages.generate}
          </Button>
          {status === "failed" && (
            <p
              role="alert"
              className="text-sm text-destructive sm:col-span-full"
            >
              {messages.error}
            </p>
          )}
        </form>
      </CardContent>
      <Separator />
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle aria-live="polite" aria-atomic="true">
          <h2 key={output}>
            {messages.results}
            {result && (
              <>
                {" · "}
                <bdi dir="ltr">ISBN-{result.variant}</bdi>
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
                download="random-isbns.txt"
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
