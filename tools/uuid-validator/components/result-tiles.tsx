import type { ReactNode } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"

import type {
  UuidValidationAnalysis,
  UuidValidatorMessages,
} from "../client/types"

function getVersionLabel(
  analysis: UuidValidationAnalysis,
  messages: UuidValidatorMessages
) {
  if (analysis.kind === "nil") return messages.versionNil
  if (analysis.kind === "max") return messages.versionMax
  if (analysis.version === null) return messages.notAvailable

  const labels = {
    1: messages.version1,
    2: messages.version2,
    3: messages.version3,
    4: messages.version4,
    5: messages.version5,
    6: messages.version6,
    7: messages.version7,
    8: messages.version8,
  } as const

  return (
    labels[analysis.version as keyof typeof labels] ?? messages.notAvailable
  )
}

function getVariantLabel(
  analysis: UuidValidationAnalysis,
  messages: UuidValidatorMessages
) {
  if (analysis.kind === "nil" || analysis.kind === "max") {
    return messages.variantSpecial
  }

  if (analysis.variant === "rfc4122") return messages.variantRfc4122
  if (analysis.variant === "ncs") return messages.variantNcs
  if (analysis.variant === "microsoft") return messages.variantMicrosoft
  if (analysis.variant === "future") return messages.variantFuture

  return messages.notAvailable
}

function MetricTile({
  label,
  value,
}: Readonly<{ label: string; value: ReactNode }>) {
  return (
    <div className="rounded-md border border-border/70 bg-muted/20 p-4">
      <p className="text-xs font-medium text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-2 text-sm leading-6">{value}</div>
    </div>
  )
}

function CheckTile({
  label,
  messages,
  isPassing,
}: Readonly<{
  label: string
  messages: UuidValidatorMessages
  isPassing: boolean
}>) {
  return (
    <MetricTile
      label={label}
      value={
        <Badge variant={isPassing ? "default" : "destructive"}>
          {isPassing ? messages.passLabel : messages.failLabel}
        </Badge>
      }
    />
  )
}

function MonoValue({
  value,
  messages,
}: Readonly<{ value?: string; messages: UuidValidatorMessages }>) {
  return (
    <span className="font-mono text-sm break-all">
      {value ?? messages.notAvailable}
    </span>
  )
}

export { CheckTile, MetricTile, MonoValue, getVariantLabel, getVersionLabel }
