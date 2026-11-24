import { useId, useRef, useState } from "react"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ArrowLeftRight,
  Download,
  FolderInput,
  Sparkles,
} from "@workspace/ui/icons"

type Messages = Readonly<{
  direction: string
  example: string
  openFile: string
  convert: string
  copy: string
  copied: string
  download: string
  empty: string
  invalid: string
  swap: string
}>

type Format = Readonly<{
  name: string
  extension: string
  accept: string
  example: string
}>

type Props = Readonly<{
  formats: readonly [Format, Format]
  messages: Messages
  convert: (input: string, reverse: boolean) => string
}>

function TextFormatConverter({ formats, messages, convert }: Props) {
  const errorId = useId()
  const picker = useRef<HTMLInputElement>(null)
  const fileRead = useRef(0)
  const [reverse, setReverse] = useState(false)
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [invalid, setInvalid] = useState(false)
  const [source, target] = reverse ? [formats[1], formats[0]] : formats

  function reset(text: string, direction = reverse) {
    fileRead.current++
    setReverse(direction)
    setInput(text)
    setOutput("")
    setInvalid(false)
  }

  function run(text: string, direction = reverse) {
    reset(text, direction)
    try {
      setOutput(convert(text.trim(), direction))
    } catch {
      setInvalid(true)
    }
  }

  async function open(file: File) {
    const read = ++fileRead.current
    const matches = formats.map((format) =>
      format.accept
        .split(",")
        .some((extension) => file.name.toLowerCase().endsWith(extension))
    )
    const direction = matches[0] === matches[1] ? reverse : matches[1]
    try {
      const text = await file.text()
      if (read === fileRead.current) run(text, direction)
    } catch {
      if (read === fileRead.current) {
        setOutput("")
        setInvalid(true)
      }
    }
  }

  function download() {
    const url = URL.createObjectURL(
      new Blob([output], { type: "text/plain;charset=utf-8" })
    )
    const link = document.createElement("a")
    link.href = url
    link.download = `converted.${target.extension}`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (input.trim()) run(input)
      }}
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-sm font-medium">
          {messages.direction}
          <select
            dir="ltr"
            className="h-9 rounded-md border border-input bg-background px-3"
            value={String(reverse)}
            onChange={(event) => reset(input, event.target.value === "true")}
          >
            <option value="false">
              {formats[0].name} → {formats[1].name}
            </option>
            <option value="true">
              {formats[1].name} → {formats[0].name}
            </option>
          </select>
        </label>
        <Button
          type="button"
          variant="outline"
          onClick={() => picker.current?.click()}
        >
          <FolderInput aria-hidden="true" />
          {messages.openFile}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => run(source.example)}
        >
          <Sparkles aria-hidden="true" />
          {messages.example}
        </Button>
        <input
          ref={picker}
          type="file"
          hidden
          accept={formats.map(({ accept }) => accept).join(",")}
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ""
            if (file) void open(file)
          }}
        />
      </div>
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardContent className="grid gap-3">
            <label className="grid gap-2 font-medium">
              {source.name}
              <Textarea
                dir="ltr"
                rows={10}
                spellCheck={false}
                value={input}
                aria-invalid={invalid}
                aria-describedby={invalid ? errorId : undefined}
                onChange={(event) => reset(event.target.value)}
                className="field-sizing-fixed min-w-0 font-mono text-sm"
              />
            </label>
            <Button
              type="submit"
              className="justify-self-start"
              disabled={!input.trim()}
            >
              {messages.convert}
            </Button>
            {invalid && (
              <p
                id={errorId}
                role="status"
                className="text-sm text-destructive"
              >
                {messages.invalid}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardContent className="grid gap-3">
            <label className="grid gap-2 font-medium">
              {target.name}
              <Textarea
                dir="ltr"
                rows={10}
                spellCheck={false}
                value={output}
                readOnly
                placeholder={messages.empty}
                className="field-sizing-fixed min-w-0 font-mono text-sm"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <ToolCopyButton
                value={output}
                copyLabel={messages.copy}
                copiedLabel={messages.copied}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!output}
                onClick={download}
              >
                <Download aria-hidden="true" />
                {messages.download}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={!output}
                onClick={() => run(output, !reverse)}
              >
                <ArrowLeftRight aria-hidden="true" />
                {messages.swap}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}

export { TextFormatConverter }
