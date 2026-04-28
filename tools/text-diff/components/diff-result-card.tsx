import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Download } from "@workspace/ui/icons"

import { DiffRowList } from "./diff-row-list"

import type { DiffRow } from "../core/text-diff"
import type { TextDiffMessages, TextDiffViewMode } from "../types"

type DiffResultCardProps = Readonly<{
  messages: TextDiffMessages
  rows: readonly DiffRow[]
  hasAnyInput: boolean
  viewMode: TextDiffViewMode
  unifiedText: string
  downloadUrl: string | null
}>

function DiffResultCard({
  messages,
  rows,
  hasAnyInput,
  viewMode,
  unifiedText,
  downloadUrl,
}: DiffResultCardProps) {
  const hasVisibleRows = rows.length > 0

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <CardTitle>{messages.resultsTitle}</CardTitle>
            <CardDescription>{messages.resultsDescription}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-3">
            <ToolCopyButton
              value={unifiedText}
              copyLabel={messages.copyDiffLabel}
              copiedLabel={messages.copiedLabel}
              disabled={!hasAnyInput}
            />

            {downloadUrl ? (
              <Button asChild size="sm">
                <a href={downloadUrl} download="text-diff.patch">
                  <Download data-icon="inline-start" />
                  {messages.downloadDiffLabel}
                </a>
              </Button>
            ) : (
              <Button type="button" size="sm" disabled>
                <Download data-icon="inline-start" />
                {messages.downloadDiffLabel}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasAnyInput ? (
          <Empty className="border border-dashed border-border/70 bg-muted/10">
            <EmptyHeader>
              <EmptyTitle>{messages.emptyStateTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyStateDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : !hasVisibleRows ? (
          <Empty className="border border-dashed border-border/70 bg-muted/10">
            <EmptyHeader>
              <EmptyTitle>{messages.noChangesTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.noChangesDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DiffRowList
            rows={rows}
            viewMode={viewMode}
            originalLegendLabel={messages.originalLegendLabel}
            modifiedLegendLabel={messages.modifiedLegendLabel}
          />
        )}
      </CardContent>
    </Card>
  )
}

export { DiffResultCard }
