import type { ReactNode } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardAction,
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
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { Network, TriangleAlert } from "@workspace/ui/icons"

import { parseReverseIpInput } from "../core/reverse-ip"

import type { ReverseLookupResult } from "../core/reverse-ip"
import type { LookupState, ReverseIpLookupMessages } from "../types"

type ResultCardProps = Readonly<{
  inputState: ReturnType<typeof parseReverseIpInput>
  lookupState: LookupState
  resolverUrl: string
  messages: ReverseIpLookupMessages
}>

function ResultCard({
  inputState,
  lookupState,
  resolverUrl,
  messages,
}: ResultCardProps) {
  const target = inputState.status === "valid" ? inputState.target : null
  const result = lookupState.status === "success" ? lookupState.result : null
  const answerText =
    result?.answers.map((answer) => answer.rawHostname).join("\n") ?? ""

  return (
    <Card className="gap-0 overflow-hidden border-border/70 py-0 shadow-sm">
      <CardHeader className="border-b py-4">
        <div className="grid gap-1">
          <CardTitle>{messages.resultTitle}</CardTitle>
          <CardDescription>{messages.resultDescription}</CardDescription>
        </div>
        {target ? (
          <CardAction>
            <ToolCopyButton
              value={target.reverseDomain}
              copyLabel={messages.copyReverseDomain}
              copiedLabel={messages.copied}
            />
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="p-0">
        {lookupState.status === "loading" ? (
          <StatusEmpty
            icon={<Spinner />}
            title={messages.loadingTitle}
            description={messages.loadingDescription}
          />
        ) : inputState.status === "invalid" ? (
          <ResultAlert
            title={messages.invalidIpTitle}
            description={messages.invalidIpDescription}
          />
        ) : lookupState.status === "error" ? (
          <ResultAlert
            title={messages.lookupFailedTitle}
            description={messages.lookupFailedDescription}
          />
        ) : result ? (
          <div className="grid gap-5 p-4">
            <ResultSummary result={result} messages={messages} />
            <PtrAnswerTable
              result={result}
              answerText={answerText}
              messages={messages}
            />
          </div>
        ) : (
          <StatusEmpty
            icon={<Network />}
            title={messages.idleTitle}
            description={`${messages.idleDescription} ${resolverUrl}`}
          />
        )}
      </CardContent>
    </Card>
  )
}

function ResultAlert({
  title,
  description,
}: Readonly<{
  title: string
  description: string
}>) {
  return (
    <div className="p-4">
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  )
}

function ResultSummary({
  result,
  messages,
}: Readonly<{
  result: ReverseLookupResult
  messages: ReverseIpLookupMessages
}>) {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <Badge>
          {result.target.version === "ipv4" ? messages.ipv4 : messages.ipv6}
        </Badge>
        <Badge
          variant={result.response.Status === 0 ? "secondary" : "destructive"}
        >
          {result.rcode}
        </Badge>
        <Badge variant="outline">
          {new Intl.NumberFormat().format(result.answers.length)}
        </Badge>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <SummaryItem
          label={messages.reverseDomain}
          value={result.target.reverseDomain}
        />
        <SummaryItem label={messages.resolver} value={result.resolverUrl} />
        <SummaryItem label={messages.dnsStatus} value={result.rcode} />
        <SummaryItem
          label={messages.addressFamily}
          value={
            result.target.version === "ipv4" ? messages.ipv4 : messages.ipv6
          }
        />
      </dl>
    </div>
  )
}

function SummaryItem({
  label,
  value,
}: Readonly<{
  label: string
  value: string
}>) {
  return (
    <div className="min-w-0 rounded-xl border border-border/70 bg-card p-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd
        dir="ltr"
        className="mt-1 font-mono text-sm break-all [unicode-bidi:isolate]"
      >
        {value}
      </dd>
    </div>
  )
}

function PtrAnswerTable({
  result,
  answerText,
  messages,
}: Readonly<{
  result: ReverseLookupResult
  answerText: string
  messages: ReverseIpLookupMessages
}>) {
  if (result.answers.length === 0) {
    return (
      <StatusEmpty
        icon={<Network />}
        title={messages.noRecordsTitle}
        description={messages.noRecordsDescription}
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/70">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="grid gap-1">
          <h3 className="font-medium">{messages.ptrRecordsTitle}</h3>
          <p className="text-sm text-muted-foreground">
            {messages.ptrRecordsDescription}
          </p>
        </div>
        <ToolCopyButton
          value={answerText}
          copyLabel={messages.copyHostnames}
          copiedLabel={messages.copied}
        />
      </div>
      <ScrollArea className="w-full">
        <div className="min-w-[42rem]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>{messages.hostname}</TableHead>
                <TableHead className="w-32">{messages.ttl}</TableHead>
                <TableHead>{messages.rawValue}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.answers.map((answer) => (
                <TableRow key={`${answer.rawHostname}-${answer.ttl}`}>
                  <TableCell className="font-mono font-medium break-all">
                    {answer.hostname}
                  </TableCell>
                  <TableCell className="font-mono">
                    {answer.ttl} {messages.secondsAbbreviation}
                  </TableCell>
                  <TableCell className="font-mono break-all text-muted-foreground">
                    {answer.rawHostname}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

function StatusEmpty({
  icon,
  title,
  description,
}: Readonly<{
  icon: ReactNode
  title: string
  description: string
}>) {
  return (
    <Empty className="rounded-none border-0 py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export { ResultCard }
