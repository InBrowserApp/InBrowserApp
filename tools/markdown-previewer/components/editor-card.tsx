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
import { FileText, Sparkles, Trash2 } from "@workspace/ui/icons"

import type { MarkdownPreviewerMessages } from "../types"

type EditorCardProps = Readonly<{
  messages: MarkdownPreviewerMessages
  markdown: string
  textareaId: string
  onMarkdownChange: (value: string) => void
  onImportClick: () => void
  onLoadSample: () => void
  onClear: () => void
}>

function EditorCard({
  messages,
  markdown,
  textareaId,
  onMarkdownChange,
  onImportClick,
  onLoadSample,
  onClear,
}: EditorCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.editorTitle}</CardTitle>
        <CardDescription>{messages.editorDescription}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="gap-4 p-6">
        <label htmlFor={textareaId} className="sr-only">
          {messages.sourceLabel}
        </label>

        <Textarea
          id={textareaId}
          aria-label={messages.sourceLabel}
          value={markdown}
          onChange={(event) => {
            onMarkdownChange(event.target.value)
          }}
          placeholder={messages.sourcePlaceholder}
          spellCheck={false}
          className="min-h-[28rem] flex-1 resize-y font-mono text-sm leading-6"
        />
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="flex flex-wrap justify-start gap-3 border-t px-6 py-4">
        <Button type="button" variant="ghost" size="sm" onClick={onImportClick}>
          <FileText data-icon="inline-start" />
          {messages.importLabel}
        </Button>

        <Button type="button" variant="ghost" size="sm" onClick={onLoadSample}>
          <Sparkles data-icon="inline-start" />
          {messages.loadSampleLabel}
        </Button>

        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <Trash2 data-icon="inline-start" />
          {messages.clearLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { EditorCard }
