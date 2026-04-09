import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
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
import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"
import { Download } from "@workspace/ui/icons"

import type { GitignoreGeneratorMessages } from "../client/types"

type PreviewCardProps = Readonly<{
  downloadUrl: string | null
  generatedContent: string
  messages: GitignoreGeneratorMessages
}>

function PreviewCard({
  downloadUrl,
  generatedContent,
  messages,
}: PreviewCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultLabel}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent>
        <ScrollArea className="h-[28rem] overflow-hidden rounded-lg border border-input bg-transparent sm:h-[32rem]">
          {generatedContent ? (
            <pre
              role="textbox"
              aria-label={messages.resultLabel}
              aria-multiline="true"
              aria-readonly="true"
              className="min-h-full min-w-max p-3 font-mono text-sm leading-6 whitespace-pre"
            >
              {generatedContent}
            </pre>
          ) : (
            <div
              role="textbox"
              aria-label={messages.resultLabel}
              aria-multiline="true"
              aria-readonly="true"
              className="flex min-h-full p-3 font-mono text-sm leading-6 text-muted-foreground"
            >
              {messages.previewPlaceholder}
            </div>
          )}
        </ScrollArea>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={generatedContent}
          copyLabel={messages.copyResultLabel}
          copiedLabel={messages.copiedLabel}
          disabled={!generatedContent}
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download=".gitignore">
              <Download data-icon="inline-start" />
              {messages.downloadGitignoreLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadGitignoreLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { PreviewCard }
