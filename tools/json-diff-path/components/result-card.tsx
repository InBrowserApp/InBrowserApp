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
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Download, RefreshCcw } from "@workspace/ui/icons"

import type {
  JsonDiffPathMessages,
  OperationOption,
  ResultMode,
} from "../client/types"
import type { JsonDiffOperation } from "../core/json-diff"
import { HighlightedJson } from "./highlighted-json"

type ResultCardProps = Readonly<{
  activeResultMode: ResultMode
  activeResultValue: string
  downloadFilename: string
  downloadUrl: string | null
  filteredCount: number
  isReady: boolean
  messages: JsonDiffPathMessages
  operationOptions: readonly OperationOption[]
  pendingLargeCompare: boolean
  selectedOperations: readonly JsonDiffOperation[]
  totalCount: number
  onResultModeChange: (value: ResultMode) => void
  onSelectedOperationsChange: (value: JsonDiffOperation[]) => void
}>

function ResultCard({
  activeResultMode,
  activeResultValue,
  downloadFilename,
  downloadUrl,
  filteredCount,
  isReady,
  messages,
  operationOptions,
  pendingLargeCompare,
  selectedOperations,
  totalCount,
  onResultModeChange,
  onSelectedOperationsChange,
}: ResultCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultLabel}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">
              {messages.showingChangesLabel
                .replace("{count}", String(filteredCount))
                .replace("{total}", String(totalCount))}
            </Badge>
            {isReady && filteredCount === 0 ? (
              <p className="text-sm text-muted-foreground">
                {messages.noChangesLabel}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {messages.filtersLabel}
              </span>
              <ToggleGroup
                type="multiple"
                variant="outline"
                size="sm"
                value={[...selectedOperations]}
                aria-label={messages.filtersLabel}
                onValueChange={(value) => {
                  onSelectedOperationsChange(value as JsonDiffOperation[])
                }}
              >
                {operationOptions.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value}>
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <ToggleGroup
              type="single"
              value={activeResultMode}
              variant="outline"
              size="sm"
              aria-label={messages.resultModeLabel}
              onValueChange={(value) => {
                if (value === "paths" || value === "patch") {
                  onResultModeChange(value)
                }
              }}
            >
              <ToggleGroupItem value="paths">
                {messages.pathsTabLabel}
              </ToggleGroupItem>
              <ToggleGroupItem value="patch">
                {messages.patchTabLabel}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {pendingLargeCompare ? (
          <Alert>
            <RefreshCcw />
            <AlertTitle>{messages.compareNowLabel}</AlertTitle>
            <AlertDescription>{messages.largeCompareHint}</AlertDescription>
          </Alert>
        ) : null}

        <HighlightedJson
          ariaLabel={messages.resultLabel}
          emptyDescription={messages.resultEmptyDescription}
          value={isReady ? activeResultValue : ""}
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={activeResultValue}
          copyLabel={messages.copyResultLabel}
          copiedLabel={messages.copiedLabel}
          disabled={!isReady}
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={downloadFilename}>
              <Download data-icon="inline-start" />
              {messages.downloadJsonLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadJsonLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { ResultCard }
