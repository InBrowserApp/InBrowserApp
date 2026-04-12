import { useEffect, useId, useState } from "react"

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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { RefreshCcw } from "@workspace/ui/icons"

import { rot, type RotType } from "./core/rot"

type RotCipherMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  rotTypeLabel: string
  inputLabel: string
  inputPlaceholder: string
  outputLabel: string
  outputPlaceholder: string
  rot13Description: string
  rot5Description: string
  rot18Description: string
  rot47Description: string
  copyInputLabel: string
  copyOutputLabel: string
  copiedLabel: string
  resetLabel: string
}>

type RotCipherClientProps = Readonly<{
  messages: RotCipherMessages
}>

const STORAGE_KEYS = {
  input: "tools:rot-cipher:input",
  type: "tools:rot-cipher:type",
} as const

const DEFAULT_INPUT = "Hello World! 12345"
const DEFAULT_TYPE: RotType = "rot13"

function getRotDescription(messages: RotCipherMessages, rotType: RotType) {
  switch (rotType) {
    case "rot13":
      return messages.rot13Description
    case "rot5":
      return messages.rot5Description
    case "rot18":
      return messages.rot18Description
    case "rot47":
      return messages.rot47Description
  }
}

function isRotType(value: string): value is RotType {
  return (
    value === "rot13" ||
    value === "rot5" ||
    value === "rot18" ||
    value === "rot47"
  )
}

function RotCipherClient({ messages }: RotCipherClientProps) {
  const inputId = useId()
  const outputId = useId()
  const [rotType, setRotType] = useState<RotType>(DEFAULT_TYPE)
  const [inputText, setInputText] = useState(DEFAULT_INPUT)
  const [outputText, setOutputText] = useState(() =>
    rot(DEFAULT_INPUT, DEFAULT_TYPE)
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedInput = window.localStorage.getItem(STORAGE_KEYS.input)
    const storedType = window.localStorage.getItem(STORAGE_KEYS.type)
    const nextType =
      storedType && isRotType(storedType) ? storedType : DEFAULT_TYPE
    const nextInput = storedInput ?? DEFAULT_INPUT

    setRotType(nextType)
    setInputText(nextInput)
    setOutputText(rot(nextInput, nextType))
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.input, inputText)
  }, [inputText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.type, rotType)
  }, [rotType])

  function handleInputChange(nextValue: string) {
    setInputText(nextValue)
    setOutputText(rot(nextValue, rotType))
  }

  function handleOutputChange(nextValue: string) {
    setOutputText(nextValue)
    setInputText(rot(nextValue, rotType))
  }

  function handleRotTypeChange(nextValue: string) {
    if (!isRotType(nextValue)) {
      return
    }

    setRotType(nextValue)
    setOutputText(rot(inputText, nextValue))
  }

  function handleReset() {
    setRotType(DEFAULT_TYPE)
    setInputText(DEFAULT_INPUT)
    setOutputText(rot(DEFAULT_INPUT, DEFAULT_TYPE))
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.rotTypeLabel}</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <ToggleGroup
            type="single"
            value={rotType}
            onValueChange={handleRotTypeChange}
            variant="outline"
            className="flex w-full flex-wrap"
          >
            <ToggleGroupItem value="rot13" aria-label="ROT13">
              ROT13
            </ToggleGroupItem>
            <ToggleGroupItem value="rot5" aria-label="ROT5">
              ROT5
            </ToggleGroupItem>
            <ToggleGroupItem value="rot18" aria-label="ROT18">
              ROT18
            </ToggleGroupItem>
            <ToggleGroupItem value="rot47" aria-label="ROT47">
              ROT47
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-sm leading-6 text-muted-foreground">
            {getRotDescription(messages, rotType)}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.inputLabel}</CardTitle>
            <CardDescription>{messages.inputPlaceholder}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id={inputId}
              aria-label={messages.inputLabel}
              value={inputText}
              onChange={(event) => {
                handleInputChange(event.target.value)
              }}
              className="min-h-64 resize-y font-mono text-sm"
              placeholder={messages.inputPlaceholder}
              spellCheck={false}
            />
          </CardContent>
          <CardFooter className="justify-between gap-3 border-t">
            <ToolCopyButton
              value={inputText}
              copyLabel={messages.copyInputLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              <RefreshCcw data-icon="inline-start" />
              {messages.resetLabel}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.outputLabel}</CardTitle>
            <CardDescription>{messages.outputPlaceholder}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id={outputId}
              aria-label={messages.outputLabel}
              value={outputText}
              onChange={(event) => {
                handleOutputChange(event.target.value)
              }}
              className="min-h-64 resize-y font-mono text-sm"
              placeholder={messages.outputPlaceholder}
              spellCheck={false}
            />
          </CardContent>
          <CardFooter className="justify-end border-t">
            <ToolCopyButton
              value={outputText}
              copyLabel={messages.copyOutputLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default RotCipherClient
