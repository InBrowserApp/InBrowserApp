import type { PropsWithChildren, ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

type SiteFrameProps = PropsWithChildren<{
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
  className?: string
}>

function SiteFrame({
  eyebrow,
  title,
  description,
  actions,
  className,
  children,
}: SiteFrameProps) {
  return (
    <div className="min-h-svh bg-background">
      <div
        className={cn(
          "mx-auto flex w-full max-w-6xl flex-col gap-10 px-[var(--spacing-page-x)] py-[var(--spacing-page-y)]",
          className
        )}
      >
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {eyebrow ? (
              <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                {eyebrow}
              </p>
            ) : null}
            <div className="max-w-3xl space-y-3">
              <h1 className="font-heading text-4xl leading-none tracking-[var(--tracking-display)] text-balance sm:text-5xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-3">{actions}</div>
          ) : null}
        </header>
        {children}
      </div>
    </div>
  )
}

export { SiteFrame }
