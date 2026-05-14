import { useRef, useState, type DragEvent } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, ImageUp, RefreshCcw, Trash2 } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { formatByteSize, isLikelySvgMarkup } from "../core/svg-optimizer"

import type { InputMode, SvgOptimizerMessages } from "./types"

type InputCardProps = Readonly<{
  fileName: string
  inputId: string
  messages: SvgOptimizerMessages
  mode: InputMode
  onClear: () => void
  onFilesSelected: (files: readonly File[]) => void
  onLoadSample: () => void
  onModeChange: (mode: InputMode) => void
  onTextChange: (value: string) => void
  previewUrl: string | null
  selectedFile: File | null
  sourceText: string
}>

function ModeToggle({
  messages,
  mode,
  onModeChange,
}: Pick<InputCardProps, "messages" | "mode" | "onModeChange">) {
  return (
    <Field>
      <FieldLabel>{messages.inputModeLabel}</FieldLabel>
      <ToggleGroup
        aria-label={messages.inputModeLabel}
        className="grid w-full grid-cols-2"
        onValueChange={(value) => {
          if (value === "file" || value === "code") {
            onModeChange(value)
          }
        }}
        type="single"
        value={mode}
        variant="outline"
      >
        <ToggleGroupItem value="file">
          <ImageUp data-icon="inline-start" />
          {messages.uploadModeLabel}
        </ToggleGroupItem>
        <ToggleGroupItem value="code">
          <FileText data-icon="inline-start" />
          {messages.pasteModeLabel}
        </ToggleGroupItem>
      </ToggleGroup>
    </Field>
  )
}

function SourcePreview({
  fileName,
  messages,
  previewUrl,
  selectedFile,
  sourceText,
}: Pick<
  InputCardProps,
  "fileName" | "messages" | "previewUrl" | "selectedFile" | "sourceText"
>) {
  if (!sourceText || !previewUrl || !isLikelySvgMarkup(sourceText)) {
    return null
  }

  const sourceSize = selectedFile?.size ?? formatByteSizeBytes(sourceText)

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="min-w-0 truncate text-sm font-medium">{fileName}</span>
        <Badge variant="secondary">{formatByteSize(sourceSize)}</Badge>
      </div>
      <div className="flex min-h-44 items-center justify-center rounded-lg border bg-background p-3">
        <img
          alt={messages.sourcePreviewLabel}
          className="max-h-56 max-w-full object-contain"
          src={previewUrl}
        />
      </div>
    </div>
  )
}

function formatByteSizeBytes(value: string) {
  return new TextEncoder().encode(value).byteLength
}

export function InputCard({
  fileName,
  inputId,
  messages,
  mode,
  onClear,
  onFilesSelected,
  onLoadSample,
  onModeChange,
  onTextChange,
  previewUrl,
  selectedFile,
  sourceText,
}: InputCardProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasInvalidCode = Boolean(sourceText) && !isLikelySvgMarkup(sourceText)

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setIsDraggingOver(true)
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDraggingOver(false)
    onFilesSelected(Array.from(event.dataTransfer.files))
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{messages.inputTitle}</CardTitle>
        <CardDescription>{messages.inputDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <ModeToggle
          messages={messages}
          mode={mode}
          onModeChange={onModeChange}
        />

        {mode === "file" ? (
          <label
            aria-label={messages.chooseSvgLabel}
            className="flex cursor-pointer"
            htmlFor={inputId}
            onDragLeave={() => {
              setIsDraggingOver(false)
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {selectedFile && previewUrl ? (
              <span
                className={cn(
                  "block w-full rounded-lg border border-dashed p-3 transition-colors",
                  isDraggingOver
                    ? "border-primary bg-primary/5"
                    : "border-border/80 bg-muted/20 hover:border-foreground/20"
                )}
              >
                <SourcePreview
                  fileName={fileName}
                  messages={messages}
                  previewUrl={previewUrl}
                  selectedFile={selectedFile}
                  sourceText={sourceText}
                />
              </span>
            ) : (
              <Empty
                className={cn(
                  "min-h-72 flex-1 border border-dashed border-border/80 bg-muted/30 transition-colors hover:border-foreground/20 hover:bg-muted/45",
                  isDraggingOver && "border-primary bg-primary/5"
                )}
              >
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ImageUp />
                  </EmptyMedia>
                  <EmptyTitle>{messages.chooseSvgLabel}</EmptyTitle>
                  <EmptyDescription>{messages.uploadHint}</EmptyDescription>
                  <EmptyDescription>
                    {messages.supportedFormatsLabel}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </label>
        ) : (
          <Field data-invalid={hasInvalidCode}>
            <FieldLabel htmlFor="svg-optimizer-code">
              {messages.codeLabel}
            </FieldLabel>
            <Textarea
              aria-invalid={hasInvalidCode}
              className="min-h-72 font-mono text-sm"
              id="svg-optimizer-code"
              onChange={(event) => {
                onTextChange(event.target.value)
              }}
              placeholder={messages.codePlaceholder}
              value={sourceText}
            />
            <FieldDescription>{messages.uploadHint}</FieldDescription>
            <FieldError>
              {hasInvalidCode ? messages.invalidSvgError : null}
            </FieldError>
          </Field>
        )}

        {mode === "code" ? (
          <SourcePreview
            fileName={fileName}
            messages={messages}
            previewUrl={previewUrl}
            selectedFile={selectedFile}
            sourceText={sourceText}
          />
        ) : null}

        <input
          accept=".svg,image/svg+xml"
          className="sr-only"
          data-testid="svg-optimizer-file-input"
          id={inputId}
          ref={inputRef}
          onChange={(event) => {
            onFilesSelected(Array.from(event.target.files ?? []))
            event.target.value = ""
          }}
          type="file"
        />
      </CardContent>
      <CardFooter className="flex flex-col-reverse gap-3 border-t sm:flex-row sm:justify-end">
        <Button onClick={onLoadSample} type="button" variant="outline">
          <FileText data-icon="inline-start" />
          {messages.loadSampleLabel}
        </Button>
        {sourceText ? (
          <Button onClick={onClear} type="button" variant="outline">
            <Trash2 data-icon="inline-start" />
            {messages.removeSourceLabel}
          </Button>
        ) : null}
        {mode === "file" && selectedFile ? (
          <Button
            onClick={() => inputRef.current?.click()}
            type="button"
            variant="outline"
          >
            <RefreshCcw data-icon="inline-start" />
            {messages.changeFileLabel}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}
