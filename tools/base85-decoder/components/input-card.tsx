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
import { FileText, RefreshCcw } from "@workspace/ui/icons"

import { BASE85_VARIANTS, FILE_ACCEPT, getAlphabetLabel } from "../constants"
import type { Base85Variant } from "../core/base85"
import type { Base85DecoderMessages } from "../types"

type Base85InputCardProps = Readonly<{
  messages: Base85DecoderMessages
  alphabetId: string
  base85InputId: string
  alphabetKey: Base85Variant
  base85Input: string
  sourceFileName: string | null
  fileInputRef: RefObject<HTMLInputElement | null>
  onAlphabetChange: (value: Base85Variant) => void
  onInputChange: (value: string) => void
  onLoadSample: () => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
}>

function Base85InputCard({
  messages,
  alphabetId,
  base85InputId,
  alphabetKey,
  base85Input,
  sourceFileName,
  fileInputRef,
  onAlphabetChange,
  onInputChange,
  onLoadSample,
  onFileChange,
}: Base85InputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.base85InputLabel}</CardTitle>
        <CardDescription>
          {sourceFileName
            ? `${messages.importFromFileLabel}: ${sourceFileName}`
            : messages.base85InputPlaceholder}
        </CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <div className="grid gap-2">
          <Label htmlFor={alphabetId}>{messages.alphabet}</Label>
          <Select
            value={alphabetKey}
            onValueChange={(value) => {
              onAlphabetChange(value as Base85Variant)
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
              {BASE85_VARIANTS.map((variant) => (
                <SelectItem key={variant} value={variant}>
                  {getAlphabetLabel(messages, variant)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          id={base85InputId}
          name="base85-input"
          rows={10}
          autoComplete="off"
          spellCheck={false}
          aria-label={messages.base85InputLabel}
          value={base85Input}
          onChange={(event) => {
            onInputChange(event.target.value)
          }}
          placeholder={messages.base85InputPlaceholder}
          className="min-h-72 resize-y font-mono text-sm"
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-between gap-3 border-t">
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

        <Button type="button" variant="ghost" size="sm" onClick={onLoadSample}>
          <RefreshCcw data-icon="inline-start" />
          {messages.loadSample}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept={FILE_ACCEPT}
          aria-label={messages.importFromFileLabel}
          className="sr-only"
          onChange={onFileChange}
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { Base85InputCard }
