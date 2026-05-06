import type { ChangeEvent, RefObject } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText } from "@workspace/ui/icons"

import { formatBytes } from "./validation"

import type { AesEncryptorMessages } from "./types"

function InputCard({
  fileInputId,
  fileInputRef,
  messages,
  selectedFile,
  text,
  textInputId,
  onFileChange,
  onFileClear,
  onTextChange,
}: Readonly<{
  fileInputId: string
  fileInputRef: RefObject<HTMLInputElement | null>
  messages: AesEncryptorMessages
  selectedFile: File | null
  text: string
  textInputId: string
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFileClear: () => void
  onTextChange: (value: string) => void
}>) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputCardTitle}</CardTitle>
        <CardDescription>{messages.inputCardDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <Field>
          <FieldLabel htmlFor={textInputId}>
            {messages.textInputLabel}
          </FieldLabel>
          <Textarea
            id={textInputId}
            value={text}
            disabled={Boolean(selectedFile)}
            spellCheck={false}
            className="min-h-44 resize-y font-mono text-sm"
            placeholder={messages.textInputPlaceholder}
            onChange={(event) => onTextChange(event.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={fileInputId}>
            {messages.fileInputLabel}
          </FieldLabel>
          <FieldDescription>{messages.fileInputDescription}</FieldDescription>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText data-icon="inline-start" />
              {messages.chooseFileLabel}
            </Button>
            {selectedFile ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onFileClear}
              >
                {messages.clearFileLabel}
              </Button>
            ) : null}
          </div>
          <input
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            className="sr-only"
            onChange={onFileChange}
          />
          {selectedFile ? (
            <FieldDescription>
              {messages.selectedFileLabel}: {selectedFile.name} (
              {formatBytes(selectedFile.size)})
            </FieldDescription>
          ) : null}
        </Field>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { InputCard }
