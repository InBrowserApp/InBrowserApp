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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"
import { Download, FileText } from "@workspace/ui/icons"

import type { RobotsTxtGeneratorMessages } from "../client/types"

type OutputCardProps = Readonly<{
  downloadUrl: string | null
  hasOutput: boolean
  messages: RobotsTxtGeneratorMessages
  robotsContent: string
}>

function OutputCard({
  downloadUrl,
  hasOutput,
  messages,
  robotsContent,
}: OutputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.output}</CardTitle>
        <CardDescription>{messages.outputDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="min-h-0 gap-4 xl:h-[calc(100vh-16rem)]">
        {hasOutput ? (
          <div
            role="region"
            aria-label={messages.output}
            className="flex min-h-80 flex-1 overflow-hidden rounded-xl border border-border/70 bg-muted/10 xl:min-h-0"
          >
            <ScrollArea className="h-full w-full">
              <pre className="min-h-full p-4 font-mono text-sm leading-6 break-all whitespace-pre-wrap text-foreground">
                {robotsContent}
              </pre>
            </ScrollArea>
          </div>
        ) : (
          <Empty className="min-h-80 flex-1 border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{messages.output}</EmptyTitle>
              <EmptyDescription>{messages.emptyOutput}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap items-center gap-2 border-t">
        <ToolCopyButton
          value={robotsContent}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          disabled={!hasOutput}
          variant="ghost"
        />

        {downloadUrl ? (
          <Button asChild type="button" variant="ghost" size="sm">
            <a href={downloadUrl} download="robots.txt">
              <Download data-icon="inline-start" />
              {messages.download}
            </a>
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.download}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { OutputCard }
