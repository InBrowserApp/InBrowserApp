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
  IBANValidationAnalysis,
  IBANValidatorMessages,
} from "../client/types"

type IbanResultsCardProps = Readonly<{
  lang: string
  analysis: IBANValidationAnalysis | null
  feedbackMessage: string | null
  messages: IBANValidatorMessages
}>

function IbanResultsCard({
  lang,
  analysis,
  feedbackMessage,
  messages,
}: IbanResultsCardProps) {
  const description = analysis ? feedbackMessage : messages.meta.description
  const countryDisplay = useMemo(
    () =>
      getCountryDisplay(
        lang,
        analysis?.countryCode ?? null,
        analysis?.isCountryValid ?? false
      ),
    [analysis?.countryCode, analysis?.isCountryValid, lang]
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
              <MetricTile
                label={messages.status}
                value={
                  <Badge variant={analysis.isValid ? "default" : "destructive"}>
                    {analysis.isValid ? messages.valid : messages.invalid}
                  </Badge>
                }
              />
              <MetricTile
                label={messages.country}
                value={
                  <span className="text-sm">
                    {countryDisplay ?? messages.notAvailable}
                  </span>
                }
              />
              <MetricTile
                label={messages.registry}
                value={
                  <Badge
                    variant={analysis.isCountryValid ? "secondary" : "outline"}
                  >
                    {analysis.isCountryValid
                      ? messages.supported
                      : messages.unknown}
                  </Badge>
                }
              />
              <MetricTile
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

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <CopyableMetricTile
                label={messages.normalized}
                value={analysis.normalized}
                messages={messages}
              />
              <CopyableMetricTile
                label={messages.formatted}
                value={analysis.formatted}
                messages={messages}
              />
              <CopyableMetricTile
                label={messages.bban}
                value={analysis.bban}
                messages={messages}
              />
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <MetricTile
                label={messages.length}
                value={
                  <div className="space-y-1">
                    <p>
                      {messages.expected}:{" "}
                      {analysis.expectedLength
                        ? String(analysis.expectedLength)
                        : messages.unknown}
                    </p>
                    <p>
                      {messages.actual}: {analysis.length}
                    </p>
                  </div>
                }
              />
              <MetricTile
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
              <MetricTile
                label={messages.checkDigits}
                value={
                  <div className="space-y-1">
                    <p>
                      {messages.expected}:{" "}
                      {analysis.expectedCheckDigits ?? messages.notAvailable}
                    </p>
                    <p>
                      {messages.actual}:{" "}
                      {analysis.checkDigits ?? messages.notAvailable}
                    </p>
                  </div>
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
  isCountryValid: boolean
) {
  if (!countryCode) {
    return null
  }

  const fallback = countryCode

  if (!isCountryValid) {
    return fallback
  }

  const displayName =
    getDisplayNames(lang)?.of(countryCode) ??
    getDisplayNames("en")?.of(countryCode)

  return displayName ? `${displayName} (${countryCode})` : fallback
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

function MetricTile({
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

function CopyableMetricTile({
  label,
  value,
  messages,
}: Readonly<{
  label: string
  value: string | null
  messages: IBANValidatorMessages
}>) {
  return (
    <MetricTile
      label={label}
      value={
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm break-all">
            {value ?? messages.notAvailable}
          </span>
          {value ? (
            <ToolCopyButton
              value={value}
              copyLabel={messages.copyResultLabel}
              copiedLabel={messages.copiedLabel}
            />
          ) : null}
        </div>
      }
    />
  )
}

export { IbanResultsCard }
