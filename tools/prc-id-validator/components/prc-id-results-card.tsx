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
  const description = analysis ? feedbackMessage : messages.meta.description
  const regionDisplay = analysis
    ? getRegionDisplay(analysis, messages)
    : messages.notAvailable

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.result}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {analysis ? (
          <>
            <section className="grid gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
              <PanelShell className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <PanelLabel>{messages.status}</PanelLabel>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge
                        variant={analysis.isValid ? "default" : "destructive"}
                      >
                        {analysis.isValid ? messages.valid : messages.invalid}
                      </Badge>
                      <Badge
                        variant={
                          analysis.isRegionValid ? "secondary" : "outline"
                        }
                      >
                        {analysis.isRegionValid
                          ? messages.known
                          : messages.unknown}
                      </Badge>
                      <Badge
                        variant={
                          analysis.isChecksumValid ? "default" : "destructive"
                        }
                      >
                        {analysis.isChecksumValid
                          ? messages.pass
                          : messages.fail}
                      </Badge>
                    </div>
                  </div>

                  <CopySummary
                    label={messages.regionCode}
                    value={analysis.regionCode}
                    messages={messages}
                  />
                </div>

                <div>
                  <PanelLabel>{messages.region}</PanelLabel>
                  <p className="mt-2 text-lg leading-tight font-semibold">
                    {regionDisplay}
                  </p>
                </div>
              </PanelShell>

              <div className="grid gap-3">
                <SplitDetailPanel
                  primaryLabel={messages.birthdate}
                  primaryValue={analysis.birthDateText ?? messages.notAvailable}
                  secondaryLabel={messages.age}
                  secondaryValue={
                    analysis.age !== null
                      ? String(analysis.age)
                      : messages.notAvailable
                  }
                />
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

            <section className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <PanelShell className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <PanelLabel>{messages.normalized}</PanelLabel>
                    <p className="mt-2 font-mono text-base leading-7 break-all">
                      {analysis.normalized}
                    </p>
                  </div>
                  <ToolCopyButton
                    value={analysis.normalized}
                    copyLabel={messages.copyLabel}
                    copiedLabel={messages.copiedLabel}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailTile
                    label={messages.checksum}
                    value={
                      <Badge
                        variant={
                          analysis.isChecksumValid ? "default" : "destructive"
                        }
                      >
                        {analysis.isChecksumValid
                          ? messages.pass
                          : messages.fail}
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
                </div>
              </PanelShell>

              <PanelShell>
                <div className="grid gap-3">
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
            </section>
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

function getRegionDisplay(
  analysis: PRCIdValidationAnalysis,
  messages: PRCIdValidatorMessages
) {
  const parts = [
    analysis.provinceName,
    analysis.cityName,
    analysis.areaName,
  ].filter(Boolean) as string[]

  return parts.length > 0 ? parts.join(" / ") : messages.notAvailable
}

export { PRCIdResultsCard }
