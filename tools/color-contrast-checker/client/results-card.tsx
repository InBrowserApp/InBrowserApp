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
import { Check, TriangleAlert } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { rgbaToHex, toCssRgba } from "../core/color"

import type {
  ColorContrastMessages,
  ContrastCheck,
  ResolvedContrastColors,
} from "./types"

type ResultsCardProps = Readonly<{
  checks: readonly ContrastCheck[]
  messages: ColorContrastMessages
  ratio: number | null
  resolvedColors: ResolvedContrastColors | null
}>

type ResolvedColorChipProps = Readonly<{
  label: string
  swatch: string
}>

function formatRatio(ratio: number) {
  return `${ratio.toFixed(2)}:1`
}

function ResolvedColorChip({ label, swatch }: ResolvedColorChipProps) {
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="size-10 rounded-lg border border-border/70"
          style={{ backgroundColor: swatch }}
        />
        <div className="grid gap-1">
          <div className="text-sm font-medium">{label}</div>
          <code className="font-mono text-xs text-muted-foreground uppercase">
            {swatch}
          </code>
        </div>
      </div>
    </div>
  )
}

export function ResultsCard({
  checks,
  messages,
  ratio,
  resolvedColors,
}: ResultsCardProps) {
  const badgeLabels = {
    "aa-normal": messages.aaNormalLabel,
    "aa-large": messages.aaLargeLabel,
    "aaa-normal": messages.aaaNormalLabel,
    "aaa-large": messages.aaaLargeLabel,
  } as const

  const resolvedForeground = resolvedColors
    ? rgbaToHex(resolvedColors.foreground)
    : null
  const resolvedBackground = resolvedColors
    ? rgbaToHex(resolvedColors.background)
    : null

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.alphaNote}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-6">
        {ratio === null || !resolvedColors ? (
          <Empty className="border border-dashed border-border/80 bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TriangleAlert />
              </EmptyMedia>
              <EmptyTitle>{messages.contrastRatioLabel}</EmptyTitle>
              <EmptyDescription>
                {messages.invalidInputMessage}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">
                {messages.contrastRatioLabel}
              </div>
              <div
                className="font-mono text-4xl font-semibold tracking-tight"
                data-testid="ratio-value"
              >
                {formatRatio(ratio)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {checks.map((check) => (
                <Badge
                  className="gap-1.5"
                  data-testid={`status-${check.key}`}
                  key={check.key}
                  variant={check.pass ? "secondary" : "destructive"}
                >
                  {check.pass ? (
                    <Check data-icon="inline-start" />
                  ) : (
                    <TriangleAlert data-icon="inline-start" />
                  )}
                  {badgeLabels[check.key]}:{" "}
                  {check.pass ? messages.passLabel : messages.failLabel}
                </Badge>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ResolvedColorChip
                label={messages.foregroundLabel}
                swatch={resolvedForeground!}
              />
              <ResolvedColorChip
                label={messages.backgroundLabel}
                swatch={resolvedBackground!}
              />
            </div>

            <div className="rounded-xl border bg-background p-4">
              <div
                className={cn(
                  "rounded-lg border border-border/60 p-4 text-sm shadow-xs"
                )}
                style={{
                  backgroundColor: toCssRgba(resolvedColors.background),
                  color: toCssRgba(resolvedColors.foreground),
                }}
              >
                {messages.sampleText}
              </div>
            </div>
          </>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
