import type { ReactNode } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
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
import { Textarea } from "@workspace/ui/components/ui/textarea"
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

            <section className="flex flex-wrap items-center justify-end gap-3">
              <ToolCopyButton
                value={analysis.dataUri}
                copyLabel={messages.copyLabel}
                copiedLabel={messages.copiedLabel}
              />
            </section>

            <Textarea
              aria-label={messages.dataUri}
              className="min-h-72 flex-1 resize-none font-mono text-xs leading-5"
              readOnly
              spellCheck={false}
              value={analysis.dataUri}
            />
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
