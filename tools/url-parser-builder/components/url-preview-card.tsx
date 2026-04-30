import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Label } from "@workspace/ui/components/ui/label"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { TriangleAlert } from "@workspace/ui/icons"
import { useId } from "react"

import type { UrlParserBuilderMessages } from "../types"

type UrlPreviewCardProps = Readonly<{
  messages: UrlParserBuilderMessages
  finalUrl: string
  buildErrorDescription: string | null
}>

function UrlPreviewCard({
  messages,
  finalUrl,
  buildErrorDescription,
}: UrlPreviewCardProps) {
  const finalUrlId = useId()

  return (
    <Card className="border-border/70 bg-background/90 shadow-sm">
      <CardHeader className="gap-4 border-b">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle>{messages.previewTitle}</CardTitle>
            <CardDescription>{messages.previewDescription}</CardDescription>
          </div>

          <ToolCopyButton
            value={finalUrl}
            copyLabel={messages.copyUrlLabel}
            copiedLabel={messages.copiedLabel}
            disabled={finalUrl.length === 0 || buildErrorDescription !== null}
            variant="outline"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={finalUrlId}>{messages.finalUrlLabel}</Label>
          <Textarea
            id={finalUrlId}
            readOnly
            rows={4}
            value={finalUrl}
            className="min-h-28 resize-y font-mono text-sm"
          />
        </div>

        {buildErrorDescription ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.buildErrorTitle}</AlertTitle>
            <AlertDescription>{buildErrorDescription}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { UrlPreviewCard }
