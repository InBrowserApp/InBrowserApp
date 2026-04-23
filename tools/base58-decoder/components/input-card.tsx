import { type ChangeEvent, type RefObject } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, RefreshCcw } from "@workspace/ui/icons"

import type { Base58DecoderPageMessages } from "../types"

type InputCardProps = Readonly<{
  accept: string
  base58Input: string
  inputId: string
  fileInputRef: RefObject<HTMLInputElement | null>
  hasInvalidInput: boolean
  messages: Base58DecoderPageMessages
  sourceFileName: string | null
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onInputChange: (nextValue: string) => void
  onReset: () => void
}>

function InputCard({
  accept,
  base58Input,
  inputId,
  fileInputRef,
  hasInvalidInput,
  messages,
  sourceFileName,
  onFileChange,
  onInputChange,
  onReset,
}: InputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputTitle}</CardTitle>
        <CardDescription>
          {sourceFileName
            ? `${messages.importFromFileLabel}: ${sourceFileName}`
            : messages.inputPlaceholder}
        </CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Textarea
          id={inputId}
          name="base58-input"
          rows={10}
          autoComplete="off"
          spellCheck={false}
          aria-label={messages.inputTitle}
          aria-invalid={hasInvalidInput}
          value={base58Input}
          onChange={(event) => {
            onInputChange(event.target.value)
          }}
          placeholder={messages.inputPlaceholder}
          className="min-h-72 resize-y font-mono text-sm"
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-between gap-3 border-t">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            fileInputRef.current?.click()
          }}
        >
          <FileText data-icon="inline-start" />
          {messages.importFromFileLabel}
        </Button>

        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          aria-label={messages.importFromFileLabel}
          className="sr-only"
          onChange={(event) => {
            void onFileChange(event)
          }}
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { InputCard }
