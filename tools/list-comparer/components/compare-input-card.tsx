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
import { Button } from "@workspace/ui/components/ui/button"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { ArrowLeftRight, FileText, RefreshCcw } from "@workspace/ui/icons"

import type { ParsedListSummary } from "../core/compare-lists"
import type { ListComparerLocalizedCatalog } from "../types"

type CompareInputCardProps = Readonly<{
  messages: ListComparerLocalizedCatalog
  leftText: string
  rightText: string
  leftSummary: ParsedListSummary
  rightSummary: ParsedListSummary
  onLeftTextChange: (value: string) => void
  onRightTextChange: (value: string) => void
  onSwap: () => void
  onLoadSample: () => void
  onClear: () => void
}>

function CompareInputCard({
  messages,
  leftText,
  rightText,
  leftSummary,
  rightSummary,
  onLeftTextChange,
  onRightTextChange,
  onSwap,
  onLoadSample,
  onClear,
}: CompareInputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputTitle}</CardTitle>
        <CardDescription>{messages.inputDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent>
        <div className="grid gap-4 xl:grid-cols-2">
          <ListInput
            label={messages.listALabel}
            placeholder={messages.listAPlaceholder}
            summary={leftSummary}
            statsLabel={messages.listStatsLabel}
            value={leftText}
            onChange={onLeftTextChange}
          />
          <ListInput
            label={messages.listBLabel}
            placeholder={messages.listBPlaceholder}
            summary={rightSummary}
            statsLabel={messages.listStatsLabel}
            value={rightText}
            onChange={onRightTextChange}
          />
        </div>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-start gap-3 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onSwap}>
          <ArrowLeftRight data-icon="inline-start" />
          {messages.swapLists}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onLoadSample}>
          <FileText data-icon="inline-start" />
          {messages.loadSample}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <RefreshCcw data-icon="inline-start" />
          {messages.clearLists}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

type ListInputProps = Readonly<{
  label: string
  placeholder: string
  statsLabel: string
  summary: ParsedListSummary
  value: string
  onChange: (value: string) => void
}>

function ListInput({
  label,
  placeholder,
  statsLabel,
  summary,
  value,
  onChange,
}: ListInputProps) {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">
          {statsLabel
            .replace("{total}", String(summary.totalCount))
            .replace("{unique}", String(summary.uniqueCount))}
        </p>
      </div>
      <Textarea
        aria-label={label}
        value={value}
        rows={12}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value)
        }}
        className="min-h-80 resize-y text-sm"
      />
    </div>
  )
}

export { CompareInputCard }
