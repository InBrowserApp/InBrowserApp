import type { ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h2 className="font-heading text-2xl leading-tight tracking-[var(--tracking-display)] text-balance">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export { SectionHeading }
