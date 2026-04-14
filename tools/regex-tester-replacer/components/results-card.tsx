import { Fragment } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Download, Search, TriangleAlert } from "@workspace/ui/icons"

import type {
  RegexAnalysis,
  RegexMatch,
  RegexResultView,
} from "../core/regex-tester-replacer"
import type {
  RegexExportState,
  RegexTesterReplacerLocalizedCatalog,
  RegexViewOption,
} from "../types"

type ResultsCardProps = Readonly<{
  activeView: RegexResultView
  exportState: RegexExportState
  hasPattern: boolean
  hasSourceText: boolean
  matchLimit: number
  messages: RegexTesterReplacerLocalizedCatalog
  patternError: string | null
  previewLimit: number
  result: RegexAnalysis
  viewOptions: readonly RegexViewOption[]
  onActiveViewChange: (view: RegexResultView) => void
}>

function ResultsCard({
  activeView,
  exportState,
  hasPattern,
  hasSourceText,
  matchLimit,
  messages,
  patternError,
  previewLimit,
  result,
  viewOptions,
  onActiveViewChange,
}: ResultsCardProps) {
  const hasInput = hasPattern && hasSourceText

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.resultsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        {patternError ? (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <TriangleAlert className="mt-0.5 shrink-0" />
            <p>
              {messages.invalidPatternLabel.replace("{message}", patternError)}
            </p>
          </div>
        ) : !hasInput ? (
          <Empty className="border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search />
              </EmptyMedia>
              <EmptyTitle>{messages.resultsTitle}</EmptyTitle>
              <EmptyDescription>{messages.summaryEmpty}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <ToggleGroup
              type="single"
              value={activeView}
              variant="outline"
              size="sm"
              aria-label={messages.resultViewLabel}
              className="flex w-full flex-wrap"
              onValueChange={(value) => {
                if (
                  value === "preview" ||
                  value === "matches" ||
                  value === "replace"
                ) {
                  onActiveViewChange(value)
                }
              }}
            >
              {viewOptions.map((option) => (
                <ToggleGroupItem key={option.key} value={option.key}>
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            {activeView === "preview" ? (
              <div className="grid gap-3">
                <div
                  role="region"
                  aria-label={messages.previewTabLabel}
                  className="min-h-72 overflow-x-auto rounded-lg border border-input bg-transparent p-3"
                >
                  {result.preview.previewText ? (
                    <pre className="font-mono text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground">
                      {result.preview.segments.map((segment, index) => (
                        <Fragment
                          key={`${index}-${segment.matchIndex ?? "plain"}`}
                        >
                          {segment.isMatch ? (
                            <mark className="rounded bg-amber-200/70 px-0.5 text-foreground">
                              {segment.text}
                            </mark>
                          ) : (
                            segment.text
                          )}
                        </Fragment>
                      ))}
                    </pre>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {messages.previewEmpty}
                    </p>
                  )}
                </div>

                {result.preview.truncated ? (
                  <p className="text-sm text-muted-foreground">
                    {messages.previewTruncatedLabel.replace(
                      "{count}",
                      String(previewLimit)
                    )}
                  </p>
                ) : null}
              </div>
            ) : null}

            {activeView === "matches" ? (
              <div className="grid gap-3">
                {result.matches.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {messages.matchesEmpty}
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {result.matches.map((match, index) => (
                      <MatchCard
                        key={`${match.index}-${index}`}
                        index={index}
                        match={match}
                        messages={messages}
                      />
                    ))}
                  </div>
                )}

                {result.matchesTruncated ? (
                  <p className="text-sm text-muted-foreground">
                    {messages.matchesTruncatedLabel.replace(
                      "{count}",
                      String(matchLimit)
                    )}
                  </p>
                ) : null}
              </div>
            ) : null}

            {activeView === "replace" ? (
              <Textarea
                aria-label={messages.replaceTabLabel}
                value={result.replacementOutput}
                readOnly
                rows={10}
                placeholder={messages.replaceOutputEmpty}
                className="min-h-72 resize-y font-mono text-sm"
              />
            ) : null}
          </>
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={exportState.value}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          disabled={exportState.value.length === 0}
        />
        {exportState.downloadUrl ? (
          <Button asChild size="sm">
            <a
              href={exportState.downloadUrl}
              download={exportState.downloadName}
            >
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

type MatchCardProps = Readonly<{
  index: number
  match: RegexMatch
  messages: RegexTesterReplacerLocalizedCatalog
}>

function MatchCard({ index, match, messages }: MatchCardProps) {
  const hasNamedGroups = Object.keys(match.namedGroups).length > 0

  return (
    <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          {messages.matchIndexLabel.replace("{count}", String(index + 1))}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {messages.matchRangeLabel
            .replace("{start}", String(match.index))
            .replace("{end}", String(match.end))}
        </span>
      </div>

      <pre className="mt-3 overflow-x-auto rounded-md border border-input bg-background p-2 font-mono text-sm break-words whitespace-pre-wrap">
        {match.match || messages.matchEmptyLabel}
      </pre>

      {match.groups.length > 0 ? (
        <div className="mt-3 grid gap-2">
          <div className="text-sm font-medium">
            {messages.capturedGroupsLabel}
          </div>
          <div className="flex flex-wrap gap-2">
            {match.groups.map((group, groupIndex) => (
              <Badge key={groupIndex} variant="outline">
                {group || messages.matchEmptyLabel}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {hasNamedGroups ? (
        <div className="mt-3 grid gap-2">
          <div className="text-sm font-medium">{messages.namedGroupsLabel}</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(match.namedGroups).map(([name, value]) => (
              <Badge key={name} variant="outline">
                {name}={value || messages.matchEmptyLabel}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export { ResultsCard }
