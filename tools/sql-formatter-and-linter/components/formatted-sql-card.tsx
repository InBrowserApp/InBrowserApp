import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Download } from "@workspace/ui/icons"

import type { SqlFormatterAndLinterMessages } from "../client/types"
import type { SqlFormatResult } from "../core/sql-format"
import { HighlightedSql } from "./highlighted-sql"

type FormattedSqlCardProps = Readonly<{
  downloadFilename: string
  downloadUrl: string | null
  formatResult: SqlFormatResult
  messages: SqlFormatterAndLinterMessages
}>

function FormattedSqlCard({
  downloadFilename,
  downloadUrl,
  formatResult,
  messages,
}: FormattedSqlCardProps) {
  const displayState =
    formatResult.state === "formatted"
      ? "success"
      : formatResult.state === "error"
        ? "error"
        : "empty"
  const formattedSql =
    formatResult.state === "formatted" ? formatResult.sql : ""
  const errorDescription =
    formatResult.state === "error" ? formatResult.message : ""

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.formattedSqlLabel}</CardTitle>
        <CardDescription>{messages.formattedSqlDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <HighlightedSql
          ariaLabel={messages.formattedSqlLabel}
          emptyDescription={messages.formattedSqlEmptyDescription}
          errorDescription={errorDescription}
          errorTitle={messages.formattingErrorLabel}
          state={displayState}
          value={formattedSql}
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end gap-3 border-t">
        <ToolCopyButton
          value={formattedSql}
          copyLabel={messages.copySqlLabel}
          copiedLabel={messages.copiedLabel}
          disabled={formatResult.state !== "formatted"}
        />

        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={downloadFilename}>
              <Download data-icon="inline-start" />
              {messages.downloadSqlLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadSqlLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { FormattedSqlCard }
