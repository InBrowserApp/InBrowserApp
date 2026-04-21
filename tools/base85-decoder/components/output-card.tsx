import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertTitle } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Download, TriangleAlert } from "@workspace/ui/icons"

import { ReadOnlyOutput } from "./read-only-output"
import type { DecodeBase85PreviewResult } from "../core/base85"
import type { Base85DecoderMessages } from "../types"

type Base85OutputCardProps = Readonly<{
  messages: Base85DecoderMessages
  decodeState: DecodeBase85PreviewResult
  outputErrorTitle: string | null
  decodedText: string
  downloadUrl: string | null
  downloadFileName: string
}>

function Base85OutputCard({
  messages,
  decodeState,
  outputErrorTitle,
  decodedText,
  downloadUrl,
  downloadFileName,
}: Base85OutputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.decodedOutputLabel}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {outputErrorTitle ? (
          <div aria-live="polite">
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>{outputErrorTitle}</AlertTitle>
            </Alert>
          </div>
        ) : decodeState.state === "empty" ? (
          <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
            {messages.decodedOutputEmptyDescription}
          </div>
        ) : decodeState.state === "decoded" ? (
          <>
            <ReadOnlyOutput
              ariaLabel={messages.decodedOutputLabel}
              value={decodeState.previewText}
              className="min-h-72"
            />

            {decodeState.isPreviewTruncated ? (
              <p className="text-sm text-muted-foreground">
                {messages.previewTruncatedLabel}
              </p>
            ) : null}
          </>
        ) : null}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={decodedText}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          disabled={decodeState.state !== "decoded"}
          variant="ghost"
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={downloadFileName}>
              <Download data-icon="inline-start" />
              {messages.downloadFileLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadFileLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { Base85OutputCard }
