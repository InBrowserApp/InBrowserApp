import type { ReactNode } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
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
import { CreditCard } from "@workspace/ui/icons"

import type {
  CreditCardValidationAnalysis,
  CreditCardValidatorMessages,
} from "../client/types"

type CreditCardResultsCardProps = Readonly<{
  analysis: CreditCardValidationAnalysis | null
  feedbackMessage: string | null
  messages: CreditCardValidatorMessages
}>

function CreditCardResultsCard({
  analysis,
  feedbackMessage,
  messages,
}: CreditCardResultsCardProps) {
  const description = feedbackMessage ?? messages.meta.description

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.result}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {analysis ? (
          <>
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricTile
                label={messages.brand}
                value={
                  <Badge variant={analysis.brand ? "secondary" : "outline"}>
                    {analysis.brand?.name ?? messages.unknown}
                  </Badge>
                }
              />
              <MetricTile
                label={messages.formattedNumber}
                value={
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm break-all">
                      {analysis.formattedNumber || "-"}
                    </span>
                    {analysis.digits ? (
                      <ToolCopyButton
                        value={analysis.digits}
                        copyLabel={messages.copyResultLabel}
                        copiedLabel={messages.copiedLabel}
                      />
                    ) : null}
                  </div>
                }
              />
              <MetricTile
                label={messages.digits}
                value={analysis.digits ? String(analysis.digits.length) : "-"}
              />
              <MetricTile
                label={messages.cvcLength}
                value={
                  analysis.brand
                    ? `${analysis.brand.cvcLength} ${messages.digitsLabel}`
                    : "-"
                }
              />
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <CheckTile
                label={messages.luhnCheck}
                messages={messages}
                isPassing={analysis.isLuhnValid}
              />
              <CheckTile
                label={messages.lengthCheck}
                messages={messages}
                isPassing={analysis.isLengthValid}
                note={
                  analysis.brand
                    ? messages.expectedLength.replace(
                        "{lengths}",
                        analysis.brand.lengths.join(", ")
                      )
                    : null
                }
              />
            </section>
          </>
        ) : (
          <Empty className="min-h-64 flex-1 border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CreditCard />
              </EmptyMedia>
              <EmptyTitle>{messages.result}</EmptyTitle>
              <EmptyDescription>{messages.meta.description}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

function MetricTile({
  label,
  value,
}: Readonly<{ label: string; value: ReactNode }>) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-2 text-sm leading-6">{value}</div>
    </div>
  )
}

function CheckTile({
  label,
  messages,
  isPassing,
  note = null,
}: Readonly<{
  label: string
  messages: CreditCardValidatorMessages
  isPassing: boolean
  note?: string | null
}>) {
  return (
    <MetricTile
      label={label}
      value={
        <div className="space-y-2">
          <Badge variant={isPassing ? "default" : "destructive"}>
            {isPassing ? messages.pass : messages.fail}
          </Badge>
          {note ? (
            <p className="text-xs text-muted-foreground">{note}</p>
          ) : null}
        </div>
      }
    />
  )
}

export { CreditCardResultsCard }
