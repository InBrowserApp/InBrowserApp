import { Badge } from "@workspace/ui/components/ui/badge"
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
import { FileJson2 } from "@workspace/ui/icons"

import { getRecordTypeName, type DnsJsonAnswer } from "../core/dns-lookup"
import type { DnsLookupMessages } from "./types"

type AnswerTableProps = Readonly<{
  answers: readonly DnsJsonAnswer[]
  language: string
  messages: DnsLookupMessages
}>

function AnswerTable({ answers, language, messages }: AnswerTableProps) {
  if (answers.length === 0) {
    return (
      <Empty className="rounded-lg border py-8">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileJson2 />
          </EmptyMedia>
          <EmptyTitle>{messages.emptyAnswersTitle}</EmptyTitle>
          <EmptyDescription>
            {messages.emptyAnswersDescription}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {answers.map((answer, index) => (
          <MobileAnswerCard
            key={`${answer.name}-${answer.type}-${index}`}
            answer={answer}
            language={language}
            messages={messages}
          />
        ))}
      </div>
      <div className="hidden min-w-0 overflow-hidden rounded-lg border md:block">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[32%]">{messages.answerName}</TableHead>
              <TableHead className="w-24">{messages.answerType}</TableHead>
              <TableHead className="w-24">{messages.answerTtl}</TableHead>
              <TableHead>{messages.answerData}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {answers.map((answer, index) => (
              <TableRow key={`${answer.name}-${answer.type}-${index}`}>
                <TableCell className="font-mono text-xs break-all whitespace-normal">
                  {answer.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getRecordTypeName(answer.type)}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {formatNumber(answer.TTL, language)}
                </TableCell>
                <TableCell className="font-mono text-xs break-all whitespace-normal">
                  {answer.data}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

function MobileAnswerCard({
  answer,
  language,
  messages,
}: Readonly<{
  answer: DnsJsonAnswer
  language: string
  messages: DnsLookupMessages
}>) {
  return (
    <article className="min-w-0 rounded-lg border bg-muted/20 p-3">
      <dl className="grid gap-3">
        <AnswerField label={messages.answerName} value={answer.name} />
        <div className="grid gap-1">
          <dt className="text-xs font-medium text-muted-foreground">
            {messages.answerType}
          </dt>
          <dd>
            <Badge variant="outline">{getRecordTypeName(answer.type)}</Badge>
          </dd>
        </div>
        <AnswerField
          label={messages.answerTtl}
          value={formatNumber(answer.TTL, language)}
        />
        <AnswerField label={messages.answerData} value={answer.data} />
      </dl>
    </article>
  )
}

function AnswerField({
  label,
  value,
}: Readonly<{
  label: string
  value: string
}>) {
  return (
    <div className="grid min-w-0 gap-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="font-mono text-xs break-all">{value}</dd>
    </div>
  )
}

function formatNumber(value: number, language: string) {
  return new Intl.NumberFormat(language).format(value)
}

export { AnswerTable }
