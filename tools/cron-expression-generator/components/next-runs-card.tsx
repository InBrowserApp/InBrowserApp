import {
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { Clock3 } from "@workspace/ui/icons"

import { formatMessage } from "./format"

import type { CronExpressionGeneratorMessages } from "../types"

type NextRunsCardProps = Readonly<{
  language: string
  messages: CronExpressionGeneratorMessages
  referenceMs: number
  runTimes: readonly Date[]
}>

function NextRunsCard({
  language,
  messages,
  referenceMs,
  runTimes,
}: NextRunsCardProps) {
  return (
    <>
      <CardHeader className="border-b">
        <CardTitle>{messages.nextRuns.title}</CardTitle>
        <CardDescription>{messages.nextRuns.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {runTimes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  {messages.nextRuns.indexHeader}
                </TableHead>
                <TableHead>{messages.nextRuns.dateHeader}</TableHead>
                <TableHead>{messages.nextRuns.relativeHeader}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runTimes.map((runTime, index) => (
                <TableRow key={runTime.getTime()}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-mono">
                    {formatRunDate(runTime, language)}
                  </TableCell>
                  <TableCell>
                    {formatRelativeRun(runTime, referenceMs, messages)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Empty className="min-h-48">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Clock3 />
              </EmptyMedia>
              <EmptyTitle>{messages.nextRuns.emptyTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.nextRuns.emptyDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </>
  )
}

function formatRunDate(runTime: Date, language: string) {
  return new Intl.DateTimeFormat(language, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(runTime)
}

function formatRelativeRun(
  runTime: Date,
  referenceMs: number,
  messages: CronExpressionGeneratorMessages
) {
  const diffMinutes = Math.max(
    0,
    Math.round((runTime.getTime() - referenceMs) / 60_000)
  )

  if (diffMinutes < 1) {
    return messages.nextRuns.soon
  }

  if (diffMinutes < 60) {
    return formatMessage(messages.nextRuns.inMinutes, { count: diffMinutes })
  }

  const diffHours = Math.round(diffMinutes / 60)

  if (diffHours < 48) {
    return formatMessage(messages.nextRuns.inHours, { count: diffHours })
  }

  return formatMessage(messages.nextRuns.inDays, {
    count: Math.round(diffHours / 24),
  })
}

export { NextRunsCard }
