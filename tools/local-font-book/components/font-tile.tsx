"use client"

import { buildFontFaceDescriptor } from "../core/local-font-book"

import type { DisplayFont } from "../types"

type FontTileProps = Readonly<{
  font: DisplayFont
  active: boolean
  onSelect: (fontId: string) => void
}>

function FontTile({ font, active, onSelect }: FontTileProps) {
  const descriptor = buildFontFaceDescriptor(font)

  return (
    <button
      type="button"
      data-testid={`font-${font.id}`}
      data-active={active}
      onClick={() => {
        onSelect(font.id)
      }}
      className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border/80 bg-background px-4 py-3.5 text-left transition-colors outline-none hover:border-foreground/20 hover:bg-muted/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[active=true]:border-foreground/35 data-[active=true]:bg-muted/40 data-[active=true]:shadow-xs"
    >
      <div
        className="line-clamp-2 text-[1.05rem] leading-tight font-medium break-words"
        style={descriptor ?? undefined}
      >
        {font.displayName}
      </div>
      <div className="flex min-w-0 flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span className="min-w-0 break-words">{font.displayFamily}</span>
        <span className="min-w-0 break-words">{font.displayStyle}</span>
      </div>
    </button>
  )
}

export default FontTile
