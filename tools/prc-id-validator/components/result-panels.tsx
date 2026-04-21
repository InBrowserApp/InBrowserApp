import { Fragment, type ReactNode } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { ArrowRight } from "@workspace/ui/icons"

import type { PRCIdValidatorMessages } from "../client/types"

type SectionSurfaceProps = Readonly<{
  children: ReactNode
  className?: string
}>

type InfoMetricProps = Readonly<{
  label: string
  value: ReactNode
  className?: string
}>

type InlineCopyFieldProps = Readonly<{
  label: string
  value: string | null
  messages: PRCIdValidatorMessages
  className?: string
}>

type HierarchyTrailItem = Readonly<{
  label: string
  value: string | null
}>

type HierarchyTrailProps = Readonly<{
  items: HierarchyTrailItem[]
  fallback: string
}>

function SectionSurface({ children, className = "" }: SectionSurfaceProps) {
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

function InfoMetric({ label, value, className = "" }: InfoMetricProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <PanelLabel>{label}</PanelLabel>
      <div className="text-sm leading-6 break-all">{value}</div>
    </div>
  )
}

function InlineCopyField({
  label,
  value,
  messages,
  className = "",
}: InlineCopyFieldProps) {
  return (
    <div
      className={`rounded-lg bg-background/80 px-3 py-3 ring-1 ring-border/60 ${className}`}
    >
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

function HierarchyTrail({ items, fallback }: HierarchyTrailProps) {
  return (
    <div className="rounded-lg bg-background/75 px-3 py-3 ring-1 ring-border/60">
      <div className="flex flex-wrap items-center gap-3 text-left">
        {items.map((item, index) => (
          <Fragment key={item.label + "-" + (item.value ?? fallback)}>
            {index > 0 ? (
              <ArrowRight className="size-4 shrink-0 text-muted-foreground/60" />
            ) : null}
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                {item.label}
              </p>
              <p
                className={
                  item.value
                    ? "text-sm leading-6 font-medium"
                    : "text-sm leading-6 text-muted-foreground"
                }
              >
                {item.value ?? fallback}
              </p>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export {
  HierarchyTrail,
  InfoMetric,
  InlineCopyField,
  PanelLabel,
  SectionSurface,
}
