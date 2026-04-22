import { useMemo } from "react"
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
  BICSwiftValidatorMessages,
  BICValidationAnalysis,
} from "../client/types"

type BicSwiftResultsCardProps = Readonly<{
  lang: string
  analysis: BICValidationAnalysis | null
  feedbackMessage: string | null
  messages: BICSwiftValidatorMessages
}>

function BicSwiftResultsCard({
  lang,
  analysis,
  feedbackMessage,
  messages,
}: BicSwiftResultsCardProps) {
  const description = analysis ? feedbackMessage : messages.meta.description
  const countryDisplay = useMemo(
    () =>
      getCountryDisplay(
        lang,
        analysis?.countryCode ?? null,
        analysis?.isCountryValid ?? false,
        messages.notAvailable
      ),
    [
      analysis?.countryCode,
      analysis?.isCountryValid,
      lang,
      messages.notAvailable,
    ]
  )

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
              <DetailItem
                label={messages.status}
                content={
                  <Badge variant={analysis.isValid ? "default" : "destructive"}>
                    {analysis.isValid ? messages.valid : messages.invalid}
                  </Badge>
                }
              />
              <DetailItem
                label={messages.type}
                content={<span>{getTypeLabel(analysis.type, messages)}</span>}
              />
              <DetailItem
                label={messages.country}
                content={<span>{countryDisplay}</span>}
              />
              <DetailItem
                label={messages.countryStatus}
                content={
                  <Badge
                    variant={analysis.isCountryValid ? "secondary" : "outline"}
                  >
                    {analysis.isCountryValid
                      ? messages.supported
                      : messages.unknown}
                  </Badge>
                }
              />
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <CopyableDetailItem
                label={messages.normalized}
                value={analysis.normalized}
                messages={messages}
              />
              <CopyableDetailItem
                label={messages.bankCode}
                value={analysis.bankCode}
                messages={messages}
              />
              <CopyableDetailItem
                label={messages.locationCode}
                value={analysis.locationCode}
                messages={messages}
              />
              <CopyableDetailItem
                label={messages.branchCode}
                value={getBranchValue(analysis)}
                displayValue={getBranchDisplay(analysis, messages)}
                messages={messages}
              />
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <DetailItem
                label={messages.length}
                content={<span>{String(analysis.length)}</span>}
              />
              <DetailItem
                label={messages.locationType}
                content={
                  <Badge variant={getLocationTypeVariant(analysis)}>
                    {getLocationTypeLabel(analysis, messages)}
                  </Badge>
                }
              />
              <DetailItem
                label={messages.officeType}
                content={
                  <Badge
                    variant={analysis.isPrimaryOffice ? "default" : "secondary"}
                  >
                    {analysis.isPrimaryOffice
                      ? messages.primaryOffice
                      : messages.branchOffice}
                  </Badge>
                }
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

function getCountryDisplay(
  lang: string,
  countryCode: string | null,
  isCountryValid: boolean,
  notAvailable: string
) {
  if (!countryCode) {
    return notAvailable
  }

  if (!isCountryValid) {
    return countryCode
  }

  const displayName =
    getDisplayNames(lang)?.of(countryCode) ??
    getDisplayNames("en")?.of(countryCode)

  return displayName ? `${displayName} (${countryCode})` : countryCode
}

function getDisplayNames(locale: string) {
  if (typeof Intl.DisplayNames === "undefined") {
    return null
  }

  try {
    return new Intl.DisplayNames([locale], { type: "region" })
  } catch {
    try {
      return new Intl.DisplayNames(undefined, { type: "region" })
    } catch {
      return null
    }
  }
}

function getTypeLabel(
  type: BICValidationAnalysis["type"],
  messages: BICSwiftValidatorMessages
) {
  if (type === "bic-8") return messages.bic8
  if (type === "bic-11") return messages.bic11
  return messages.unknown
}

function getBranchValue(analysis: BICValidationAnalysis) {
  if (analysis.type === "bic-8") {
    return "XXX"
  }

  return analysis.branchCode
}

function getBranchDisplay(
  analysis: BICValidationAnalysis,
  messages: BICSwiftValidatorMessages
) {
  return getBranchValue(analysis) ?? messages.notAvailable
}

function getLocationTypeLabel(
  analysis: BICValidationAnalysis,
  messages: BICSwiftValidatorMessages
) {
  if (!analysis.locationCode) return messages.unknown
  if (analysis.isTestBIC) return messages.test
  if (analysis.isPassiveParticipant) return messages.passive
  return messages.standard
}

function getLocationTypeVariant(analysis: BICValidationAnalysis) {
  if (!analysis.locationCode) return "outline" as const
  if (analysis.isTestBIC) return "secondary" as const
  if (analysis.isPassiveParticipant) return "outline" as const
  return "default" as const
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
      <div className="mt-2 text-sm leading-6 break-all">{content}</div>
    </div>
  )
}

function CopyableDetailItem({
  label,
  value,
  displayValue,
  messages,
}: Readonly<{
  label: string
  value: string | null
  displayValue?: string
  messages: BICSwiftValidatorMessages
}>) {
  return (
    <DetailItem
      label={label}
      content={
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm break-all">
            {displayValue ?? value ?? messages.notAvailable}
          </span>
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

export { BicSwiftResultsCard }
