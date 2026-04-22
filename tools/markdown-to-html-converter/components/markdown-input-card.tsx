import type { ChangeEvent, RefObject } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, RefreshCcw, Sparkles } from "@workspace/ui/icons"

import type { MetricsProps, MarkdownToHtmlMessages } from "../client/types"

type MarkdownInputCardProps = Readonly<{
  messages: MarkdownToHtmlMessages
  markdown: string
  textareaId: string
  fileInputRef: RefObject<HTMLInputElement | null>
  onMarkdownChange: (value: string) => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onLoadSample: () => void
  onReset: () => void
}> &
  MetricsProps

function MarkdownInputCard({
  messages,
  markdown,
  metrics,
  textareaId,
  fileInputRef,
  onMarkdownChange,
  onFileChange,
  onLoadSample,
  onReset,
}: MarkdownInputCardProps) {
  return (
    <ToolPanelCard className="border border-border/70 bg-gradient-to-b from-card via-card to-muted/20">
      <CardHeader className="gap-4 border-b">
        <div className="flex flex-col gap-1.5">
          <CardTitle>{messages.markdownLabel}</CardTitle>
          <CardDescription>{messages.markdownDescription}</CardDescription>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            {messages.charactersLabel} {metrics.characters}
          </Badge>
          <Badge variant="outline">
            {messages.linesLabel} {metrics.lines}
          </Badge>
        </div>
      </CardHeader>

      <ToolPanelCardContent className="gap-4">
        <Textarea
          id={textareaId}
          aria-label={messages.markdownLabel}
          value={markdown}
          spellCheck={false}
          placeholder={messages.markdownPlaceholder}
          onChange={(event) => {
            onMarkdownChange(event.target.value)
          }}
          className="min-h-[28rem] flex-1 resize-y border-border/70 bg-background/80 font-mono text-sm leading-6 [tab-size:2]"
        />
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="flex flex-wrap justify-start gap-3 border-t">
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
          <Sparkles data-icon="inline-start" />
          {messages.loadSampleLabel}
        </Button>

        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt,text/markdown,text/plain"
          aria-label={messages.importFromFileLabel}
          className="sr-only"
          onChange={onFileChange}
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { MarkdownInputCard }
