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
import { FileText } from "@workspace/ui/icons"

import type {
  PRCIdValidationAnalysis,
  PRCIdValidatorMessages,
} from "../client/types"

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
              <DetailTile
                label={messages.status}
                value={
                  <Badge variant={analysis.isValid ? "default" : "destructive"}>
                    {analysis.isValid ? messages.valid : messages.invalid}
                  </Badge>
                }
              />
              <DetailTile
                label={messages.region}
                value={getRegionDisplay(analysis, messages)}
              />
              <DetailTile
                label={messages.regionStatus}
                value={
                  <Badge
                    variant={analysis.isRegionValid ? "secondary" : "outline"}
                  >
                    {analysis.isRegionValid ? messages.known : messages.unknown}
                  </Badge>
                }
              />
              <DetailTile
                label={messages.checksum}
                value={
                  <Badge
                    variant={
                      analysis.isChecksumValid ? "default" : "destructive"
                    }
                  >
                    {analysis.isChecksumValid ? messages.pass : messages.fail}
                  </Badge>
                }
              />
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <CopyableDetailTile
                label={messages.normalized}
                value={analysis.normalized}
                messages={messages}
              />
              <CopyableDetailTile
                label={messages.regionCode}
                value={analysis.regionCode}
                messages={messages}
              />
              <DetailTile
                label={messages.birthdate}
                value={analysis.birthDateText ?? messages.notAvailable}
              />
              <DetailTile
                label={messages.age}
                value={
                  analysis.age !== null
                    ? String(analysis.age)
                    : messages.notAvailable
                }
              />
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <DetailTile
                label={messages.gender}
                value={
                  <Badge
                    variant={
                      analysis.gender === "unknown" ? "outline" : "secondary"
                    }
                  >
                    {getGenderLabel(analysis.gender, messages)}
                  </Badge>
                }
              />
              <DetailTile
                label={messages.sequenceCode}
                value={analysis.sequenceCode ?? messages.notAvailable}
              />
              <DetailTile
                label={`${messages.checkDigit} (${messages.expected})`}
                value={analysis.expectedCheckDigit ?? messages.notAvailable}
              />
              <DetailTile
                label={`${messages.checkDigit} (${messages.actual})`}
                value={analysis.actualCheckDigit ?? messages.notAvailable}
              />
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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

function DetailTile({
  label,
  value,
}: Readonly<{ label: string; value: ReactNode }>) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-2 text-sm leading-6 break-all">{value}</div>
    </div>
  )
}

function CopyableDetailTile({
  label,
  value,
  messages,
}: Readonly<{
  label: string
  value: string | null
  messages: PRCIdValidatorMessages
}>) {
  const displayValue = value ?? messages.notAvailable

  return (
    <DetailTile
      label={label}
      value={
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm break-all">{displayValue}</span>
          {value ? (
            <ToolCopyButton
              value={value}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
            />
          ) : null}
        </div>
      }
    />
  )
}

export { PRCIdResultsCard }
