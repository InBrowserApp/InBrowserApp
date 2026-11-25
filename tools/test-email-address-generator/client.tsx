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
  EXAMPLE_DOMAINS,
  generateEmailAddresses,
  MAX_EMAIL_ADDRESSES,
} from "./core/email-addresses"
import type { EmailDomain } from "./core/email-addresses"

export type EmailMessages = typeof import("./messages/en.json")

type Props = Readonly<{ lang: string; messages: EmailMessages }>
type Result = Readonly<{ domain: EmailDomain; text: string }>

export default function TestEmailAddressClient({ lang, messages }: Props) {
  const domainId = useId()
  const quantityId = useId()
  const [ready, setReady] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [status, setStatus] = useState<"idle" | "pending" | "failed">("idle")
  const output = result?.text ?? ""
  const pending = status === "pending"
  const direction = lang === "ar" || lang === "he" ? "rtl" : "ltr"

  useEffect(() => setReady(true), [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const form = new FormData(event.currentTarget)
    const domain = form.get("domain") as EmailDomain
    const quantity = Number(form.get("quantity"))
    setStatus("pending")
    try {
      const addresses = await generateEmailAddresses(domain, quantity)
      setResult({ domain, text: addresses.join("\n") })
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
          <FieldGroup className="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <Field>
              <FieldLabel htmlFor={domainId}>{messages.domain}</FieldLabel>
              <Select
                dir={direction}
                name="domain"
                defaultValue="any"
                disabled={pending}
              >
                <SelectTrigger id={domainId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="any">{messages.anyDomain}</SelectItem>
                    {EXAMPLE_DOMAINS.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        <bdi dir="ltr">{domain}</bdi>
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
                max={MAX_EMAIL_ADDRESSES}
                defaultValue={10}
                required
                readOnly={pending}
              />
            </Field>
            <Button
              type="submit"
              disabled={!ready}
              aria-disabled={pending}
              className="aria-disabled:opacity-50"
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
            {result && (
              <>
                {" · "}
                <bdi>
                  {result.domain === "any" ? messages.anyDomain : result.domain}
                </bdi>
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
                download="test-email-addresses.txt"
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
