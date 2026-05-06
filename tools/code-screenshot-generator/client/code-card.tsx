import { useId, useRef, type ChangeEvent } from "react"

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
import { FileText } from "@workspace/ui/icons"

import type { CodeScreenshotGeneratorMessages } from "../types"

type CodeCardProps = Readonly<{
  code: string
  messages: CodeScreenshotGeneratorMessages
  onCodeChange: (code: string) => void
}>

function CodeCard({ code, messages, onCodeChange }: CodeCardProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    onCodeChange(await file.text())
  }

  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <CardTitle>{messages.codeTitle}</CardTitle>
        <CardDescription>{messages.codeDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          id={inputId}
          aria-label={messages.codeInputLabel}
          className="field-sizing-fixed min-h-80 max-w-full min-w-0 resize-y font-mono text-sm leading-relaxed"
          spellCheck={false}
          value={code}
          placeholder={messages.codePlaceholder}
          onChange={(event) => {
            onCodeChange(event.target.value)
          }}
        />
      </CardContent>
      <CardFooter className="justify-start border-t">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            fileInputRef.current?.click()
          }}
        >
          <FileText data-icon="inline-start" />
          {messages.importTextLabel}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.js,.jsx,.ts,.tsx,.json,.css,.html,.xml,.md,.yml,.yaml,.sh,text/*,application/json"
          aria-label={messages.importTextLabel}
          className="sr-only"
          onChange={(event) => {
            void handleFileChange(event)
          }}
        />
      </CardFooter>
    </Card>
  )
}

export { CodeCard }
