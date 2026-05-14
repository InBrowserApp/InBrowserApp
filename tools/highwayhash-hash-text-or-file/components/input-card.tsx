import { useRef, type ChangeEvent } from "react"

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

import type { HighwayHashTextOrFilePageMessages } from "../client/types"

type InputCardProps = Readonly<{
  plainTextId: string
  plainText: string
  selectedFile: File | null
  messages: HighwayHashTextOrFilePageMessages
  onPlainTextChange: (value: string) => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSwitchToText: () => void
}>

function InputCard({
  plainTextId,
  plainText,
  selectedFile,
  messages,
  onPlainTextChange,
  onFileChange,
  onSwitchToText,
}: InputCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
          <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 p-6 text-center">
            <FileText
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
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
          <Field className="flex flex-1 flex-col">
            <FieldLabel htmlFor={plainTextId}>
              {messages.plainTextLabel}
            </FieldLabel>
            <Textarea
              id={plainTextId}
              name="highwayhash-plain-text"
              aria-label={messages.plainTextLabel}
              autoComplete="off"
              spellCheck={false}
              value={plainText}
              onChange={(event) => {
                onPlainTextChange(event.target.value)
              }}
              className="min-h-64 flex-1 resize-y font-mono text-sm"
            />
          </Field>
        )}
      </CardContent>
      <CardFooter className="justify-start gap-3 border-t">
        {selectedFile ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSwitchToText}
          >
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
          <FileText data-icon="inline-start" aria-hidden="true" />
          {messages.importFromFileLabel}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          name="highwayhash-file"
          className="sr-only"
          aria-label={messages.importFromFileLabel}
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
    return `${formatNumber(size / 1024)} KB`
  }

  return `${formatNumber(size / (1024 * 1024))} MB`
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(value)
}

export { InputCard, formatFileSize }
