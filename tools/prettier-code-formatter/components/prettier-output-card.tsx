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
import { Download } from "@workspace/ui/icons"

import type {
  PrettierCodeFormatterMessages,
  PrettierOutputState,
} from "../client/types"
import { HighlightedCode } from "./highlighted-code"

type PrettierOutputCardProps = Readonly<{
  downloadFilename: string
  downloadUrl: string | null
  messages: PrettierCodeFormatterMessages
  outputState: PrettierOutputState
}>

function PrettierOutputCard({
  downloadFilename,
  downloadUrl,
  messages,
  outputState,
}: PrettierOutputCardProps) {
  const formattedValue =
    outputState.state === "formatted" ? outputState.formatted : ""
  const highlightLanguage =
    outputState.state === "formatted" || outputState.state === "error"
      ? outputState.request.highlightLanguage
      : "plaintext"

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.outputLabel}</CardTitle>
        <CardDescription>{messages.outputDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent>
        <HighlightedCode
          ariaLabel={messages.outputLabel}
          emptyDescription={messages.outputEmptyDescription}
          errorDescription={
            outputState.state === "error" ? outputState.message : undefined
          }
          errorTitle={
            outputState.state === "error"
              ? messages.formatErrorLabel
              : undefined
          }
          formattingLabel={messages.formattingLabel}
          highlightLanguage={highlightLanguage}
          isFormatting={outputState.state === "formatting"}
          value={formattedValue}
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={formattedValue}
          copyLabel={messages.copyFormattedLabel}
          copiedLabel={messages.copiedLabel}
          disabled={outputState.state !== "formatted"}
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={downloadFilename}>
              <Download data-icon="inline-start" />
              {messages.downloadFormattedLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadFormattedLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { PrettierOutputCard }
