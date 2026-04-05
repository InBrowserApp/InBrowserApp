import type { PropsWithChildren } from "react"

import { cn } from "@workspace/ui/lib/utils"

type ToolSurfaceProps = PropsWithChildren<{
  className?: string
}>

function ToolSurface({ className, children }: ToolSurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-[calc(var(--radius)*1.8)] border border-border/70 bg-card/90 p-5 shadow-[var(--shadow-elevated)] backdrop-blur sm:p-6",
        className
      )}
    >
      {children}
    </div>
  )
}

export { ToolSurface }
