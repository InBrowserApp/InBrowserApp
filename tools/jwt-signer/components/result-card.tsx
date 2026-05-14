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
import { Badge } from "@workspace/ui/components/ui/badge"
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
import { Download, FileJson2, TriangleAlert } from "@workspace/ui/icons"

import type { JwtSignerMessages } from "../client/types"
import type { SignJwtResult } from "../core/jwt-signer"

type ResultCardProps = Readonly<{
  messages: JwtSignerMessages
  result: SignJwtResult | null
  error: string
  downloadUrl: string | null
}>

function ResultCard({ messages, result, error, downloadUrl }: ResultCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultCardTitle}</CardTitle>
        <CardDescription>{messages.resultCardDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        {error ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.errorTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {result ? (
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">
                  {messages.tokenLabel}
                </span>
                <Badge variant="outline">{result.algorithm}</Badge>
              </div>
              <Textarea
                readOnly
                aria-label={messages.tokenLabel}
                value={result.token}
                className="min-h-36 resize-y font-mono text-sm break-all"
              />
            </div>

            <div className="grid gap-3">
              <h3 className="text-sm font-medium">{messages.detailsTitle}</h3>
              <PreviewBlock
                label={messages.headerPreviewLabel}
                value={result.headerJson}
              />
              <PreviewBlock
                label={messages.payloadPreviewLabel}
                value={result.payloadJson}
              />
              <PreviewBlock
                label={messages.signaturePreviewLabel}
                value={result.signature}
              />
            </div>
          </div>
        ) : (
          <Empty className="min-h-72">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileJson2 />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyResultTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyResultDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-2 border-t">
        <ToolCopyButton
          value={result?.token ?? ""}
          copyLabel={messages.copyTokenLabel}
          copiedLabel={messages.copiedLabel}
          disabled={!result}
          variant="ghost"
        />
        <Button asChild type="button" variant="outline" size="sm">
          <a
            href={downloadUrl ?? undefined}
            download="jwt.txt"
            aria-disabled={!downloadUrl}
            data-disabled={!downloadUrl}
            className={!downloadUrl ? "pointer-events-none opacity-50" : ""}
          >
            <Download data-icon="inline-start" />
            {messages.downloadTokenLabel}
          </a>
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

function PreviewBlock({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="grid gap-1.5">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <pre className="max-h-48 overflow-auto rounded-lg border bg-muted/40 p-3 text-xs leading-relaxed break-all whitespace-pre-wrap">
        {value}
      </pre>
    </div>
  )
}

export { ResultCard }
