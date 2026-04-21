import type { ReactNode } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
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
import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"
import { FileText } from "@workspace/ui/icons"

import { formatBytes } from "../core/data-uri"
import type {
  FileToDataUriConversionAnalysis,
  FileToDataUriConverterMessages,
} from "../client/types"

type FileToDataUriResultCardProps = Readonly<{
  analysis: FileToDataUriConversionAnalysis | null
  messages: FileToDataUriConverterMessages
}>

function FileToDataUriResultCard({
  analysis,
  messages,
}: FileToDataUriResultCardProps) {
  const description = analysis
    ? `${analysis.fileName} · ${formatBytes(analysis.fileSize)} · ${analysis.mimeType ?? messages.unknownType}`
    : messages.meta.description

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.dataUri}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {analysis ? (
          <>
            <section className="grid gap-3 sm:grid-cols-3">
              <MetricTile label={messages.file} value={analysis.fileName} />
              <MetricTile
                label={messages.fileSize}
                value={formatBytes(analysis.fileSize)}
              />
              <MetricTile
                label={messages.mimeType}
                value={analysis.mimeType ?? messages.unknownType}
              />
            </section>

            <ScrollArea
              aria-label={messages.dataUri}
              className="h-80 min-h-0 rounded-xl border border-border/70 bg-muted/10"
            >
              <pre className="min-h-full min-w-0 p-4 font-mono text-xs leading-5 break-all whitespace-pre-wrap text-foreground">
                {analysis.dataUri}
              </pre>
            </ScrollArea>
          </>
        ) : (
          <Empty className="min-h-64 flex-1 border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{messages.dataUri}</EmptyTitle>
              <EmptyDescription>{messages.dataUriPlaceholder}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
      {analysis ? (
        <ToolPanelCardFooter className="justify-end gap-3 border-t">
          <ToolCopyButton
            value={analysis.dataUri}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
          />
        </ToolPanelCardFooter>
      ) : null}
    </ToolPanelCard>
  )
}

function MetricTile({
  label,
  value,
}: Readonly<{ label: string; value: ReactNode }>) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-2 text-sm leading-6 break-all">{value}</div>
    </div>
  )
}

export { FileToDataUriResultCard }
