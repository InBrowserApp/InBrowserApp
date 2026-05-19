"use client"

import type { CSSProperties, ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

type PreviewTileProps = Readonly<{
  label: string
  chromeSrc?: string
  chromeAlt?: string
  aspectRatio: string
  className?: string
  chromeClassName?: string
  surface?: ReactNode
  children?: ReactNode
}>

function PreviewTile({
  label,
  chromeSrc,
  chromeAlt,
  aspectRatio,
  className,
  chromeClassName,
  surface,
  children,
}: PreviewTileProps) {
  const containerStyle: CSSProperties = {
    aspectRatio,
  }

  return (
    <figure
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-border/70 bg-card p-3 shadow-sm",
        className
      )}
    >
      <div
        className="relative w-full overflow-hidden rounded-lg bg-muted/50"
        style={containerStyle}
      >
        {chromeSrc ? (
          <img
            src={chromeSrc}
            alt={chromeAlt ?? ""}
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 h-full w-full object-cover",
              chromeClassName
            )}
          />
        ) : null}
        {surface ?? null}
        {children}
      </div>
      <figcaption className="text-xs text-muted-foreground">{label}</figcaption>
    </figure>
  )
}

export { PreviewTile }
