import { Alert, AlertTitle } from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
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
import { ScrollArea, ScrollBar } from "@workspace/ui/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { Clock3, TriangleAlert } from "@workspace/ui/icons"

import type { CronField, CronValidationResult } from "../core/cron"
import type { CronExpressionParserMessages } from "../types"

type CronResultsCardProps = Readonly<{
  description: string
  fields: readonly CronField[]
  isValid: boolean
  language: string
  messages: CronExpressionParserMessages
  nowMs: number
  runTimes: readonly Date[]
  timeZoneLabel: string
  validation: CronValidationResult
}>

function formatDateTime(value: Date, language: string) {
  return new Intl.DateTimeFormat(language, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(value)
}

function formatTemplate(template: string, count: string) {
  return template.replace("{count}", count)
}

function formatRelativeTime(
  value: Date,
  nowMs: number,
  language: string,
  messages: CronExpressionParserMessages
) {
  const seconds = Math.max(0, Math.round((value.getTime() - nowMs) / 1000))
  const numberFormatter = new Intl.NumberFormat(language)

  if (seconds < 5) {
    return messages.relative.now
  }

  if (seconds < 60) {
    return formatTemplate(
      messages.relative.inSeconds,
      numberFormatter.format(seconds)
    )
  }

  const minutes = Math.round(seconds / 60)

  if (minutes < 60) {
    return formatTemplate(
      messages.relative.inMinutes,
      numberFormatter.format(minutes)
    )
  }

  const hours = Math.round(minutes / 60)

  if (hours < 24) {
    return formatTemplate(
      messages.relative.inHours,
      numberFormatter.format(hours)
    )
  }

  return formatTemplate(
    messages.relative.inDays,
    numberFormatter.format(Math.round(hours / 24))
  )
}

function CronResultsCard({
  description,
  fields,
  isValid,
  language,
  messages,
  nowMs,
  runTimes,
  timeZoneLabel,
  validation,
}: CronResultsCardProps) {
  return (
    <Card className="gap-0 overflow-hidden pb-0">
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-2">
            <CardTitle>{messages.schedule.title}</CardTitle>
            <CardDescription>{messages.schedule.description}</CardDescription>
          </div>
          <Badge variant={isValid ? "secondary" : "destructive"}>
            {isValid ? messages.input.valid : messages.input.invalid}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 p-4">
        {validation.state === "empty" ? (
          <Empty className="rounded-none border-0 py-10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Clock3 />
              </EmptyMedia>
              <EmptyTitle>{messages.schedule.emptyTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.schedule.emptyDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {validation.state === "invalid" ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{validation.error}</AlertTitle>
          </Alert>
        ) : null}

        {isValid ? (
          <>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                {messages.schedule.summaryLabel}
              </p>
              <p className="text-lg font-medium text-balance">{description}</p>
              <p className="text-sm text-muted-foreground">
                {messages.input.timezoneNote.replace(
                  "{timeZone}",
                  timeZoneLabel
                )}
              </p>
            </div>

            <CronFieldTable fields={fields} messages={messages} />
            <CronRunTimesTable
              language={language}
              messages={messages}
              nowMs={nowMs}
              runTimes={runTimes}
            />
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

type CronFieldTableProps = Readonly<{
  fields: readonly CronField[]
  messages: CronExpressionParserMessages
}>

function CronFieldTable({ fields, messages }: CronFieldTableProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">{messages.breakdown.title}</h2>
        <p className="text-sm text-muted-foreground">
          {messages.breakdown.description}
        </p>
      </div>
      <ScrollArea className="w-full overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{messages.breakdown.field}</TableHead>
              <TableHead>{messages.breakdown.value}</TableHead>
              <TableHead>{messages.breakdown.allowedRange}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell>{messages.breakdown.fields[field.id]}</TableCell>
                <TableCell className="font-mono">{field.value}</TableCell>
                <TableCell className="font-mono text-muted-foreground">
                  {field.range}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}

type CronRunTimesTableProps = Readonly<{
  language: string
  messages: CronExpressionParserMessages
  nowMs: number
  runTimes: readonly Date[]
}>

function CronRunTimesTable({
  language,
  messages,
  nowMs,
  runTimes,
}: CronRunTimesTableProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium">{messages.schedule.title}</h2>
      <ScrollArea className="w-full overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>{messages.schedule.dateTimeLabel}</TableHead>
              <TableHead>{messages.schedule.relativeLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runTimes.map((runTime, index) => (
              <TableRow key={runTime.toISOString()}>
                <TableCell className="font-mono">{index + 1}</TableCell>
                <TableCell className="font-mono">
                  {formatDateTime(runTime, language)}
                </TableCell>
                <TableCell>
                  {formatRelativeTime(runTime, nowMs, language, messages)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}

export { CronResultsCard }
