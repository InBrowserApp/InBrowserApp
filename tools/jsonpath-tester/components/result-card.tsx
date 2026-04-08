import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Download } from "@workspace/ui/icons"

import type { JsonpathTesterMessages } from "../client/types"
import type { JsonpathEvaluation } from "../core/evaluate-jsonpath"
import { HighlightedResult } from "./highlighted-result"

type ResultMode = "paths" | "values"

type ResultCardProps = Readonly<{
  activeResultMode: ResultMode
  downloadFilename: string
  downloadUrl: string | null
  evaluation: JsonpathEvaluation
  messages: JsonpathTesterMessages
  onResultModeChange: (value: ResultMode) => void
}>

function ResultCard({
  activeResultMode,
  downloadFilename,
  downloadUrl,
  evaluation,
  messages,
  onResultModeChange,
}: ResultCardProps) {
  const resultState =
    evaluation.state === "ready"
      ? "success"
      : evaluation.state === "empty"
        ? "empty"
        : "error"
  const resultErrorTitle =
    evaluation.state === "json-error"
      ? messages.invalidJsonLabel
      : messages.invalidQueryLabel
  const activeResultValue =
    evaluation.state === "ready"
      ? activeResultMode === "paths"
        ? evaluation.formattedPaths
        : evaluation.formattedValues
      : ""

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultLabel}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {evaluation.state === "ready" ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">
                {messages.matchCountLabel.replace(
                  "{count}",
                  String(evaluation.matchCount)
                )}
              </Badge>
              {evaluation.matchCount === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {messages.noMatchesLabel}
                </p>
              ) : null}
            </div>

            <ToggleGroup
              type="single"
              value={activeResultMode}
              variant="outline"
              size="sm"
              aria-label={messages.resultModeLabel}
              onValueChange={(value) => {
                if (value === "values" || value === "paths") {
                  onResultModeChange(value)
                }
              }}
            >
              <ToggleGroupItem value="values">
                {messages.valuesTabLabel}
              </ToggleGroupItem>
              <ToggleGroupItem value="paths">
                {messages.pathsTabLabel}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        ) : null}

        <HighlightedResult
          ariaLabel={messages.resultLabel}
          emptyDescription={messages.resultEmptyDescription}
          errorDescription={
            evaluation.state === "json-error" ||
            evaluation.state === "query-error"
              ? evaluation.error
              : ""
          }
          errorTitle={resultErrorTitle}
          state={resultState}
          value={activeResultValue}
        />
      </CardContent>
      <CardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={activeResultValue}
          copyLabel={messages.copyResultLabel}
          copiedLabel={messages.copiedLabel}
          disabled={evaluation.state !== "ready"}
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
      </CardFooter>
    </Card>
  )
}

export { ResultCard }
