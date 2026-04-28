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
    <ToolPanelCard className="min-w-0">
      <CardHeader className="gap-1.5 border-b px-5 py-5 sm:px-6">
        <CardTitle className="text-pretty">{messages.editorTitle}</CardTitle>
        <CardDescription className="max-w-2xl text-pretty">
          {messages.editorDescription}
        </CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="p-4 sm:p-5">
        <label htmlFor={textareaId} className="sr-only">
          {messages.sourceLabel}
        </label>

        <Textarea
          id={textareaId}
          name="markdown-source"
          aria-label={messages.sourceLabel}
          autoComplete="off"
          value={markdown}
          onChange={(event) => {
            onMarkdownChange(event.target.value)
          }}
          placeholder={messages.sourcePlaceholder}
          spellCheck={false}
          className="[field-sizing:fixed] min-h-[22rem] min-w-0 flex-1 resize-y font-mono text-sm leading-6 sm:min-h-[24rem]"
        />
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="flex flex-wrap justify-start gap-2 border-t px-5 py-3 sm:px-6">
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
