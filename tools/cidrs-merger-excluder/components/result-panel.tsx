import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
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
import { Network } from "@workspace/ui/icons"

import type { CidrMergeExcludeResult } from "../core/cidr-merge-exclude"
import type { CidrsMergerExcluderMessages } from "../types"

type StatusCopy = Readonly<{ title: string; description: string }> | null

function ResultPanel({
  result,
  messages,
  statusCopy,
}: Readonly<{
  result: CidrMergeExcludeResult
  messages: CidrsMergerExcluderMessages
  statusCopy: StatusCopy
}>) {
  const copyValue = result.status === "success" ? result.cidrs.join("\n") : ""

  return (
    <Card className="gap-0 overflow-hidden pb-0">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle>{messages.resultTitle}</CardTitle>
            <CardDescription>{messages.resultDescription}</CardDescription>
          </div>
          <ToolCopyButton
            value={copyValue}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            disabled={result.status !== "success" || result.cidrs.length === 0}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {result.status === "success" ? (
          <SuccessResult result={result} messages={messages} />
        ) : (
          <StatusEmptyState messages={messages} statusCopy={statusCopy} />
        )}
      </CardContent>
    </Card>
  )
}

function SuccessResult({
  result,
  messages,
}: Readonly<{
  result: Extract<CidrMergeExcludeResult, { status: "success" }>
  messages: CidrsMergerExcluderMessages
}>) {
  return (
    <>
      <div className="grid gap-4 border-b px-6 py-4 md:grid-cols-4">
        <SummaryMetric
          label={messages.mergedInputCountLabel}
          value={String(result.mergeInputCount)}
        />
        <SummaryMetric
          label={messages.excludedInputCountLabel}
          value={String(result.excludeInputCount)}
        />
        <SummaryMetric
          label={messages.outputCountLabel}
          value={String(result.cidrs.length)}
        />
        <div>
          <p className="text-sm text-muted-foreground">
            {messages.familyLabel}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.familyLabels.map((family) => (
              <Badge key={family} variant="outline">
                {family}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {result.cidrs.length === 0 ? (
        <NoCidrsState messages={messages} />
      ) : (
        <CidrList cidrs={result.cidrs} />
      )}
    </>
  )
}

function NoCidrsState({
  messages,
}: Readonly<{ messages: CidrsMergerExcluderMessages }>) {
  return (
    <div className="px-6 py-10">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Network className="size-4" />
          </EmptyMedia>
          <EmptyTitle>{messages.noCidrsTitle}</EmptyTitle>
          <EmptyDescription>{messages.noCidrsDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

function CidrList({ cidrs }: Readonly<{ cidrs: readonly string[] }>) {
  return (
    <ScrollArea className="h-[34rem] w-full">
      <ol className="flex min-w-0 flex-col">
        {cidrs.map((cidr, index) => (
          <li
            key={`${cidr}-${index}`}
            className="flex items-start gap-4 border-b px-6 py-3 last:border-b-0"
          >
            <span className="w-8 shrink-0 text-sm text-muted-foreground">
              {index + 1}
            </span>
            <span className="min-w-0 font-mono text-sm break-all">{cidr}</span>
          </li>
        ))}
      </ol>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

function SummaryMetric({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  )
}

function StatusEmptyState({
  messages,
  statusCopy,
}: Readonly<{
  messages: CidrsMergerExcluderMessages
  statusCopy: StatusCopy
}>) {
  return (
    <div className="px-6 py-10">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Network className="size-4" />
          </EmptyMedia>
          <EmptyTitle>{statusCopy?.title ?? messages.emptyTitle}</EmptyTitle>
          <EmptyDescription>
            {statusCopy?.description ?? messages.emptyDescription}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

export { ResultPanel }
