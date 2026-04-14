import { useEffect, useId, useMemo, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Label } from "@workspace/ui/components/ui/label"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { RefreshCcw } from "@workspace/ui/icons"

import {
  DEFAULT_CASE,
  DEFAULT_SEPARATOR,
  generateSlug,
  isSlugCase,
  isSlugSeparator,
  type SlugCase,
  type SlugSeparator,
} from "./core/slug"

type SlugGeneratorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  inputLabel: string
  inputPlaceholder: string
  outputLabel: string
  outputPlaceholder: string
  separatorLabel: string
  hyphenLabel: string
  underscoreLabel: string
  dotLabel: string
  caseLabel: string
  lowercaseLabel: string
  preserveLabel: string
  copyLabel: string
  copiedLabel: string
  clearLabel: string
}>

type SlugGeneratorClientProps = Readonly<{
  messages: SlugGeneratorMessages
}>

const STORAGE_KEYS = {
  input: "tools:slug-generator:input",
  separator: "tools:slug-generator:separator",
  case: "tools:slug-generator:case",
} as const

const DEFAULT_INPUT = "Hello World Example"

function SlugGeneratorClient({ messages }: SlugGeneratorClientProps) {
  const inputId = useId()
  const separatorId = useId()
  const caseId = useId()

  const [input, setInput] = useState(DEFAULT_INPUT)
  const [separator, setSeparator] = useState<SlugSeparator>(DEFAULT_SEPARATOR)
  const [slugCase, setSlugCase] = useState<SlugCase>(DEFAULT_CASE)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedInput = window.localStorage.getItem(STORAGE_KEYS.input)
    const storedSeparator = window.localStorage.getItem(STORAGE_KEYS.separator)
    const storedCase = window.localStorage.getItem(STORAGE_KEYS.case)

    if (storedInput !== null) {
      setInput(storedInput)
    }

    if (storedSeparator !== null && isSlugSeparator(storedSeparator)) {
      setSeparator(storedSeparator)
    }

    if (storedCase !== null && isSlugCase(storedCase)) {
      setSlugCase(storedCase)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.input, input)
  }, [input])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.separator, separator)
  }, [separator])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.case, slugCase)
  }, [slugCase])

  const slugOutput = useMemo(
    () => generateSlug(input, separator, slugCase),
    [input, separator, slugCase]
  )

  function handleClear() {
    setInput("")
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.inputLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id={inputId}
            name="input-text"
            autoComplete="off"
            rows={4}
            aria-label={messages.inputLabel}
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
            }}
            className="min-h-24 resize-y text-sm"
            placeholder={messages.inputPlaceholder}
          />
        </CardContent>
        <CardFooter className="flex-wrap justify-between gap-4 border-t">
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor={separatorId}>{messages.separatorLabel}</Label>
              <ToggleGroup
                id={separatorId}
                type="single"
                variant="outline"
                value={separator}
                onValueChange={(value) => {
                  if (value && isSlugSeparator(value)) {
                    setSeparator(value)
                  }
                }}
              >
                <ToggleGroupItem value="-" aria-label={messages.hyphenLabel}>
                  - ({messages.hyphenLabel})
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="_"
                  aria-label={messages.underscoreLabel}
                >
                  _ ({messages.underscoreLabel})
                </ToggleGroupItem>
                <ToggleGroupItem value="." aria-label={messages.dotLabel}>
                  . ({messages.dotLabel})
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={caseId}>{messages.caseLabel}</Label>
              <ToggleGroup
                id={caseId}
                type="single"
                variant="outline"
                value={slugCase}
                onValueChange={(value) => {
                  if (value && isSlugCase(value)) {
                    setSlugCase(value)
                  }
                }}
              >
                <ToggleGroupItem
                  value="lower"
                  aria-label={messages.lowercaseLabel}
                >
                  {messages.lowercaseLabel}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="preserve"
                  aria-label={messages.preserveLabel}
                >
                  {messages.preserveLabel}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
            <RefreshCcw data-icon="inline-start" />
            {messages.clearLabel}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.outputLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          {slugOutput ? (
            <code className="block text-sm break-all text-foreground">
              {slugOutput}
            </code>
          ) : (
            <p className="text-sm text-muted-foreground">
              {messages.outputPlaceholder}
            </p>
          )}
        </CardContent>
        <CardFooter className="justify-end border-t">
          <ToolCopyButton
            value={slugOutput}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            variant="ghost"
          />
        </CardFooter>
      </Card>
    </div>
  )
}

export default SlugGeneratorClient
