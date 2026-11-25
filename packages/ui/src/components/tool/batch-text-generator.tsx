"use client"

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
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Separator } from "@workspace/ui/components/ui/separator"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, RefreshCcw } from "@workspace/ui/icons"

type BatchTextGeneratorMessages = Readonly<{
  quantity: string
  generate: string
  generating: string
  results: string
  placeholder: string
  copy: string
  copied: string
  copyFailed: string
  download: string
  error: string
}>

type BatchTextGeneratorProps = Readonly<{
  messages: BatchTextGeneratorMessages
  generateBatch: (quantity: number) => Promise<string[]>
  downloadName: string
}>

export function BatchTextGenerator({
  messages,
  generateBatch,
  downloadName,
}: BatchTextGeneratorProps) {
  const quantityId = useId()
  const [output, setOutput] = useState("")
  const [status, setStatus] = useState<
    "starting" | "idle" | "pending" | "failed"
  >("starting")
  const pending = status === "pending"

  useEffect(() => setStatus("idle"), [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const quantity = Number(new FormData(event.currentTarget).get("quantity"))
    setStatus("pending")
    try {
      const values = await generateBatch(quantity)
      setOutput(values.join("\n"))
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
          className="grid items-end gap-4 sm:grid-cols-[minmax(8rem,12rem)_auto] sm:justify-start"
        >
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
          <h2 key={output}>{messages.results}</h2>
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <ToolCopyButton
            key={output}
            value={output}
            copyLabel={messages.copy}
            copiedLabel={messages.copied}
            failedLabel={messages.copyFailed}
          />
          {output && (
            <Button asChild variant="outline" size="sm">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(output)}`}
                download={downloadName}
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
          dir={output ? "ltr" : undefined}
          rows={6}
          className="max-h-[min(24rem,50vh)] resize-y overflow-y-auto font-mono"
        />
      </CardContent>
    </Card>
  )
}
