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
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Download, Sparkles, TriangleAlert } from "@workspace/ui/icons"

import type {
  AsciiArtGeneratorLocalizedCatalog,
  AsciiArtOutputState,
} from "../types"

type OutputCardProps = Readonly<{
  messages: AsciiArtGeneratorLocalizedCatalog
  outputState: AsciiArtOutputState
  downloadFilename: string
  downloadUrl: string | null
}>

function OutputCard({
  messages,
  outputState,
  downloadFilename,
  downloadUrl,
}: OutputCardProps) {
  const outputValue = outputState.state === "ready" ? outputState.output : ""

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.outputTitle}</CardTitle>
        <CardDescription>{messages.outputDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {outputState.state === "empty" ? (
          <Empty className="border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Sparkles />
              </EmptyMedia>
              <EmptyTitle>{messages.outputEmptyTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.outputEmptyDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {outputState.state === "rendering" ? (
          <p className="text-sm text-muted-foreground">
            {messages.renderingLabel}
          </p>
        ) : null}

        {outputState.state === "error" ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.renderErrorTitle}</AlertTitle>
            <AlertDescription>{outputState.message}</AlertDescription>
          </Alert>
        ) : null}

        {outputState.state === "ready" ? (
          <Textarea
            aria-label={messages.outputTitle}
            value={outputValue}
            readOnly
            wrap="off"
            rows={12}
            className="min-h-80 resize-y font-mono text-xs leading-4"
          />
        ) : null}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={outputValue}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          disabled={!outputValue}
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={downloadFilename}>
              <Download data-icon="inline-start" />
              {messages.downloadLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { OutputCard }
