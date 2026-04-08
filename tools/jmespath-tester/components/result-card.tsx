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
import { Download } from "@workspace/ui/icons"

import type { JmespathTesterMessages } from "../client/types"
import { HighlightedResult } from "./highlighted-result"
import type { JmespathEvaluation } from "../core/evaluate-jmespath"

type ResultCardProps = Readonly<{
  downloadUrl: string | null
  evaluation: JmespathEvaluation
  messages: JmespathTesterMessages
}>

function ResultCard({ downloadUrl, evaluation, messages }: ResultCardProps) {
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

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultLabel}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {evaluation.state === "ready" ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant="secondary">
              {messages.resultCountLabel.replace(
                "{count}",
                String(evaluation.resultCount)
              )}
            </Badge>
            {evaluation.resultCount === 0 ? (
              <p className="text-sm text-muted-foreground">
                {messages.noResultsLabel}
              </p>
            ) : null}
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
          value={evaluation.state === "ready" ? evaluation.formattedResult : ""}
        />
      </CardContent>
      <CardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={evaluation.state === "ready" ? evaluation.formattedResult : ""}
          copyLabel={messages.copyResultLabel}
          copiedLabel={messages.copiedLabel}
          disabled={evaluation.state !== "ready"}
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download="jmespath-results.json">
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
