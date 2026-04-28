import type { ReactNode } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { cn } from "@workspace/ui/lib/utils"

function DetailItem({
  label,
  content,
}: Readonly<{ label: string; content: ReactNode }>) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-2 text-sm leading-6">{content}</dd>
    </div>
  )
}

function ValueWithCopy({
  value,
  copyValue,
  copyLabel,
  copiedLabel,
  monospace = false,
}: Readonly<{
  value: string
  copyValue?: string
  copyLabel: string
  copiedLabel: string
  monospace?: boolean
}>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={cn("break-all", monospace ? "font-mono text-sm" : "text-sm")}
      >
        {value}
      </span>
      {copyValue ? (
        <ToolCopyButton
          value={copyValue}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          variant="ghost"
        />
      ) : null}
    </div>
  )
}

export { DetailItem, ValueWithCopy }
