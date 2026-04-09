import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { BadgeCheck, FileText } from "@workspace/ui/icons"

import type { SqlFormatterAndLinterMessages } from "../client/types"
import type { SqlLintIssue } from "../core/sql-format"

type LintResultsCardProps = Readonly<{
  issues: SqlLintIssue[]
  messages: SqlFormatterAndLinterMessages
  sourceSql: string
}>

function LintResultsCard({
  issues,
  messages,
  sourceSql,
}: LintResultsCardProps) {
  const counts = issues.reduce(
    (accumulator, issue) => {
      accumulator[issue.severity] += 1
      return accumulator
    },
    { error: 0, warning: 0, info: 0 }
  )
  const hasSource = Boolean(sourceSql.trim())

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.lintResultsLabel}</CardTitle>
        <CardDescription>{messages.lintResultsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!hasSource ? (
          <Alert>
            <FileText />
            <AlertTitle>{messages.lintIdleTitle}</AlertTitle>
            <AlertDescription>{messages.lintIdleDescription}</AlertDescription>
          </Alert>
        ) : null}

        {hasSource && issues.length === 0 ? (
          <Alert>
            <BadgeCheck />
            <AlertTitle>{messages.lintCleanTitle}</AlertTitle>
            <AlertDescription>{messages.lintCleanDescription}</AlertDescription>
          </Alert>
        ) : null}

        {hasSource && issues.length > 0 ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="destructive">
                {messages.errorCountLabel.replace(
                  "{count}",
                  String(counts.error)
                )}
              </Badge>
              <Badge variant="secondary">
                {messages.warningCountLabel.replace(
                  "{count}",
                  String(counts.warning)
                )}
              </Badge>
              <Badge variant="outline">
                {messages.infoCountLabel.replace(
                  "{count}",
                  String(counts.info)
                )}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {messages.issueCountLabel.replace(
                  "{count}",
                  String(issues.length)
                )}
              </span>
            </div>

            <div className="rounded-xl border border-border/70">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{messages.severityLabel}</TableHead>
                    <TableHead>{messages.codeLabel}</TableHead>
                    <TableHead>{messages.locationLabel}</TableHead>
                    <TableHead>{messages.messageLabel}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue) => (
                    <TableRow
                      key={`${issue.code}:${issue.line}:${issue.column}:${issue.message}`}
                    >
                      <TableCell>
                        <Badge variant={severityVariant(issue.severity)}>
                          {severityLabel(issue.severity, messages)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {issue.code}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {`L${issue.line}:C${issue.column}`}
                      </TableCell>
                      <TableCell className="max-w-xl whitespace-normal">
                        {issue.message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

function severityVariant(severity: SqlLintIssue["severity"]) {
  switch (severity) {
    case "error":
      return "destructive" as const
    case "warning":
      return "secondary" as const
    case "info":
      return "outline" as const
  }
}

function severityLabel(
  severity: SqlLintIssue["severity"],
  messages: SqlFormatterAndLinterMessages
) {
  switch (severity) {
    case "error":
      return messages.errorSeverityLabel
    case "warning":
      return messages.warningSeverityLabel
    case "info":
      return messages.infoSeverityLabel
  }
}

export { LintResultsCard }
