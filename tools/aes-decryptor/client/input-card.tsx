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

import type { AesDecryptorMessages } from "./types"

function InputCard({
  fileInputId,
  fileInputRef,
  jsonInput,
  jsonInputId,
  messages,
  selectedFile,
  onFileChange,
  onFileClear,
  onJsonInputChange,
}: Readonly<{
  fileInputId: string
  fileInputRef: RefObject<HTMLInputElement | null>
  jsonInput: string
  jsonInputId: string
  messages: AesDecryptorMessages
  selectedFile: File | null
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFileClear: () => void
  onJsonInputChange: (value: string) => void
}>) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputCardTitle}</CardTitle>
        <CardDescription>{messages.inputCardDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <Field>
          <FieldLabel htmlFor={jsonInputId}>
            {messages.jsonInputLabel}
          </FieldLabel>
          <Textarea
            id={jsonInputId}
            value={jsonInput}
            disabled={Boolean(selectedFile)}
            spellCheck={false}
            className="min-h-56 resize-y font-mono text-xs"
            placeholder={messages.jsonInputPlaceholder}
            onChange={(event) => onJsonInputChange(event.target.value)}
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
            accept="application/json,.json"
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
