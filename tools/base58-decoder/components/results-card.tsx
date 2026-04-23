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

import type { DecodeBase58PreviewResult } from "../core/base58"
import type { Base58DecoderPageMessages } from "../types"
import { ReadOnlyOutput } from "./read-only-output"

type ResultsCardProps = Readonly<{
  decodeState: DecodeBase58PreviewResult
  downloadFileName: string
  downloadUrl: string | null
  fileReadFailed: boolean
  messages: Base58DecoderPageMessages
}>

function ResultsCard({
  decodeState,
  downloadFileName,
  downloadUrl,
  fileReadFailed,
  messages,
}: ResultsCardProps) {
  const outputErrorTitle = fileReadFailed
    ? messages.fileReadFailedTitle
    : decodeState.state === "invalid-base58"
      ? messages.invalidBase58Title
      : null
  const decodedText = decodeState.state === "decoded" ? decodeState.text : ""

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.decodedOutputTitle}</CardTitle>
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
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <ReadOnlyOutput
              ariaLabel={messages.decodedOutputTitle}
              value={decodeState.previewText}
              className="min-h-72 flex-1"
            />

            {decodeState.isPreviewTruncated ? (
              <p className="text-sm text-muted-foreground">
                {messages.previewTruncatedLabel}
              </p>
            ) : null}
          </div>
        ) : null}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={decodedText}
          copyLabel={messages.copyResultLabel}
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

export { ResultsCard }
