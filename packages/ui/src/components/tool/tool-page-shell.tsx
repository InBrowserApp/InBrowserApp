import type { PropsWithChildren, ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

type ToolPageShellProps = PropsWithChildren<{
  title: string
  description: string
  action?: ReactNode
  className?: string
}>

function ToolPageShell({
  title,
  description,
  action,
  className,
  children,
}: ToolPageShellProps) {
  return (
    <section
      className={cn("flex flex-col gap-[var(--spacing-section-y)]", className)}
    >
      <header className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl leading-none tracking-[var(--tracking-display)] text-balance sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
        {action ? (
          <div className="justify-self-start lg:justify-self-end">{action}</div>
        ) : null}
      </header>
      {children}
    </section>
  )
}

export { ToolPageShell }
