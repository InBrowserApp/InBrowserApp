import { useEffect, useState } from "react"

import { Check, Copy } from "@workspace/ui/icons"

import { formatPercent } from "../core/color"
import type { PaletteSwatch } from "../core/types"
import type { ImagePaletteExtractorMessages } from "./types"

type SwatchGridProps = Readonly<{
  messages: ImagePaletteExtractorMessages
  swatches: readonly PaletteSwatch[]
}>

function SwatchGrid({ messages, swatches }: SwatchGridProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null)

  useEffect(() => {
    if (!copiedHex) return

    const timeout = window.setTimeout(() => {
      setCopiedHex(null)
    }, 1200)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [copiedHex])

  async function copyColor(hex: string) {
    await navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
      {swatches.map((color) => {
        const copied = copiedHex === color.hex

        return (
          <button
            aria-label={`${messages.copyColorLabel} ${color.hex}`}
            className="group flex aspect-square min-h-28 flex-col justify-between rounded-lg border p-3 text-left shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            key={color.hex}
            onClick={() => {
              void copyColor(color.hex)
            }}
            style={{
              backgroundColor: color.hex,
              color: color.textColor,
            }}
            title={`${color.hex} ${formatPercent(color.ratio)}`}
            type="button"
          >
            <span className="flex items-center justify-between gap-2 text-xs font-medium opacity-90">
              {formatPercent(color.ratio)}
              {copied ? <Check /> : <Copy />}
            </span>
            <span className="font-mono text-sm font-semibold">
              {copied ? messages.copiedColorLabel : color.hex}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export { SwatchGrid }
