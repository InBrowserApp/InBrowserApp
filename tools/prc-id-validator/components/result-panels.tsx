import type { ReactNode } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"

import type { PRCIdValidatorMessages } from "../client/types"

function PanelShell({
  children,
  className = "",
}: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <section
      className={`rounded-xl border border-border/70 bg-muted/20 p-4 ${className}`}
    >
      {children}
    </section>
  )
}

function PanelLabel({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  )
}

function DetailTile({
  label,
  value,
}: Readonly<{ label: string; value: ReactNode }>) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/80 p-3">
      <PanelLabel>{label}</PanelLabel>
      <div className="mt-2 text-sm leading-6 break-all">{value}</div>
    </div>
  )
}

function SplitDetailPanel({
  primaryLabel,
  primaryValue,
  secondaryLabel,
  secondaryValue,
}: Readonly<{
  primaryLabel: string
  primaryValue: ReactNode
  secondaryLabel: string
  secondaryValue: ReactNode
}>) {
  return (
    <PanelShell className="grid gap-3 sm:grid-cols-2">
      <DetailTile label={primaryLabel} value={primaryValue} />
      <DetailTile label={secondaryLabel} value={secondaryValue} />
    </PanelShell>
  )
}

function CopySummary({
  label,
  value,
  messages,
}: Readonly<{
  label: string
  value: string | null
  messages: PRCIdValidatorMessages
}>) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/80 p-3">
      <PanelLabel>{label}</PanelLabel>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm break-all">
          {value ?? messages.notAvailable}
        </span>
        {value ? (
          <ToolCopyButton
            value={value}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
          />
        ) : null}
      </div>
    </div>
  )
}

export { CopySummary, DetailTile, PanelLabel, PanelShell, SplitDetailPanel }
