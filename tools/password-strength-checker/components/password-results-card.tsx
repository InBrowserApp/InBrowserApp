import type { ReactNode } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
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
import { Lock, Sparkles, TriangleAlert } from "@workspace/ui/icons"

import type {
  PasswordStrengthAnalysis,
  PasswordStrengthCheckerMessages,
} from "../client/types"
import type {
  DurationDisplay,
  StrengthScore,
  StrengthSuggestionKey,
  StrengthWarningKey,
} from "../core/password-strength"

type PasswordResultsCardProps = Readonly<{
  analysis: PasswordStrengthAnalysis | null
  messages: PasswordStrengthCheckerMessages
}>

function PasswordResultsCard({ analysis, messages }: PasswordResultsCardProps) {
  const description = analysis
    ? [
        getStrengthLabel(analysis.score, messages),
        formatMessage(messages.entropyBits, {
          bits: analysis.entropyBits.toFixed(1),
        }),
      ].join(" • ")
    : messages.empty

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4 py-4">
        {analysis ? (
          <>
            <section className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={getStrengthVariant(analysis.score)}>
                  {getStrengthLabel(analysis.score, messages)}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {formatMessage(messages.log10Guesses, {
                    value: analysis.log10Guesses.toFixed(1),
                  })}
                </p>
              </div>

              <div
                className="mt-4 h-2.5 overflow-hidden rounded-full bg-border/70"
                role="progressbar"
                aria-label={getStrengthLabel(analysis.score, messages)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={(analysis.score + 1) * 20}
              >
                <div
                  className={getMeterClassName(analysis.score)}
                  style={{ width: `${(analysis.score + 1) * 20}%` }}
                />
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <MetricTile
                label={messages.length}
                value={String(analysis.length)}
              />
              <MetricTile
                label={messages.unique}
                value={String(analysis.uniqueCount)}
              />
              <MetricTile
                label={messages.characterSets}
                value={
                  <div className="flex flex-wrap gap-2">
                    {getCharacterTags(analysis).map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                }
              />
              <MetricTile
                label={messages.crackOffline}
                value={formatDurationLabel(
                  analysis.crackTimes.offlineFast,
                  messages
                )}
              />
              <MetricTile
                label={messages.crackOnline}
                value={formatDurationLabel(
                  analysis.crackTimes.onlineThrottled,
                  messages
                )}
              />
            </section>

            {analysis.warnings.length > 0 ? (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertDescription>
                  <ul className="list-disc space-y-1 pl-4">
                    {analysis.warnings.map((warning) => (
                      <li key={warning}>
                        {getWarningMessage(warning, messages)}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : null}

            {analysis.suggestions.length > 0 ? (
              <Alert>
                <Sparkles />
                <AlertDescription>
                  <ul className="list-disc space-y-1 pl-4">
                    {analysis.suggestions.map((suggestion) => (
                      <li key={suggestion}>
                        {getSuggestionMessage(suggestion, messages)}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : null}
          </>
        ) : (
          <Empty className="min-h-64 flex-1 border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Lock />
              </EmptyMedia>
              <EmptyTitle>{messages.resultTitle}</EmptyTitle>
              <EmptyDescription>{messages.empty}</EmptyDescription>
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
    <div className="rounded-xl border border-border/70 bg-background p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}

function formatMessage(
  template: string,
  values: Record<string, string | number>
) {
  return Object.entries(values).reduce(
    (message, [key, value]) =>
      message.replace(new RegExp(`\\{${key}\\}`, "g"), String(value)),
    template
  )
}

function formatDurationLabel(
  duration: DurationDisplay,
  messages: PasswordStrengthCheckerMessages
) {
  if (duration.isUnderSecond) {
    return messages.durationUnderSecond
  }

  return formatMessage(messages.durationFormat, {
    value: duration.value,
    unit: messages.unit[duration.unit],
  })
}

function getStrengthLabel(
  score: StrengthScore,
  messages: PasswordStrengthCheckerMessages
) {
  switch (score) {
    case 0:
      return messages.strength0
    case 1:
      return messages.strength1
    case 2:
      return messages.strength2
    case 3:
      return messages.strength3
    default:
      return messages.strength4
  }
}

function getStrengthVariant(score: StrengthScore) {
  if (score <= 1) return "destructive" as const
  if (score === 2) return "secondary" as const
  return "default" as const
}

function getMeterClassName(score: StrengthScore) {
  const baseClassName = "h-full transition-[width] duration-200 ease-out"

  switch (score) {
    case 0:
      return `${baseClassName} bg-destructive`
    case 1:
      return `${baseClassName} bg-orange-500`
    case 2:
      return `${baseClassName} bg-amber-400`
    case 3:
      return `${baseClassName} bg-emerald-500`
    default:
      return `${baseClassName} bg-green-600`
  }
}

function getCharacterTags(analysis: PasswordStrengthAnalysis) {
  return [
    analysis.composition.lower ? "a-z" : null,
    analysis.composition.upper ? "A-Z" : null,
    analysis.composition.digit ? "0-9" : null,
    analysis.composition.symbol ? "#@$" : null,
  ].filter((tag): tag is string => Boolean(tag))
}

function getWarningMessage(
  warning: StrengthWarningKey,
  messages: PasswordStrengthCheckerMessages
) {
  return messages.warning[warning]
}

function getSuggestionMessage(
  suggestion: StrengthSuggestionKey,
  messages: PasswordStrengthCheckerMessages
) {
  return messages.suggestion[suggestion]
}

export { PasswordResultsCard }
