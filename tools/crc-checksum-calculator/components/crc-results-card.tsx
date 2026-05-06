import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { LoaderCircle } from "@workspace/ui/icons"

import {
  isResultFilter,
  type CrcDigestState,
  type ResultFilter,
} from "../client/state"
import type { CrcChecksumCalculatorPageMessages } from "../client/types"
import type { CrcResult } from "../core/crc"
import { CrcDigestSection } from "./crc-digest-section"

type CrcResultsCardProps = Readonly<{
  messages: CrcChecksumCalculatorPageMessages
  state: CrcDigestState
  filter: ResultFilter
  visibleResults: readonly CrcResult[]
  visibleResultsText: string
  onFilterChange: (filter: ResultFilter) => void
}>

function CrcResultsCard({
  messages,
  state,
  filter,
  visibleResults,
  visibleResultsText,
  onFilterChange,
}: CrcResultsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="grid gap-1">
          <CardTitle>{messages.checksumResultLabel}</CardTitle>
          <CardDescription>
            {messages.resultCountLabel.replace(
              "{count}",
              String(visibleResults.length)
            )}
          </CardDescription>
        </div>
        <CardAction className="gap-2">
          {state.status === "loading" ? (
            <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
          ) : null}
          <ToolCopyButton
            value={visibleResultsText}
            copyLabel={messages.copyVisibleResultsLabel}
            copiedLabel={messages.copiedLabel}
            disabled={visibleResults.length === 0}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <CrcFilterToggle
          messages={messages}
          filter={filter}
          onFilterChange={onFilterChange}
        />

        <CrcDigestSection
          state={state}
          results={visibleResults}
          messages={messages}
        />
      </CardContent>
    </Card>
  )
}

function CrcFilterToggle({
  messages,
  filter,
  onFilterChange,
}: Readonly<{
  messages: CrcChecksumCalculatorPageMessages
  filter: ResultFilter
  onFilterChange: (filter: ResultFilter) => void
}>) {
  return (
    <ToggleGroup
      type="single"
      value={filter}
      aria-label={messages.resultFilterLabel}
      onValueChange={(value) => {
        if (isResultFilter(value)) {
          onFilterChange(value)
        }
      }}
      className="flex-wrap justify-start"
    >
      <ToggleGroupItem value="all">{messages.allResultsLabel}</ToggleGroupItem>
      <ToggleGroupItem value="8">{messages.crc8ResultsLabel}</ToggleGroupItem>
      <ToggleGroupItem value="16">{messages.crc16ResultsLabel}</ToggleGroupItem>
      <ToggleGroupItem value="32">{messages.crc32ResultsLabel}</ToggleGroupItem>
      <ToggleGroupItem value="64">{messages.crc64ResultsLabel}</ToggleGroupItem>
      <ToggleGroupItem value="other">
        {messages.otherResultsLabel}
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export { CrcResultsCard }
