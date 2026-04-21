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
  HierarchyTrail,
  InfoMetric,
  InlineCopyField,
  PanelLabel,
  SectionSurface,
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
            <SectionSurface className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <PanelLabel>{messages.status}</PanelLabel>
                  <div className="flex flex-wrap gap-2">
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

                <div className="space-y-2">
                  <PanelLabel>{messages.region}</PanelLabel>
                  <HierarchyTrail
                    fallback={messages.notAvailable}
                    items={[
                      {
                        label: messages.province,
                        value: analysis.provinceName,
                      },
                      {
                        label: messages.city,
                        value: analysis.cityName,
                      },
                      {
                        label: messages.district,
                        value: analysis.areaName,
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:border-l xl:border-border/60 xl:pl-6">
                <InlineCopyField
                  className="min-w-0"
                  label={messages.normalized}
                  value={analysis.normalized}
                  messages={messages}
                />

                <div className="rounded-lg bg-background/75 px-3 py-3 ring-1 ring-border/60">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                    <InfoMetric
                      label={messages.regionCode}
                      value={
                        <span className="font-mono">
                          {analysis.regionCode ?? messages.notAvailable}
                        </span>
                      }
                    />
                    <InfoMetric
                      label={messages.regionStatus}
                      value={
                        <Badge
                          variant={
                            hasKnownRegion(analysis) ? "secondary" : "outline"
                          }
                        >
                          {hasKnownRegion(analysis)
                            ? messages.known
                            : messages.unknown}
                        </Badge>
                      }
                    />
                  </div>
                </div>
              </div>
            </SectionSurface>

            <SectionSurface className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className="space-y-4">
                <div>
                  <PanelLabel>{messages.birthdate}</PanelLabel>
                  <p className="mt-2 font-mono text-xl leading-tight font-semibold">
                    {getBirthSummary(analysis)}
                  </p>
                </div>

                <div className="rounded-lg bg-background/75 px-3 py-3 ring-1 ring-border/60">
                  <div className="grid gap-4 sm:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,0.85fr)]">
                    <InfoMetric
                      label="YYYY"
                      value={formatBirthPart(analysis.birthYearInput, "YYYY")}
                    />
                    <InfoMetric
                      label="MM"
                      value={formatBirthPart(analysis.birthMonthInput, "MM")}
                    />
                    <InfoMetric
                      label="DD"
                      value={formatBirthPart(analysis.birthDayInput, "DD")}
                    />
                    <InfoMetric
                      label={messages.age}
                      value={
                        analysis.age !== null
                          ? String(analysis.age)
                          : messages.notAvailable
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-background/75 px-3 py-3 ring-1 ring-border/60">
                <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  <InfoMetric
                    label={messages.gender}
                    value={
                      <Badge
                        variant={
                          analysis.gender === "unknown"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {getGenderLabel(analysis.gender, messages)}
                      </Badge>
                    }
                  />
                  <InfoMetric
                    label={messages.sequenceCode}
                    value={analysis.sequenceCode ?? messages.notAvailable}
                  />
                  <InfoMetric
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
                  <InfoMetric
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
              </div>
            </SectionSurface>
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

function hasKnownRegion(analysis: PRCIdValidationAnalysis) {
  return Boolean(
    analysis.provinceName || analysis.cityName || analysis.areaName
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
