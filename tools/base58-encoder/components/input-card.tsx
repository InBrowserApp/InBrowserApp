import type { ChangeEvent, RefObject } from "react"

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
import { Label } from "@workspace/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, RefreshCcw, Trash2 } from "@workspace/ui/icons"

import { ALPHABET_KEYS, formatFileSize, getAlphabetLabel } from "../constants"
import { isBase58AlphabetKey, type Base58AlphabetKey } from "../core/base58"
import type { Base58EncoderMessages } from "../types"

type Base58InputCardProps = Readonly<{
  messages: Base58EncoderMessages
  alphabetId: string
  inputId: string
  alphabetKey: Base58AlphabetKey
  plainText: string
  selectedFile: File | null
  fileInputRef: RefObject<HTMLInputElement | null>
  onAlphabetChange: (value: Base58AlphabetKey) => void
  onPlainTextChange: (value: string) => void
  onLoadSample: () => void
  onClear: () => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
}>

function Base58InputCard({
  messages,
  alphabetId,
  inputId,
  alphabetKey,
  plainText,
  selectedFile,
  fileInputRef,
  onAlphabetChange,
  onPlainTextChange,
  onLoadSample,
  onClear,
  onFileChange,
}: Base58InputCardProps) {
  const description =
    selectedFile === null
      ? messages.inputPlaceholder
      : `${selectedFile.name} - ${formatFileSize(selectedFile.size)}`

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputTitle}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <div className="grid gap-2">
          <Label htmlFor={alphabetId}>{messages.alphabet}</Label>
          <Select
            value={alphabetKey}
            onValueChange={(value) => {
              if (isBase58AlphabetKey(value)) {
                onAlphabetChange(value)
              }
            }}
          >
            <SelectTrigger
              id={alphabetId}
              aria-label={messages.alphabet}
              className="w-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALPHABET_KEYS.map((value) => (
                <SelectItem key={value} value={value}>
                  {getAlphabetLabel(messages, value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedFile === null ? (
          <div className="grid gap-2">
            <Label htmlFor={inputId}>{messages.inputTitle}</Label>
            <Textarea
              id={inputId}
              name="base58-input"
              autoComplete="off"
              spellCheck={false}
              rows={10}
              aria-label={messages.inputTitle}
              value={plainText}
              onChange={(event) => {
                onPlainTextChange(event.target.value)
              }}
              placeholder={messages.inputPlaceholder}
              className="min-h-64 resize-y font-mono text-sm"
            />
          </div>
        ) : (
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
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap gap-3 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onLoadSample}>
          <RefreshCcw data-icon="inline-start" />
          {messages.loadSample}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <Trash2 data-icon="inline-start" />
          {messages.clearLabel}
        </Button>
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
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          aria-label={messages.importFromFileLabel}
          onChange={onFileChange}
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { Base58InputCard }
