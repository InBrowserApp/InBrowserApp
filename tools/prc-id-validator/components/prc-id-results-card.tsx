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
import { FileText } from "@workspace/ui/icons"

import type {
  PRCIdValidationAnalysis,
  PRCIdValidatorMessages,
} from "../client/types"
import {
  CopySummary,
  DetailTile,
  PanelLabel,
  PanelShell,
  SplitDetailPanel,
} from "./result-panels"

type PRCIdResultsCardProps = Readonly<{
  analysis: PRCIdValidationAnalysis | null
  feedbackMessage: string | null
  messages: PRCIdValidatorMessages
}>

function PRCIdResultsCard({
  analysis,
  feedbackMessage,
  messages,
}: PRCIdResultsCardProps) {
  const description =
    analysis && !analysis.isPartial && feedbackMessage
      ? feedbackMessage
      : messages.meta.description
  const showCompleteStatus = analysis ? !analysis.isPartial : false

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.result}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {analysis ? (
          <>
            <PanelShell className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
              <div>
                <PanelLabel>{messages.status}</PanelLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{analysis.length}/18</Badge>
                  {showCompleteStatus ? (
                    <Badge
                      variant={analysis.isValid ? "default" : "destructive"}
                    >
                      {analysis.isValid ? messages.valid : messages.invalid}
                    </Badge>
                  ) : null}
                </div>
              </div>

              <CopySummary
                className="min-w-0"
                label={messages.normalized}
                value={analysis.normalized}
                messages={messages}
              />
            </PanelShell>

            <section className="grid gap-3 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <PanelShell className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <PanelLabel>{messages.region}</PanelLabel>
                  </div>

                  <CopySummary
                    className="min-w-[12rem]"
                    label={messages.regionCode}
                    value={analysis.regionCode}
                    messages={messages}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <DetailTile
                    label={messages.province}
                    value={analysis.provinceName ?? messages.notAvailable}
                  />
                  <DetailTile
                    label={messages.city}
                    value={analysis.cityName ?? messages.notAvailable}
                  />
                  <DetailTile
                    label={messages.district}
                    value={analysis.areaName ?? messages.notAvailable}
                  />
                </div>
              </PanelShell>

              <div className="grid gap-3">
                <PanelShell className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <PanelLabel>{messages.birthdate}</PanelLabel>
                      <p className="mt-2 font-mono text-xl leading-tight font-semibold">
                        {getBirthSummary(analysis)}
                      </p>
                    </div>
                    <DetailTile
                      className="min-w-[7rem]"
                      label={messages.age}
                      value={
                        analysis.age !== null
                          ? String(analysis.age)
                          : messages.notAvailable
                      }
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <DetailTile
                      label="YYYY"
                      value={formatBirthPart(analysis.birthYearInput, "YYYY")}
                    />
                    <DetailTile
                      label="MM"
                      value={formatBirthPart(analysis.birthMonthInput, "MM")}
                    />
                    <DetailTile
                      label="DD"
                      value={formatBirthPart(analysis.birthDayInput, "DD")}
                    />
                  </div>
                </PanelShell>

                <SplitDetailPanel
                  primaryLabel={messages.gender}
                  primaryValue={
                    <Badge
                      variant={
                        analysis.gender === "unknown" ? "outline" : "secondary"
                      }
                    >
                      {getGenderLabel(analysis.gender, messages)}
                    </Badge>
                  }
                  secondaryLabel={messages.sequenceCode}
                  secondaryValue={
                    analysis.sequenceCode ?? messages.notAvailable
                  }
                />
              </div>
            </section>

            <PanelShell className="grid gap-3 sm:grid-cols-2">
              <DetailTile
                label={messages.checksum}
                value={
                  <Badge
                    variant={
                      showCompleteStatus
                        ? analysis.isChecksumValid
                          ? "default"
                          : "destructive"
                        : "outline"
                    }
                  >
                    {showCompleteStatus
                      ? analysis.isChecksumValid
                        ? messages.pass
                        : messages.fail
                      : messages.unknown}
                  </Badge>
                }
              />
              <DetailTile
                label={messages.checkDigit}
                value={
                  <div className="space-y-1">
                    <p>
                      {messages.expected}:{" "}
                      {analysis.expectedCheckDigit ?? messages.notAvailable}
                    </p>
                    <p>
                      {messages.actual}:{" "}
                      {analysis.actualCheckDigit ?? messages.notAvailable}
                    </p>
                  </div>
                }
              />
            </PanelShell>
          </>
        ) : (
          <Empty className="min-h-64 flex-1 border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
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

function getGenderLabel(
  gender: PRCIdValidationAnalysis["gender"],
  messages: PRCIdValidatorMessages
) {
  if (gender === "male") return messages.male
  if (gender === "female") return messages.female
  return messages.unknown
}

function formatBirthPart(value: string | null, placeholder: string) {
  if (!value) return placeholder
  return `${value}${placeholder.slice(value.length)}`
}

function getBirthSummary(analysis: PRCIdValidationAnalysis) {
  return [
    formatBirthPart(analysis.birthYearInput, "YYYY"),
    formatBirthPart(analysis.birthMonthInput, "MM"),
    formatBirthPart(analysis.birthDayInput, "DD"),
  ].join("-")
}

export { PRCIdResultsCard }
