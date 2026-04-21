import type { ChangeEvent, RefObject } from "react"

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

import type { Shake256HashTextOrFilePageMessages } from "../client/types"

type HashInputCardProps = Readonly<{
  fileInputRef: RefObject<HTMLInputElement | null>
  messages: Shake256HashTextOrFilePageMessages
  plainText: string
  plainTextId: string
  selectedFile: File | null
  onClearFile: () => void
  onImportFile: (file: File) => void
  onPlainTextChange: (value: string) => void
}>

function HashInputCard({
  fileInputRef,
  messages,
  plainText,
  plainTextId,
  selectedFile,
  onClearFile,
  onImportFile,
  onPlainTextChange,
}: HashInputCardProps) {
  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0]
    event.target.value = ""

    if (!nextFile) {
      return
    }

    onImportFile(nextFile)
  }

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
          <Field className="flex flex-1 flex-col">
            <FieldLabel htmlFor={plainTextId}>
              {messages.plainTextLabel}
            </FieldLabel>
            <Textarea
              id={plainTextId}
              aria-label={messages.plainTextLabel}
              className="min-h-64 flex-1 resize-y font-mono text-sm"
              spellCheck={false}
              value={plainText}
              onChange={(event) => {
                onPlainTextChange(event.target.value)
              }}
            />
          </Field>
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
          className="sr-only"
          aria-label={messages.importFromFileLabel}
          onChange={(event) => {
            void handleFileChange(event)
          }}
        />
      </CardFooter>
    </Card>
  )
}

function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 B"
  }

  const units = ["B", "KB", "MB", "GB"] as const
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )
  const value = bytes / 1024 ** exponent

  return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`
}

export { HashInputCard }
