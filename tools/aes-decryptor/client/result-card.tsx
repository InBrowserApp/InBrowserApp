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
import { Download, FileText, Lock, TriangleAlert } from "@workspace/ui/icons"

import type { AesDecryptorMessages, DecryptOutput } from "./types"

function ResultCard({
  downloadUrl,
  error,
  messages,
  output,
}: Readonly<{
  downloadUrl: string | null
  error: string
  messages: AesDecryptorMessages
  output: DecryptOutput | null
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

        {output ? (
          output.isFile ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText />
                </EmptyMedia>
                <EmptyTitle>{messages.fileResultTitle}</EmptyTitle>
                <EmptyDescription>
                  {messages.fileResultDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Textarea
              readOnly
              aria-label={messages.plaintextResultLabel}
              value={output.text}
              className="min-h-120 resize-y font-mono text-sm"
            />
          )
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
          value={output?.isFile ? "" : (output?.text ?? "")}
          copyLabel={messages.copyPlaintextLabel}
          copiedLabel={messages.copiedLabel}
          disabled={!output || output.isFile}
        />
        {downloadUrl && output ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={output.fileName}>
              <Download data-icon="inline-start" />
              {output.isFile
                ? messages.downloadFileLabel
                : messages.downloadPlaintextLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadPlaintextLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { ResultCard }
