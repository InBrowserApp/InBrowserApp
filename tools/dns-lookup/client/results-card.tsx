import { useMemo, type ReactNode } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/ui/tooltip"
import { FileJson2, Search, TriangleAlert } from "@workspace/ui/icons"

import {
  getResponseCode,
  type DnsJsonResponse,
  type DnsLookupResult,
} from "../core/dns-lookup"
import { AnswerTable } from "./answer-table"
import type { DnsLookupMessages, LookupState } from "./types"

type ResultsCardProps = Readonly<{
  language: string
  messages: DnsLookupMessages
  state: LookupState
}>

const DNS_FLAGS = ["TC", "RD", "RA", "AD", "CD"] as const

function ResultsCard({ language, messages, state }: ResultsCardProps) {
  return (
    <Card className="gap-0 overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.resultsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="min-w-0 p-0">
        {state.status === "idle" ? (
          <EmptyState
            description={messages.idleDescription}
            icon={<Search />}
            title={messages.idleTitle}
          />
        ) : state.status === "loading" ? (
          <EmptyState
            description={messages.queryDescription}
            icon={<Spinner />}
            title={messages.lookingUpButton}
          />
        ) : state.status === "error" ? (
          <div className="p-6">
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>{messages.errorTitle}</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="grid min-w-0 gap-4 p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">{state.domain}</Badge>
              <span>{state.serverLabel}</span>
            </div>
            {state.results.map((result) => (
              <RecordResult
                key={result.recordType}
                language={language}
                messages={messages}
                result={result}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function EmptyState({
  description,
  icon,
  title,
}: Readonly<{
  description: string
  icon: ReactNode
  title: string
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

function RecordResult({
  language,
  messages,
  result,
}: Readonly<{
  language: string
  messages: DnsLookupMessages
  result: DnsLookupResult
}>) {
  const responseCode = getResponseCode(result.response.Status)
  const rawJson = useMemo(
    () => JSON.stringify(result.response, null, 2),
    [result.response]
  )

  return (
    <section className="min-w-0 rounded-lg border bg-background">
      <div className="flex min-w-0 flex-col gap-3 border-b p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <h3 className="font-mono text-base font-semibold">
            {result.recordType}
          </h3>
          <div className="flex flex-wrap gap-2">
            <TooltipProvider disableHoverableContent>
              <StatusBadge
                description={responseCode.description}
                messages={messages}
                name={responseCode.name}
                success={result.response.Status === 0}
              />
              {DNS_FLAGS.map((flag) => (
                <FlagBadge
                  key={flag}
                  active={result.response[flag]}
                  label={flag}
                  messages={messages}
                />
              ))}
            </TooltipProvider>
          </div>
        </div>
        <ToolCopyButton
          value={rawJson}
          copyLabel={messages.copyRawJson}
          copiedLabel={messages.copied}
        />
      </div>
      <div className="grid min-w-0 gap-4 p-4">
        {result.response.Comment ? (
          <Alert>
            <FileJson2 />
            <AlertTitle>{messages.responseComment}</AlertTitle>
            <AlertDescription>{result.response.Comment}</AlertDescription>
          </Alert>
        ) : null}
        <AnswerTable
          answers={result.response.Answer ?? []}
          language={language}
          messages={messages}
        />
        <details className="min-w-0 rounded-lg border bg-muted/20">
          <summary className="cursor-pointer px-3 py-2 text-sm font-medium">
            {messages.rawJson}
          </summary>
          <pre className="max-h-72 overflow-auto border-t p-3 text-xs leading-5 break-words whitespace-pre-wrap">
            {rawJson}
          </pre>
        </details>
      </div>
    </section>
  )
}

function StatusBadge({
  description,
  messages,
  name,
  success,
}: Readonly<{
  description: string
  messages: DnsLookupMessages
  name: string
  success: boolean
}>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          aria-label={`${messages.statusLabel}: ${name}. ${description}`}
          className="cursor-help"
          tabIndex={0}
          variant={success ? "default" : "destructive"}
        >
          {messages.statusLabel}: {name}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  )
}

function FlagBadge({
  active,
  label,
  messages,
}: Readonly<{
  active: boolean
  label: keyof DnsJsonResponse & (typeof DNS_FLAGS)[number]
  messages: DnsLookupMessages
}>) {
  const stateLabel = active ? messages.on : messages.off

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          aria-label={`${label} ${stateLabel}: ${messages.flagDescriptions[label]}`}
          className="cursor-help"
          tabIndex={0}
          variant={active ? "secondary" : "outline"}
        >
          {label} {stateLabel}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {label}: {messages.flagDescriptions[label]}
      </TooltipContent>
    </Tooltip>
  )
}

export { ResultsCard }
