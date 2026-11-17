import { useEffect, useId, useRef, useState, type ChangeEvent } from "react"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, File, ArrowRight } from "@workspace/ui/icons"
import { formatBytes, MAX_BYTES, type Representation } from "./core/bytes"
import type { BinaryFormat } from "./core/typed-json"
import type { Messages } from "./types"
import { Controls } from "./controls"
import { useConversion } from "./use-conversion"

const EXAMPLE =
  '{\n  "message": "Hello, 世界",\n  "status": 200,\n  "ok": true,\n  "items": [1, 2, 3]\n}'
const BINARY_EXAMPLES = {
  cbor: "a2 62 6f 6b f5 67 6d 65 73 73 61 67 65 65 48 65 6c 6c 6f",
  msgpack: "82 a2 6f 6b c3 a7 6d 65 73 73 61 67 65 a5 48 65 6c 6c 6f",
}

export default function Client({ messages: m }: { messages: Messages }) {
  const id = useId()
  const [format, setFormat] = useState<BinaryFormat>("cbor")
  const [direction, setDirection] = useState<"encode" | "decode">("encode")
  const [representation, setRepresentation] = useState<Representation>("hex")
  const [input, setInput] = useState(EXAMPLE)
  const [extended, setExtended] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const revision = useRef(0)
  const { result, error, busy, reset, fail, run } = useConversion(m)
  useEffect(() => {
    if (error) inputRef.current?.focus()
  }, [error])
  function invalidate() {
    revision.current += 1
    reset()
  }
  function changeInput(value: string) {
    invalidate()
    setInput(value)
  }
  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    invalidate()
    const current = revision.current
    if (file.size > MAX_BYTES) {
      fail(m.sizeError)
      return
    }
    try {
      const text =
        direction === "encode"
          ? await file.text()
          : formatBytes(
              new Uint8Array(await file.arrayBuffer()),
              representation
            )
      if (revision.current === current) setInput(text)
    } catch {
      if (revision.current === current) fail(m.fileError)
    }
  }
  function download() {
    if (!result) return
    const contents =
      direction === "encode" ? new Uint8Array(result.bytes) : result.text
    const url = URL.createObjectURL(
      new Blob([contents], {
        type:
          direction === "encode"
            ? "application/octet-stream"
            : "application/json;charset=utf-8",
      })
    )
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `converted.${direction === "encode" ? (format === "cbor" ? "cbor" : "msgpack") : "json"}`
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <div className="space-y-6">
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault()
          run({ input, format, direction, representation, extended })
        }}
      >
        <Controls
          id={id}
          m={m}
          format={format}
          direction={direction}
          representation={representation}
          extended={extended}
          onFormat={(value) => {
            invalidate()
            setFormat(value)
          }}
          onDirection={(next) => {
            if (result) {
              setInput(result.text)
              if (result.typed) setExtended(true)
            }
            invalidate()
            setDirection(next)
          }}
          onRepresentation={(value) => {
            invalidate()
            setRepresentation(value)
          }}
          onExtended={(value) => {
            invalidate()
            setExtended(value)
          }}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="min-w-0">
            <CardHeader className="border-b">
              <CardTitle>
                <label htmlFor={`${id}-input`}>
                  {m.input} ·{" "}
                  {direction === "encode"
                    ? "JSON"
                    : `${format === "cbor" ? "CBOR" : "MessagePack"} (${representation})`}
                </label>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                ref={inputRef}
                id={`${id}-input`}
                name="input"
                dir="ltr"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : `${id}-limits`}
                value={input}
                onChange={(event) => changeInput(event.target.value)}
                placeholder={m.placeholder}
                className="h-80 resize-y font-mono"
              />
              <div aria-live="polite">
                {error && (
                  <p
                    id={`${id}-error`}
                    role="alert"
                    className="text-sm break-words text-destructive"
                  >
                    {m.invalid}: {error}
                  </p>
                )}
                {busy && <span className="sr-only">{m.converting}</span>}
              </div>
            </CardContent>
            <CardFooter className="flex-wrap gap-2 border-t">
              <div className="flex w-full flex-wrap items-center gap-3">
                <Button type="submit" disabled={busy || !input.trim()}>
                  <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
                  {busy ? m.converting : m.convert}
                </Button>
                {busy && (
                  <Button type="button" variant="outline" onClick={invalidate}>
                    {m.cancel}
                  </Button>
                )}
                <p
                  id={`${id}-limits`}
                  className="text-sm text-muted-foreground"
                >
                  {m.limits}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInput.current?.click()}
              >
                <File aria-hidden="true" />
                {m.import}
              </Button>
              <input
                ref={fileInput}
                hidden
                type="file"
                aria-label={m.import}
                accept={
                  direction === "encode"
                    ? ".json,.txt,application/json"
                    : ".cbor,.msgpack,.mpk,.bin,application/octet-stream"
                }
                onChange={(event) => void importFile(event)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (direction === "encode") changeInput(EXAMPLE)
                  else {
                    setRepresentation("hex")
                    changeInput(BINARY_EXAMPLES[format])
                  }
                }}
              >
                {m.example}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => changeInput("")}
              >
                {m.clear}
              </Button>
            </CardFooter>
          </Card>
          <Card className="min-w-0">
            <CardHeader className="border-b">
              <CardTitle>
                <label htmlFor={`${id}-output`}>
                  {m.output} ·{" "}
                  {direction === "decode"
                    ? "JSON"
                    : `${format === "cbor" ? "CBOR" : "MessagePack"} (${representation})`}
                </label>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                id={`${id}-output`}
                dir="ltr"
                readOnly
                spellCheck={false}
                value={result?.text || ""}
                placeholder={m.empty}
                className="h-80 resize-y font-mono"
              />
              {result && (
                <p
                  role="status"
                  className="text-sm text-muted-foreground tabular-nums"
                >
                  {m.bytes}: {result.bytes.length.toLocaleString()} ·{" "}
                  {m.jsonBytes}: {result.jsonBytes.toLocaleString()}
                </p>
              )}
              {result?.typed && direction === "decode" && (
                <p className="text-sm text-muted-foreground">{m.typedOutput}</p>
              )}
            </CardContent>
            <CardFooter className="flex-wrap justify-end gap-2 border-t">
              <ToolCopyButton
                value={result?.text || ""}
                copyLabel={m.copy}
                copiedLabel={m.copied}
                disabled={!result}
              />
              <Button
                type="button"
                size="sm"
                disabled={!result}
                onClick={download}
              >
                <Download aria-hidden="true" />
                {m.download}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
      <p className="text-sm text-muted-foreground">{m.privacy}</p>
      <details className="rounded-xl border p-4 text-sm">
        <summary className="cursor-pointer font-medium">{m.helpTitle}</summary>
        <div className="mt-4 space-y-3 break-words text-muted-foreground">
          <p>{m.helpText}</p>
          <p>{m.helpTypes}</p>
          <p>{m.helpCollision}</p>
          <p>{m.helpLimits}</p>
        </div>
      </details>
    </div>
  )
}
