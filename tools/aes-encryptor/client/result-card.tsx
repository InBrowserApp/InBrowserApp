import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
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
import { Download, Lock, TriangleAlert } from "@workspace/ui/icons"

import type { AesEncryptorMessages } from "./types"

function ResultCard({
  downloadFileName,
  downloadUrl,
  error,
  messages,
  resultJson,
}: Readonly<{
  downloadFileName: string
  downloadUrl: string | null
  error: string
  messages: AesEncryptorMessages
  resultJson: string
}>) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultCardTitle}</CardTitle>
        <CardDescription>{messages.resultCardDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {error ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.errorTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {resultJson ? (
          <Textarea
            readOnly
            aria-label={messages.resultCardTitle}
            value={resultJson}
            className="min-h-120 resize-y font-mono text-xs"
          />
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Lock />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyResultTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyResultDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={resultJson}
          copyLabel={messages.copyJsonLabel}
          copiedLabel={messages.copiedLabel}
          disabled={!resultJson}
        />
        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={downloadFileName}>
              <Download data-icon="inline-start" />
              {messages.downloadJsonLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadJsonLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { ResultCard }
