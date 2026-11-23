import { useId, useState } from "react"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { applyJsonPatch } from "./core/apply-json-patch"
import type english from "./messages/en.json"

export type Messages = { readonly [Key in keyof typeof english]: string }

const sampleJson = JSON.stringify({ status: "draft", tags: ["api"] }, null, 2)
const samplePatch = JSON.stringify(
  [
    { op: "test", path: "/status", value: "draft" },
    { op: "replace", path: "/status", value: "published" },
    { op: "add", path: "/tags/-", value: "release" },
  ],
  null,
  2
)

export default function JsonPatchApplierClient({
  messages,
}: Readonly<{ messages: Messages }>) {
  const id = useId()
  const [original, setOriginal] = useState("")
  const [patch, setPatch] = useState("")
  const [result, setResult] = useState<ReturnType<typeof applyJsonPatch>>()
  const originalError =
    result?.kind === "error" && result.reason === "invalidOriginal"
  const patchError =
    result?.kind === "error" &&
    (result.reason === "invalidPatch" || result.reason === "patchNotArray")

  const output = result?.kind === "success" ? result.text : undefined
  const resultStatus =
    output !== undefined
      ? messages.resultLabel
      : result?.kind === "success"
        ? messages.documentRemoved
        : messages.resultHint

  function resetInputs(original: string, patch: string) {
    setOriginal(original)
    setPatch(patch)
    setResult(undefined)
  }

  return (
    <div className="grid gap-6">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          setResult(applyJsonPatch(original, patch))
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              key: "original",
              label: messages.originalLabel,
              placeholder: messages.originalPlaceholder,
              value: original,
              setValue: setOriginal,
              invalid: originalError,
            },
            {
              key: "patch",
              label: messages.patchLabel,
              placeholder: messages.patchPlaceholder,
              value: patch,
              setValue: setPatch,
              invalid: patchError,
            },
          ].map(({ key, label, placeholder, value, setValue, invalid }) => (
            <Card key={key} className="min-w-0">
              <CardContent className="grid gap-3">
                <label className="font-medium" htmlFor={`${id}-${key}`}>
                  {label}
                </label>
                <Textarea
                  id={`${id}-${key}`}
                  value={value}
                  placeholder={placeholder}
                  onChange={(event) => {
                    setValue(event.target.value)
                    setResult(undefined)
                  }}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? `${id}-error` : undefined}
                  rows={10}
                  dir="ltr"
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  className="field-sizing-fixed font-mono"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={!original.trim() || !patch.trim()}>
            {messages.applyLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => resetInputs(sampleJson, samplePatch)}
          >
            {messages.sampleLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!original && !patch}
            onClick={() => resetInputs("", "")}
          >
            {messages.clearLabel}
          </Button>
        </div>
      </form>

      {result?.kind === "error" && (
        <div
          role="alert"
          id={`${id}-error`}
          className="rounded-lg border border-destructive/40 p-4 text-sm text-destructive"
        >
          {messages[result.reason]}
        </div>
      )}

      {result?.kind === "operationError" && (
        <div
          role="alert"
          className="grid gap-2 rounded-lg border border-destructive/40 p-4 text-sm"
        >
          <p className="font-semibold text-destructive">
            {messages.operationFailed.replace(
              "{number}",
              String(result.number)
            )}
          </p>
          <dl className="flex flex-wrap gap-x-5 gap-y-1">
            {(
              [
                [messages.operationLabel, result.op],
                [messages.pathLabel, result.path],
                [messages.fromLabel, result.from],
              ] as const
            ).map(
              ([label, value]) =>
                value !== undefined && (
                  <div key={label} className="flex min-w-0 gap-2">
                    <dt className="shrink-0 font-medium">{label}</dt>
                    <dd className="min-w-0 font-mono wrap-anywhere" dir="ltr">
                      {JSON.stringify(value)}
                    </dd>
                  </div>
                )
            )}
          </dl>
          <p>{messages[result.reason]}</p>
          <p className="text-muted-foreground">{messages.stoppedHint}</p>
        </div>
      )}

      <Card className="min-w-0">
        <CardContent className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id={`${id}-result`} className="font-medium">
              {messages.resultLabel}
            </h2>
            {output !== undefined && (
              <ToolCopyButton
                value={output}
                copyLabel={messages.copyLabel}
                copiedLabel={messages.copiedLabel}
              />
            )}
          </div>
          {output !== undefined && (
            <Textarea
              aria-labelledby={`${id}-result`}
              value={output}
              readOnly
              rows={10}
              dir="ltr"
              spellCheck={false}
              className="field-sizing-fixed font-mono"
            />
          )}
          <p
            role="status"
            className={
              output !== undefined ? "sr-only" : "text-sm text-muted-foreground"
            }
          >
            {resultStatus}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
