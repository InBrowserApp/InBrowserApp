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

import type { RobotsTxtGeneratorPageMessages } from "../client/types"

type OutputCardProps = Readonly<{
  messages: RobotsTxtGeneratorPageMessages
  robotsContent: string
  downloadUrl: string | null
}>

function OutputCard({ messages, robotsContent, downloadUrl }: OutputCardProps) {
  const hasOutput = robotsContent.trim().length > 0

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.output}</CardTitle>
        <CardDescription>{messages.outputDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {hasOutput ? (
          <Textarea
            name="robots-output"
            readOnly
            spellCheck={false}
            rows={12}
            aria-label={messages.output}
            value={robotsContent}
            className="min-h-72 resize-y font-mono text-sm"
          />
        ) : (
          <div className="flex min-h-72 flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
            {messages.emptyOutput}
          </div>
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex-wrap justify-end gap-3 border-t">
        <ToolCopyButton
          value={robotsContent}
          copyLabel={messages.copyOutput}
          copiedLabel={messages.copiedOutput}
          disabled={!hasOutput}
        />
        {downloadUrl === null ? (
          <Button type="button" variant="ghost" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.download}
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="sm" asChild>
            <a href={downloadUrl} download="robots.txt">
              <Download data-icon="inline-start" />
              {messages.download}
            </a>
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { OutputCard }
