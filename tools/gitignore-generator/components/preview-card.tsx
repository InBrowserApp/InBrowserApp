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
import { Textarea } from "@workspace/ui/components/ui/textarea"
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
        <Textarea
          value={generatedContent}
          readOnly
          placeholder={messages.previewPlaceholder}
          aria-label={messages.resultLabel}
          className="min-h-96 flex-1 resize-none font-mono text-sm leading-6"
        />
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
