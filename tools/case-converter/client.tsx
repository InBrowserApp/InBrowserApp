import { useDeferredValue, useEffect, useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { RefreshCcw } from "@workspace/ui/icons"

import { CASE_TYPES, type CaseType, convertCase } from "./core/convert-case"

type CaseConverterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  inputLabel: string
  inputPlaceholder: string
  inputDescription: string
  clearLabel: string
  copyLabel: string
  copiedLabel: string
}>

type CaseConverterClientProps = Readonly<{
  messages: CaseConverterMessages
}>

const STORAGE_KEY = "tools:case-converter:input"
const DEFAULT_INPUT = "Hello World Example"

function CaseOutputCard({
  label,
  value,
  copyLabel,
  copiedLabel,
}: Readonly<{
  label: CaseType
  value: string
  copyLabel: string
  copiedLabel: string
}>) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <code className="block rounded bg-muted px-3 py-2 font-mono text-sm break-all">
          {value || "\u2014"}
        </code>
      </CardContent>
      <CardFooter className="justify-end">
        <ToolCopyButton
          value={value}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          variant="ghost"
        />
      </CardFooter>
    </Card>
  )
}

function CaseConverterClient({ messages }: CaseConverterClientProps) {
  const inputId = useId()
  const [inputText, setInputText] = useState(DEFAULT_INPUT)
  const deferredInput = useDeferredValue(inputText)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      setInputText(stored)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY, inputText)
  }, [inputText])

  function handleClear() {
    setInputText("")
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.inputLabel}</CardTitle>
          <CardDescription>{messages.inputDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id={inputId}
            name="case-input"
            autoComplete="off"
            rows={3}
            aria-label={messages.inputLabel}
            value={inputText}
            onChange={(event) => {
              setInputText(event.target.value)
            }}
            className="resize-y font-mono text-sm"
            placeholder={messages.inputPlaceholder}
          />
        </CardContent>
        <CardFooter className="justify-end border-t">
          <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
            <RefreshCcw data-icon="inline-start" />
            {messages.clearLabel}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CASE_TYPES.map((caseType) => (
          <CaseOutputCard
            key={caseType}
            label={caseType}
            value={convertCase(deferredInput, caseType)}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
          />
        ))}
      </div>
    </div>
  )
}

export default CaseConverterClient
