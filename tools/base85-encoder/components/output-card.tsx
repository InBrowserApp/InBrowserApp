import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, TriangleAlert } from "@workspace/ui/icons"

import type { Base85EncoderMessages } from "../types"

type Base85OutputCardProps = Readonly<{
  messages: Base85EncoderMessages
  description: string
  encodedText: string
  errorMessage: string
  downloadName: string
  downloadUrl: string | null
}>

function Base85OutputCard({
  messages,
  description,
  encodedText,
  errorMessage,
  downloadName,
  downloadUrl,
}: Base85OutputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.outputTitle}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {errorMessage.length > 0 ? (
          <div aria-live="polite">
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </div>
        ) : encodedText.length > 0 ? (
          <Textarea
            name="base85-output"
            readOnly
            spellCheck={false}
            rows={10}
            aria-label={messages.outputTitle}
            value={encodedText}
            className="min-h-64 resize-y font-mono text-sm"
          />
        ) : (
          <div className="flex min-h-64 flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
            {messages.outputPlaceholder}
          </div>
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-end gap-3 border-t">
        <ToolCopyButton
          value={encodedText}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          disabled={encodedText.length === 0}
          variant="ghost"
        />

        {downloadUrl === null ? (
          <Button type="button" variant="ghost" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.download}
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="sm" asChild>
            <a href={downloadUrl} download={downloadName}>
              <Download data-icon="inline-start" />
              {messages.download}
            </a>
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { Base85OutputCard }
