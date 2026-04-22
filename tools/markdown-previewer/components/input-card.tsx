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
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, RefreshCcw } from "@workspace/ui/icons"

import type { MarkdownPreviewerMessages } from "../types"

type InputCardProps = Readonly<{
  fileInputRef: RefObject<HTMLInputElement | null>
  markdown: string
  markdownId: string
  messages: MarkdownPreviewerMessages
  onClear: () => void
  onImport: (event: ChangeEvent<HTMLInputElement>) => void
  onMarkdownChange: (value: string) => void
  onUseSample: () => void
}>

function InputCard({
  fileInputRef,
  markdown,
  markdownId,
  messages,
  onClear,
  onImport,
  onMarkdownChange,
  onUseSample,
}: InputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.markdownLabel}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="gap-4">
        <label htmlFor={markdownId} className="sr-only">
          {messages.markdownLabel}
        </label>
        <Textarea
          id={markdownId}
          aria-label={messages.markdownLabel}
          spellCheck={false}
          value={markdown}
          onChange={(event) => {
            onMarkdownChange(event.target.value)
          }}
          placeholder={messages.markdownPlaceholder}
          className="min-h-96 flex-1 resize-y font-mono text-sm leading-6"
        />
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="flex flex-wrap justify-between gap-3 border-t">
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              fileInputRef.current?.click()
            }}
          >
            <FileText data-icon="inline-start" />
            {messages.importFromFileLabel}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onUseSample}>
            {messages.useSampleLabel}
          </Button>
        </div>

        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <RefreshCcw data-icon="inline-start" />
          {messages.clearTextLabel}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt,text/markdown,text/plain"
          className="sr-only"
          aria-label={messages.importFromFileLabel}
          onChange={onImport}
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { InputCard }
