import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { BadgeCheck, FileJson2, TriangleAlert } from "@workspace/ui/icons"

import type { ValidationResult } from "../core/validate-json-schema"
import type { JsonSchemaMessages } from "./types"

type ResultCardProps = Readonly<{
  errorsJson: string
  messages: JsonSchemaMessages
  validation: ValidationResult
}>

export function ResultCard({
  errorsJson,
  messages,
  validation,
}: ResultCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {validation.state === "idle" ? (
          <Alert>
            <FileJson2 />
            <AlertTitle>{messages.idleTitle}</AlertTitle>
            <AlertDescription>{messages.idleDescription}</AlertDescription>
          </Alert>
        ) : null}

        {validation.state === "parse-error" ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.parseErrorTitle}</AlertTitle>
            <AlertDescription>
              <span className="font-medium">
                {validation.source === "schema"
                  ? messages.schemaLabel
                  : messages.dataLabel}
                :
              </span>{" "}
              {validation.message}
            </AlertDescription>
          </Alert>
        ) : null}

        {validation.state === "schema-error" ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.schemaErrorTitle}</AlertTitle>
            <AlertDescription>{validation.message}</AlertDescription>
          </Alert>
        ) : null}

        {validation.state === "validated" && validation.valid ? (
          <Alert>
            <BadgeCheck />
            <AlertTitle>{messages.validTitle}</AlertTitle>
            <AlertDescription>{messages.validDescription}</AlertDescription>
          </Alert>
        ) : null}

        {validation.state === "validated" && !validation.valid ? (
          <>
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>{messages.invalidTitle}</AlertTitle>
              <AlertDescription>{messages.invalidDescription}</AlertDescription>
            </Alert>

            <div className="rounded-xl border border-border/70">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{messages.errorPathLabel}</TableHead>
                    <TableHead>{messages.errorKeywordLabel}</TableHead>
                    <TableHead>{messages.errorMessageLabel}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validation.issues.map((issue) => (
                    <TableRow
                      key={`${issue.path}:${issue.keyword}:${issue.message}`}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {issue.path}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {issue.keyword}
                      </TableCell>
                      <TableCell>{issue.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : null}
      </CardContent>
      {errorsJson ? (
        <CardFooter className="justify-end">
          <ToolCopyButton
            value={errorsJson}
            copyLabel={messages.copyErrorsLabel}
            copiedLabel={messages.copiedLabel}
          />
        </CardFooter>
      ) : null}
    </Card>
  )
}
