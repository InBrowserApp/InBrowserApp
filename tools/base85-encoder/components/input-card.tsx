import { type ChangeEvent, type RefObject } from "react"

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

import type { InputCardMessages } from "../types"

type InputCardProps = Readonly<{
  inputId: string
  plainText: string
  selectedFile: File | null
  fileInputRef: RefObject<HTMLInputElement | null>
  messages: InputCardMessages
  onPlainTextChange: (value: string) => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClearFile: () => void
}>

function InputCard({
  inputId,
  plainText,
  selectedFile,
  fileInputRef,
  messages,
  onPlainTextChange,
  onFileChange,
  onClearFile,
}: InputCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputLabel}</CardTitle>
        <CardDescription>
          {selectedFile
            ? `${selectedFile.name} • ${formatFileSize(selectedFile.size)}`
            : messages.plainTextDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {selectedFile ? (
          <div className="flex min-h-72 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 p-6 text-center">
            <FileText className="size-5 text-muted-foreground" />
            <div className="grid gap-1">
              <p className="text-sm font-medium break-all text-foreground">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
        ) : (
          <Textarea
            id={inputId}
            name="plain-text"
            rows={10}
            autoComplete="off"
            aria-label={messages.inputLabel}
            value={plainText}
            onChange={(event) => {
              onPlainTextChange(event.target.value)
            }}
            placeholder={messages.inputPlaceholder}
            className="min-h-72 resize-y font-mono text-sm"
          />
        )}
      </CardContent>
      <CardFooter className="justify-start gap-3 border-t">
        {selectedFile ? (
          <Button type="button" variant="ghost" size="sm" onClick={onClearFile}>
            {messages.plainTextLabel}
          </Button>
        ) : null}

        <Button
          type="button"
          variant={selectedFile ? "outline" : "ghost"}
          size="sm"
          onClick={() => {
            fileInputRef.current?.click()
          }}
        >
          <FileText data-icon="inline-start" />
          {messages.importFromFileLabel}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="*/*"
          aria-label={messages.importFromFileLabel}
          className="sr-only"
          onChange={onFileChange}
        />
      </CardFooter>
    </Card>
  )
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export { InputCard }
