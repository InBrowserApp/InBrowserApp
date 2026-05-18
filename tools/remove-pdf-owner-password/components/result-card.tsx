import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { BadgeCheck, Download, FileText, Lock } from "@workspace/ui/icons"

import { formatBytes } from "../client/utils"

import type { PdfResult, RemovePdfOwnerPasswordMessages } from "../client/types"

type ResultCardProps = Readonly<{
  isProcessing: boolean
  messages: RemovePdfOwnerPasswordMessages
  result: PdfResult | null
  resultUrl: string | null
  selectedFile: File | null
}>

function ResultCard({
  isProcessing,
  messages,
  result,
  resultUrl,
  selectedFile,
}: ResultCardProps) {
  return (
    <ToolPanelCard>
      <ToolPanelCardContent className="gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">{messages.resultTitle}</h2>
          <p className="text-sm text-muted-foreground">
            {messages.resultDescription}
          </p>
        </div>

        {result ? (
          <div className="flex flex-col gap-5 rounded-lg border bg-background p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-muted p-2 text-foreground">
                <BadgeCheck />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium">{messages.successTitle}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {messages.successDescription}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {messages.outputSizeLabel}: {formatBytes(result.blob.size)}
              </Badge>
              <Badge className="max-w-full break-all" variant="outline">
                {result.fileName}
              </Badge>
            </div>
          </div>
        ) : (
          <Empty className="min-h-72 border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                {isProcessing ? (
                  <Spinner />
                ) : selectedFile ? (
                  <Lock />
                ) : (
                  <FileText />
                )}
              </EmptyMedia>
              <EmptyTitle>
                {isProcessing
                  ? messages.processingLabel
                  : selectedFile
                    ? messages.readyTitle
                    : messages.noFileTitle}
              </EmptyTitle>
              <EmptyDescription>
                {isProcessing
                  ? messages.processingDescription
                  : selectedFile
                    ? messages.readyDescription
                    : messages.noFileDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>

      {resultUrl && result ? (
        <ToolPanelCardFooter className="justify-end">
          <Button asChild className="max-w-full text-center whitespace-normal">
            <a download={result.fileName} href={resultUrl}>
              <Download data-icon="inline-start" />
              {messages.downloadPdfLabel}
            </a>
          </Button>
        </ToolPanelCardFooter>
      ) : null}
    </ToolPanelCard>
  )
}

export { ResultCard }
