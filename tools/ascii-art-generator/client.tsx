import { useEffect, useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

import { DEFAULT_FONT, DEFAULT_TEXT, STORAGE_KEYS } from "./client/constants"
import { fontNames, loadFont } from "./client/font-loader"
import { renderAsciiArt } from "./core/generate-ascii-art"
import type { AsciiArtGeneratorMessages } from "./types"

type AsciiArtGeneratorClientProps = Readonly<{
  messages: AsciiArtGeneratorMessages
}>

function AsciiArtGeneratorClient({ messages }: AsciiArtGeneratorClientProps) {
  const textInputId = useId()
  const fontSelectId = useId()

  const [text, setText] = useState(DEFAULT_TEXT)
  const [font, setFont] = useState(DEFAULT_FONT)
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(true)

  // Restore persisted state from localStorage
  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)
    const storedFont = window.localStorage.getItem(STORAGE_KEYS.font)

    if (storedText !== null) {
      setText(storedText)
    }
    if (storedFont !== null && fontNames.includes(storedFont)) {
      setFont(storedFont)
    }
  }, [])

  // Persist text to localStorage
  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.text, text)
  }, [text])

  // Persist font to localStorage
  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.font, font)
  }, [font])

  // Load font and generate output whenever text or font changes
  useEffect(() => {
    let cancelled = false

    async function generate() {
      setLoading(true)
      try {
        await loadFont(font)
        if (cancelled) return
        setOutput(renderAsciiArt(text, font))
      } catch {
        if (cancelled) return
        setOutput("")
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void generate()

    return () => {
      cancelled = true
    }
  }, [text, font])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.inputLabel}</CardTitle>
            <CardDescription>{messages.inputDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id={textInputId}
              aria-label={messages.inputLabel}
              value={text}
              onChange={(event) => {
                setText(event.target.value)
              }}
              placeholder={messages.inputPlaceholder}
              className="font-mono"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.fontLabel}</CardTitle>
            <CardDescription>{messages.fontDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={font} onValueChange={setFont}>
              <SelectTrigger
                id={fontSelectId}
                aria-label={messages.fontLabel}
                className="w-full"
              >
                <SelectValue placeholder={messages.fontLabel} />
              </SelectTrigger>
              <SelectContent>
                {fontNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.outputLabel}</CardTitle>
          <CardDescription>
            {loading ? "..." : messages.outputPlaceholder}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <pre
            role="region"
            aria-label={messages.outputLabel}
            className="min-h-48 w-full overflow-x-auto rounded-lg border border-input bg-transparent p-3 font-mono text-sm leading-tight"
          >
            {output}
          </pre>
        </CardContent>
        <CardFooter className="justify-end border-t">
          <ToolCopyButton
            value={output}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            disabled={output.length === 0}
          />
        </CardFooter>
      </Card>
    </div>
  )
}

export default AsciiArtGeneratorClient
