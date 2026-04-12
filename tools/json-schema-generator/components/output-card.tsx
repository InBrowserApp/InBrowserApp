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
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, FileJson2, TriangleAlert } from "@workspace/ui/icons"

import type { JsonSchemaGeneratorMessages } from "../client/types"

type OutputCardProps = Readonly<{
  downloadUrl: string | null
  errorMessage: string
  hasInput: boolean
  messages: JsonSchemaGeneratorMessages
  schemaText: string
}>

function OutputCard({
  downloadUrl,
  errorMessage,
  hasInput,
  messages,
  schemaText,
}: OutputCardProps) {
  const hasSchema = schemaText.length > 0

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.outputTitle}</CardTitle>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {errorMessage ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.invalidJson}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : hasSchema ? (
          <Textarea
            aria-label={messages.outputTitle}
            readOnly
            value={schemaText}
            className="min-h-80 flex-1 resize-y font-mono text-sm"
          />
        ) : (
          <Empty className="min-h-80 border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileJson2 />
              </EmptyMedia>
              <EmptyTitle>{messages.outputTitle}</EmptyTitle>
              <EmptyDescription>
                {hasInput ? messages.outputEmpty : messages.outputEmpty}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={schemaText}
          copyLabel={messages.copySchemaLabel}
          copiedLabel={messages.copiedLabel}
          disabled={!hasSchema}
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download="schema.json">
              <Download data-icon="inline-start" />
              {messages.downloadSchemaLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadSchemaLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { OutputCard }
