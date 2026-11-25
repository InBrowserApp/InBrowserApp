import { useId, useRef, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Eraser, FileText } from "@workspace/ui/icons"

import type english from "./messages/en.json"

export type Messages = typeof english

const FORMS = ["NFC", "NFD", "NFKC", "NFKD"] as const
const EXAMPLE = "Cafe\u0301 · ＡＢＣ ① ﬁ"
const PREVIEW_LENGTH = 40

function codePointPreview(text: string) {
  const points = []

  for (const character of text) {
    if (points.length === PREVIEW_LENGTH) {
      points.push("…")
      break
    }

    const hex = character.codePointAt(0)!.toString(16).toUpperCase()
    points.push(`U+${hex.padStart(4, "0")}`)
  }

  return points.join(" ")
}

export default function UnicodeNormalizer({
  messages,
}: Readonly<{ messages: Messages }>) {
  const id = useId()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useState("")
  const [form, setForm] = useState<(typeof FORMS)[number]>("NFC")
  const result = text.normalize(form)

  function replaceInput(value: string) {
    setText(value)
    inputRef.current?.focus()
  }

  return (
    <div className="grid gap-5">
      <fieldset className="min-w-0" aria-describedby={`${id}-form-help`}>
        <legend className="mb-2 text-sm font-medium">
          {messages.formLabel}
        </legend>
        <div className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {FORMS.map((option) => (
            <label
              key={option}
              className="inline-flex h-9 cursor-pointer items-center rounded-md px-3 font-mono text-sm hover:bg-muted has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background"
            >
              <input
                type="radio"
                value={option}
                className="sr-only"
                name={`${id}-form`}
                checked={form === option}
                onChange={() => setForm(option)}
              />
              {option}
            </label>
          ))}
        </div>
        <p
          id={`${id}-form-help`}
          className="mt-2 text-sm text-muted-foreground"
        >
          {messages[form]}
        </p>
      </fieldset>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <label htmlFor={`${id}-input`} className="text-base font-medium">
              {messages.inputLabel}
            </label>
          </CardHeader>
          <CardContent>
            <Textarea
              id={`${id}-input`}
              ref={inputRef}
              dir="auto"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={messages.inputPlaceholder}
              spellCheck={false}
              autoCapitalize="off"
              rows={7}
              className="field-sizing-fixed resize-y font-mono"
            />
          </CardContent>
          <CardFooter className="flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => replaceInput(EXAMPLE)}
              disabled={text.length > 0}
            >
              <FileText aria-hidden="true" data-icon="inline-start" />
              {messages.exampleLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => replaceInput("")}
              disabled={text.length === 0}
            >
              <Eraser aria-hidden="true" data-icon="inline-start" />
              {messages.clearLabel}
            </Button>
          </CardFooter>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <label htmlFor={`${id}-output`} className="text-base font-medium">
              {messages.outputLabel}
            </label>
          </CardHeader>
          <CardContent>
            <Textarea
              id={`${id}-output`}
              dir="auto"
              value={result}
              placeholder={messages.outputPlaceholder}
              readOnly
              spellCheck={false}
              rows={7}
              className="field-sizing-fixed resize-y font-mono"
            />
          </CardContent>
          <CardFooter className="flex-wrap gap-x-3 gap-y-2">
            <ToolCopyButton
              value={result}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
              failedLabel={messages.copyFailedLabel}
              size="default"
              variant="default"
            />
            <span role="status" className="text-sm text-muted-foreground">
              {text &&
                messages[text === result ? "unchangedLabel" : "changedLabel"]}
            </span>
          </CardFooter>
        </Card>
      </div>

      {text && (
        <details className="rounded-xl border border-border px-4">
          <summary className="cursor-pointer rounded-sm py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">
            {messages.codePointsLabel}
          </summary>
          <p className="text-sm text-muted-foreground">
            {messages.codePointsLimit}
          </p>
          <dl className="grid gap-4 py-4 md:grid-cols-2">
            {(
              [
                [messages.inputLabel, text],
                [messages.outputLabel, result],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="mb-1 text-sm font-medium">{label}</dt>
                <dd dir="ltr" className="rounded-md bg-muted p-2 text-left">
                  <code className="font-mono text-xs wrap-anywhere">
                    {codePointPreview(value)}
                  </code>
                </dd>
              </div>
            ))}
          </dl>
        </details>
      )}
    </div>
  )
}
