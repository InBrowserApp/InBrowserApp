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
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Download, FileText } from "@workspace/ui/icons"

import type { ListResultKey } from "../core/compare-lists"
import type { ListComparerLocalizedCatalog, ResultOption } from "../types"

type ResultCardProps = Readonly<{
  messages: ListComparerLocalizedCatalog
  hasAnyInput: boolean
  activeResult: ListResultKey
  resultOptions: readonly ResultOption[]
  downloadUrl: string | null
  onActiveResultChange: (value: ListResultKey) => void
}>

function ResultCard({
  messages,
  hasAnyInput,
  activeResult,
  resultOptions,
  downloadUrl,
  onActiveResultChange,
}: ResultCardProps) {
  const activeOption =
    resultOptions.find((option) => option.key === activeResult) ??
    resultOptions[0]

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.resultsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        {hasAnyInput ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge variant="secondary">
                {messages.activeCountLabel.replace(
                  "{count}",
                  String(activeOption?.count ?? 0)
                )}
              </Badge>
              {(activeOption?.count ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {messages.noItemsLabel}
                </p>
              ) : null}
            </div>

            <ToggleGroup
              type="single"
              value={activeOption?.key}
              variant="outline"
              size="sm"
              aria-label={messages.resultModeLabel}
              className="flex w-full flex-wrap"
              onValueChange={(value) => {
                if (
                  value === "shared" ||
                  value === "left-only" ||
                  value === "right-only" ||
                  value === "all-unique" ||
                  value === "left-duplicates" ||
                  value === "right-duplicates"
                ) {
                  onActiveResultChange(value)
                }
              }}
            >
              {resultOptions.map((option) => (
                <ToggleGroupItem key={option.key} value={option.key}>
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <Textarea
              aria-label={messages.resultsTitle}
              value={activeOption?.output ?? ""}
              readOnly
              rows={10}
              className="min-h-72 resize-y font-mono text-sm"
            />
          </>
        ) : (
          <Empty className="border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyStateTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyStateDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={activeOption?.output ?? ""}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          disabled={!hasAnyInput || (activeOption?.count ?? 0) === 0}
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={activeOption?.downloadName}>
              <Download data-icon="inline-start" />
              {messages.downloadLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { ResultCard }
