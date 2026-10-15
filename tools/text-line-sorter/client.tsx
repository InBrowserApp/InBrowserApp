import { useId, useMemo, useState } from "react"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { DEFAULT_OPTIONS, sortLines } from "./core/sort-lines"
import type english from "./messages/en.json"

export type Messages = { readonly [Key in keyof typeof english]: string }

export default function TextLineSorterClient({
  messages,
}: Readonly<{ messages: Messages }>) {
  const id = useId()
  const [input, setInput] = useState("")
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const output = useMemo(() => sortLines(input, options), [input, options])
  const toggles = [
    ["ignoreCase", messages.ignoreCaseLabel],
    ["trim", messages.trimLabel],
    ["removeBlank", messages.removeBlankLabel],
    ["deduplicate", messages.deduplicateLabel],
  ] as const

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            {messages.privacyHelp}
          </p>
          <label htmlFor={`${id}-input`} className="font-medium">
            {messages.inputLabel}
          </label>
          <Textarea
            id={`${id}-input`}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={messages.inputPlaceholder}
            rows={8}
            spellCheck={false}
            className="font-mono"
          />
          <label htmlFor={`${id}-order`} className="font-medium">
            {messages.orderLabel}
          </label>
          <select
            id={`${id}-order`}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={options.descending ? "descending" : "ascending"}
            onChange={(event) =>
              setOptions({
                ...options,
                descending: event.target.value === "descending",
              })
            }
            aria-describedby={`${id}-ordering`}
          >
            <option value="ascending">{messages.ascendingLabel}</option>
            <option value="descending">{messages.descendingLabel}</option>
          </select>
          <div className="flex flex-wrap gap-4">
            {toggles.map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={options[key]}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, [key]: checked === true })
                  }
                />
                {label}
              </label>
            ))}
          </div>
          <p id={`${id}-ordering`} className="text-sm text-muted-foreground">
            {messages.orderingHelp}
          </p>
          <p className="text-sm text-muted-foreground">
            {messages.lineEndingHelp}
          </p>
          <Button
            type="button"
            variant="outline"
            className="justify-self-end"
            onClick={() => {
              setInput("")
              setOptions(DEFAULT_OPTIONS)
            }}
          >
            {messages.resetLabel}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="grid gap-4">
          <label htmlFor={`${id}-output`} className="font-medium">
            {messages.outputLabel}
          </label>
          <Textarea
            id={`${id}-output`}
            value={output}
            readOnly
            rows={8}
            spellCheck={false}
            className="font-mono"
          />
          <ToolCopyButton
            value={output}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            className="justify-self-end"
          />
        </CardContent>
      </Card>
    </div>
  )
}
