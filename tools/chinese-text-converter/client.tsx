import { useId, useMemo, useRef, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Eraser } from "@workspace/ui/icons"

import type english from "./messages/en.json"

export type Messages = typeof english

const directions = ["toTraditional", "toSimplified"] as const
type Direction = (typeof directions)[number]

const traditionalLanguages = {
  t: "zh-Hant",
  tw: "zh-TW",
  twp: "zh-TW",
  hk: "zh-HK",
} as const
type Variant = keyof typeof traditionalLanguages
const variants = Object.keys(traditionalLanguages) as Variant[]

const examples: Record<Direction, string> = {
  toTraditional: "后来，发型师帮我剪了头发。\n我把照片发给了朋友。",
  toSimplified: "後來，髮型師幫我剪了頭髮。\n我把照片發給了朋友。",
}

const selectClass =
  "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
const editorClass =
  "field-sizing-fixed min-h-32 resize-y leading-relaxed md:min-h-56"

export default function ChineseTextConverterClient({
  lang,
  messages,
}: Readonly<{ lang: string; messages: Messages }>) {
  const id = useId()
  const [direction, setDirection] = useState<Direction>(
    lang === "zh-TW" ? "toSimplified" : "toTraditional"
  )
  const [variant, setVariant] = useState<Variant>(
    lang === "zh-TW" ? "twp" : "t"
  )
  const [input, setInput] = useState("")
  const [dictionary, setDictionary] = useState<
    typeof import("opencc-js") | "loading" | "error"
  >()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const toTraditional = direction === "toTraditional"

  const convert = useMemo(() => {
    if (!dictionary || typeof dictionary === "string") return
    return dictionary.Converter({
      from: toTraditional ? "cn" : variant,
      to: toTraditional ? variant : "cn",
    })
  }, [dictionary, toTraditional, variant])
  const output = useMemo(() => convert?.(input) ?? "", [convert, input])
  const loading = input !== "" && dictionary === "loading"
  const failed = input !== "" && dictionary === "error"

  function updateInput(value: string) {
    setInput(value)
    if (value && !dictionary) {
      setDictionary("loading")
      void import("opencc-js").then(setDictionary, () => setDictionary("error"))
    }
  }

  return (
    <Card>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 font-medium">
            {messages.directionLabel}
            <select
              className={selectClass}
              value={direction}
              onChange={(event) =>
                setDirection(event.target.value as Direction)
              }
            >
              {directions.map((option) => (
                <option key={option} value={option}>
                  {messages[option]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 font-medium">
            {messages.variantLabel}
            <select
              className={selectClass}
              value={variant}
              onChange={(event) => setVariant(event.target.value as Variant)}
            >
              {variants.map((option) => (
                <option key={option} value={option}>
                  {messages.variants[option]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid min-w-0 gap-1.5">
            <div className="flex min-h-8 flex-wrap items-center justify-between gap-x-2">
              <label htmlFor={`${id}-input`} className="font-semibold">
                {messages.inputLabel}
              </label>
              <div className="flex flex-wrap items-center gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={input !== ""}
                  onClick={() => updateInput(examples[direction])}
                >
                  {messages.exampleLabel}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={input === ""}
                  onClick={() => {
                    setInput("")
                    inputRef.current?.focus()
                  }}
                >
                  <Eraser data-icon="inline-start" />
                  {messages.clearLabel}
                </Button>
              </div>
            </div>
            <Textarea
              id={`${id}-input`}
              ref={inputRef}
              lang={toTraditional ? "zh-Hans" : traditionalLanguages[variant]}
              dir="auto"
              spellCheck={false}
              className={editorClass}
              value={input}
              onChange={(event) => updateInput(event.target.value)}
              placeholder={messages.inputPlaceholder}
            />
          </div>

          <div className="grid min-w-0 gap-1.5">
            <div className="flex min-h-8 flex-wrap items-center justify-between gap-x-2">
              <label htmlFor={`${id}-output`} className="font-semibold">
                {messages.outputLabel}
              </label>
              <ToolCopyButton
                value={output}
                copyLabel={messages.copyLabel}
                copiedLabel={messages.copiedLabel}
                failedLabel={messages.copyFailedLabel}
                variant="default"
              />
            </div>
            <Textarea
              id={`${id}-output`}
              lang={toTraditional ? traditionalLanguages[variant] : "zh-Hans"}
              dir="auto"
              readOnly
              className={`${editorClass} bg-muted/40`}
              value={output}
              placeholder={
                loading ? messages.loading : messages.outputPlaceholder
              }
            />
          </div>
        </div>
        <p role="status" className={failed ? "text-destructive" : "sr-only"}>
          {failed ? messages.loadError : loading ? messages.loading : ""}
        </p>
      </CardContent>
    </Card>
  )
}
