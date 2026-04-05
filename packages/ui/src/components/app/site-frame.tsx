import type { PropsWithChildren } from "react"

import { cn } from "@workspace/ui/lib/utils"

type SiteFrameProps = PropsWithChildren<{
  title: string
  description: string
  className?: string
}>

function SiteFrame({
  title,
  description,
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
        <header className="flex flex-col gap-3">
          <div className="max-w-3xl space-y-3">
            <h1 className="font-heading text-4xl leading-none tracking-[var(--tracking-display)] text-balance sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}

export { SiteFrame }
