import type { ReactNode } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { AtSign } from "@workspace/ui/icons"

import type {
  EmailValidationAnalysis,
  EmailValidatorMessages,
} from "../client/types"

type EmailResultsCardProps = Readonly<{
  analysis: EmailValidationAnalysis | null
  feedbackMessage: string | null
  messages: EmailValidatorMessages
}>

function EmailResultsCard({
  analysis,
  feedbackMessage,
  messages,
}: EmailResultsCardProps) {
  const description = analysis ? feedbackMessage : messages.meta.description

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
                label={messages.status}
                value={
                  <Badge variant={analysis.isValid ? "default" : "destructive"}>
                    {analysis.isValid ? messages.valid : messages.invalid}
                  </Badge>
                }
              />
              <MetricTile
                label={messages.normalized}
                value={
                  <span className="font-mono text-sm break-all">
                    {analysis.normalized || messages.notAvailable}
                  </span>
                }
              />
              <MetricTile
                label={messages.localPart}
                value={
                  <span className="font-mono text-sm break-all">
                    {analysis.localPart || messages.notAvailable}
                  </span>
                }
              />
              <MetricTile
                label={messages.domain}
                value={
                  <span className="font-mono text-sm break-all">
                    {analysis.domain || messages.notAvailable}
                  </span>
                }
              />
            </section>

            <section className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label={messages.emailLength}
                value={
                  analysis.length > 0
                    ? String(analysis.length)
                    : messages.notAvailable
                }
              />
              <MetricTile
                label={messages.localLength}
                value={
                  analysis.localLength > 0
                    ? String(analysis.localLength)
                    : messages.notAvailable
                }
              />
              <MetricTile
                label={messages.domainLength}
                value={
                  analysis.domainLength > 0
                    ? String(analysis.domainLength)
                    : messages.notAvailable
                }
              />
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <CheckTile
                label={messages.lengthCheck}
                messages={messages}
                isAvailable={analysis.length > 0}
                isPassing={analysis.isLengthValid}
              />
              <CheckTile
                label={messages.localCheck}
                messages={messages}
                isAvailable={analysis.localLength > 0}
                isPassing={
                  analysis.isLocalLengthValid &&
                  analysis.isLocalCharsValid &&
                  analysis.isLocalDotsValid
                }
              />
              <CheckTile
                label={messages.domainCheck}
                messages={messages}
                isAvailable={analysis.domainLength > 0}
                isPassing={
                  analysis.isDomainLengthValid &&
                  analysis.isDomainCharsValid &&
                  analysis.isDomainDotsValid &&
                  analysis.isDomainLabelLengthValid &&
                  analysis.isDomainLabelCharsValid
                }
              />
              <CheckTile
                label={messages.tldCheck}
                messages={messages}
                isAvailable={analysis.domainLength > 0}
                isPassing={analysis.isTldValid}
              />
            </section>
          </>
        ) : (
          <Empty className="min-h-64 flex-1 border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AtSign />
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
  isAvailable,
  isPassing,
}: Readonly<{
  label: string
  messages: EmailValidatorMessages
  isAvailable: boolean
  isPassing: boolean
}>) {
  return (
    <MetricTile
      label={label}
      value={
        <Badge
          variant={
            isAvailable ? (isPassing ? "default" : "destructive") : "outline"
          }
        >
          {isAvailable
            ? isPassing
              ? messages.pass
              : messages.fail
            : messages.notAvailable}
        </Badge>
      }
    />
  )
}

export { EmailResultsCard }
