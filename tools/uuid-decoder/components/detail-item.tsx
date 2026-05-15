import type { ReactNode } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { cn } from "@workspace/ui/lib/utils"

type DetailItemProps = Readonly<{
  label: string
  children: ReactNode
  className?: string
}>

function DetailItem({ label, children, className }: DetailItemProps) {
  return (
    <div className={cn("rounded-lg border bg-muted/20 p-4", className)}>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-2 text-sm leading-6">{children}</dd>
    </div>
  )
}

type CopyValueProps = Readonly<{
  value: string
  copyLabel: string
  copiedLabel: string
  monospace?: boolean
  compact?: boolean
}>

function CopyValue({
  value,
  copyLabel,
  copiedLabel,
  monospace = true,
  compact = false,
}: CopyValueProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <span
        className={cn(
          "min-w-0 break-all",
          monospace ? "font-mono text-sm" : "text-sm",
          compact ? "max-h-24 overflow-auto rounded bg-background/70 p-2" : ""
        )}
      >
        {value}
      </span>
      <ToolCopyButton
        value={value}
        copyLabel={copyLabel}
        copiedLabel={copiedLabel}
        variant="ghost"
      />
    </div>
  )
}

function DetailBadge({ children }: Readonly<{ children: ReactNode }>) {
  return <Badge variant="secondary">{children}</Badge>
}

export { CopyValue, DetailBadge, DetailItem }
