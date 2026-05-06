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
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText } from "@workspace/ui/icons"

import type { CrcChecksumCalculatorPageMessages } from "../client/types"

type CrcInputCardProps = Readonly<{
  messages: CrcChecksumCalculatorPageMessages
  plainTextId: string
  plainText: string
  selectedFile: File | null
  fileInputRef: RefObject<HTMLInputElement | null>
  onTextChange: (text: string) => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClearFile: () => void
}>

function CrcInputCard({
  messages,
  plainTextId,
  plainText,
  selectedFile,
  fileInputRef,
  onTextChange,
  onFileChange,
  onClearFile,
}: CrcInputCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputLabel}</CardTitle>
        <CardDescription>
          {selectedFile
            ? messages.selectedFileDescription
            : messages.plainTextDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {selectedFile ? (
          <SelectedFilePanel selectedFile={selectedFile} />
        ) : (
          <Field className="flex flex-1 flex-col">
            <FieldLabel htmlFor={plainTextId}>
              {messages.plainTextLabel}
            </FieldLabel>
            <Textarea
              id={plainTextId}
              aria-label={messages.plainTextLabel}
              spellCheck={false}
              value={plainText}
              onChange={(event) => {
                onTextChange(event.target.value)
              }}
              className="min-h-64 flex-1 resize-y font-mono text-sm"
            />
          </Field>
        )}
      </CardContent>
      <CardFooter className="justify-start gap-3 border-t">
        {selectedFile ? (
          <Button type="button" variant="ghost" size="sm" onClick={onClearFile}>
            {messages.switchToTextLabel}
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
          className="sr-only"
          aria-label={messages.importFromFileLabel}
          onChange={onFileChange}
        />
      </CardFooter>
    </Card>
  )
}

function SelectedFilePanel({ selectedFile }: Readonly<{ selectedFile: File }>) {
  return (
    <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 p-6 text-center">
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
  )
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${formatNumber(size / 1024)} KB`
  }

  return `${formatNumber(size / (1024 * 1024))} MB`
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(value)
}

export { CrcInputCard }
