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
import { Binary } from "@workspace/ui/icons"

import type {
  IMEIValidationAnalysis,
  IMEIValidatorMessages,
} from "../client/types"

type IMEIResultsCardProps = Readonly<{
  analysis: IMEIValidationAnalysis | null
  feedbackMessage: string | null
  messages: IMEIValidatorMessages
}>

function IMEIResultsCard({
  analysis,
  feedbackMessage,
  messages,
}: IMEIResultsCardProps) {
  const description = analysis ? feedbackMessage : messages.meta.description

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.result}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {analysis ? (
          <section className="grid gap-3 sm:grid-cols-2">
            <DetailItem
              label={messages.status}
              content={
                <Badge variant={analysis.isValid ? "default" : "destructive"}>
                  {analysis.isValid ? messages.valid : messages.invalid}
                </Badge>
              }
            />
            <DetailItem
              label={messages.reason}
              content={<span className="font-medium">{feedbackMessage}</span>}
            />
            <DetailItem
              label={messages.normalized}
              content={
                <span className="font-mono text-sm break-all">
                  {analysis.normalized || "-"}
                </span>
              }
            />
            <DetailItem
              label={messages.expectedCheckDigit}
              content={
                <span className="font-medium">
                  {analysis.expectedCheckDigit ?? "-"}
                </span>
              }
            />
            <DetailItem
              label={messages.actualCheckDigit}
              content={
                <span className="font-medium">
                  {analysis.actualCheckDigit ?? "-"}
                </span>
              }
            />
          </section>
        ) : (
          <Empty className="min-h-64 flex-1 border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Binary />
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

function DetailItem({
  label,
  content,
}: Readonly<{ label: string; content: ReactNode }>) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-2 text-sm leading-6">{content}</div>
    </div>
  )
}

export { IMEIResultsCard }
