import { useId, useRef, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent, CardFooter } from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Eraser, FileText } from "@workspace/ui/icons"

import { convertToPinyin, type ToneFormat } from "./core/convert-to-pinyin"
import type english from "./messages/en.json"

export type Messages = Readonly<typeof english>

const FORMATS = [
  { id: "symbol", label: "marksLabel", example: "nǐ hǎo" },
  { id: "num", label: "numbersLabel", example: "ni3 hao3" },
  { id: "none", label: "plainLabel", example: "ni hao" },
] as const

export default function PinyinConverter({
  messages,
  example,
}: Readonly<{ messages: Messages; example: string }>) {
  const id = useId()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLTextAreaElement>(null)
  const [input, setInput] = useState("")
  const [format, setFormat] = useState<ToneFormat>("symbol")
  const output = convertToPinyin(input, format)

  return (
    <Card>
      <CardContent className="grid gap-5 md:grid-cols-2">
        <div className="grid min-w-0 content-end gap-2">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <label htmlFor={`${id}-input`} className="text-base font-medium">
              {messages.inputLabel}
            </label>
            <div className="flex flex-wrap items-center gap-1">
              <Button
                type="button"
                size="sm"
                className="min-h-9"
                variant="ghost"
                disabled={input.length > 0}
                onClick={() => {
                  setInput(example)
                  outputRef.current?.focus()
                }}
              >
                <FileText aria-hidden="true" data-icon="inline-start" />
                {messages.exampleLabel}
              </Button>
              <Button
                type="button"
                size="sm"
                className="min-h-9"
                variant="ghost"
                disabled={input.length === 0}
                onClick={() => {
                  setInput("")
                  inputRef.current?.focus()
                }}
              >
                <Eraser aria-hidden="true" data-icon="inline-start" />
                {messages.clearLabel}
              </Button>
            </div>
          </div>
          <Textarea
            ref={inputRef}
            id={`${id}-input`}
            dir="auto"
            lang="zh"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={messages.inputPlaceholder}
            spellCheck={false}
            autoCapitalize="off"
            className="field-sizing-fixed h-36 resize-none leading-relaxed md:h-48 md:text-base"
          />
        </div>
        <div className="grid min-w-0 content-end gap-2">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <label htmlFor={`${id}-output`} className="text-base font-medium">
              {messages.outputLabel}
            </label>
            <ToolCopyButton
              key={output}
              value={output}
              className="min-h-9"
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
              failedLabel={messages.copyFailedLabel}
            />
          </div>
          <Textarea
            ref={outputRef}
            id={`${id}-output`}
            dir="ltr"
            lang="zh-Latn"
            value={output}
            placeholder={messages.outputPlaceholder}
            readOnly
            spellCheck={false}
            className="field-sizing-fixed h-36 resize-none bg-muted/40 leading-relaxed md:h-48 md:text-base"
          />
        </div>
      </CardContent>
      <CardFooter className="md:grid md:grid-cols-2 md:gap-5">
        <fieldset className="w-full max-w-full min-w-0 md:col-start-2 md:w-auto md:justify-self-start">
          <legend className="mb-2 text-sm font-medium">
            {messages.formatLabel}
          </legend>
          <div className="grid grid-cols-3 gap-1 rounded-lg border bg-background p-1">
            {FORMATS.map((option) => (
              <label
                key={option.id}
                className="grid min-w-0 cursor-pointer content-center gap-0.5 rounded-md px-2 py-1.5 text-center text-xs font-medium break-words text-muted-foreground hover:bg-muted/60 has-checked:bg-muted has-checked:font-semibold has-checked:text-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring sm:px-4 sm:text-sm"
              >
                <input
                  type="radio"
                  name={`${id}-tone`}
                  value={option.id}
                  checked={format === option.id}
                  onChange={() => setFormat(option.id)}
                  className="sr-only"
                />
                {messages[option.label]}
                <span
                  aria-hidden="true"
                  dir="ltr"
                  lang="zh-Latn"
                  className="text-xs font-normal text-muted-foreground"
                >
                  {option.example}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </CardFooter>
    </Card>
  )
}
