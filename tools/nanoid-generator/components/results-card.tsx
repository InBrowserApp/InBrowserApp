import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { RefreshCcw } from "@workspace/ui/icons"

import type { NanoidMessages } from "../types"

type NanoidResultsCardProps = Readonly<{
  messages: NanoidMessages
  output: string
  onRegenerate: () => void
}>

function NanoidResultsCard({
  messages,
  output,
  onRegenerate,
}: NanoidResultsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.resultsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          aria-label={messages.resultsTitle}
          value={output}
          readOnly
          rows={14}
          placeholder={messages.resultsPlaceholder}
          className="min-h-80 resize-y font-mono text-sm"
        />
      </CardContent>
      <CardFooter className="justify-between gap-3 border-t">
        <ToolCopyButton
          value={output}
          copyLabel={messages.copyResultsLabel}
          copiedLabel={messages.copiedLabel}
          variant="ghost"
          disabled={output.length === 0}
        />
        <Button type="button" variant="ghost" size="sm" onClick={onRegenerate}>
          <RefreshCcw data-icon="inline-start" />
          {messages.regenerateLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { NanoidResultsCard }
