import { useEffect, useMemo, useState } from "react"

import {
  formatCmyk,
  formatHex,
  formatHsl,
  formatHsv,
  formatHwb,
  formatKeyword,
  formatLab,
  formatLch,
  formatRgb,
  parseCmykColor,
  parseHexColor,
  parseHslColor,
  parseHsvColor,
  parseHwbColor,
  parseKeywordColor,
  parseLabColor,
  parseLchColor,
  parseRgbColor,
} from "./core/color"
import { DEFAULT_COLOR, STORAGE_KEYS, SWATCHES } from "./client/constants"
import { FormatsCard } from "./client/formats-card"
import { OptionsCard } from "./client/options-card"
import { PreviewCard } from "./client/preview-card"

import type { RGBA } from "./core/color"
import type { ColorConverterMessages } from "./client/types"

type ColorConverterClientProps = Readonly<{
  messages: ColorConverterMessages
}>

function readStoredColor(): RGBA {
  /* v8 ignore next */
  if (typeof window === "undefined") return DEFAULT_COLOR
  const stored = window.localStorage.getItem(STORAGE_KEYS.rgba)
  if (!stored) return DEFAULT_COLOR

  try {
    const parsed = JSON.parse(stored) as Partial<RGBA>
    if (
      typeof parsed.r === "number" &&
      typeof parsed.g === "number" &&
      typeof parsed.b === "number" &&
      typeof parsed.a === "number"
    ) {
      return parsed as RGBA
    }
  } catch {}

  return DEFAULT_COLOR
}

function readStoredAlphaFlag() {
  /* v8 ignore next */
  if (typeof window === "undefined") return true
  const stored = window.localStorage.getItem(STORAGE_KEYS.showAlpha)
  return stored === null ? true : stored === "true"
}

function preserveAlpha(next: RGBA, alpha: number): RGBA {
  return { ...next, a: alpha }
}

function ColorConverterClient({ messages }: ColorConverterClientProps) {
  const [rgba, setRgba] = useState<RGBA>(DEFAULT_COLOR)
  const [showAlpha, setShowAlpha] = useState(true)
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)

  useEffect(() => {
    setRgba(readStoredColor())
    setShowAlpha(readStoredAlphaFlag())
    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (!hasLoadedStorage || typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.rgba, JSON.stringify(rgba))
  }, [hasLoadedStorage, rgba])

  useEffect(() => {
    /* v8 ignore next */
    if (!hasLoadedStorage || typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.showAlpha, String(showAlpha))
  }, [hasLoadedStorage, showAlpha])

  const values = useMemo(
    () => ({
      hex: formatHex(rgba, showAlpha),
      rgb: formatRgb(rgba, showAlpha),
      hsl: formatHsl(rgba, showAlpha),
      hsv: formatHsv(rgba, showAlpha),
      hwb: formatHwb(rgba),
      lab: formatLab(rgba),
      lch: formatLch(rgba),
      cmyk: formatCmyk(rgba),
      keyword: formatKeyword(rgba),
    }),
    [rgba, showAlpha]
  )

  const swatchStyle = useMemo(
    () => formatHex(rgba, showAlpha),
    [rgba, showAlpha]
  )

  const colorInputValue = useMemo(() => formatHex(rgba), [rgba])

  function setOpaqueColor(next: RGBA | null) {
    if (!next) {
      return false
    }
    setRgba(preserveAlpha(next, rgba.a))
    return true
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <OptionsCard
        colorInputValue={colorInputValue}
        currentDisplayValue={values.hex}
        messages={messages}
        onColorInputChange={(value) => {
          void setOpaqueColor(parseHexColor(value))
        }}
        onShowAlphaChange={setShowAlpha}
        onSwatchSelect={(value) => {
          void setOpaqueColor(parseHexColor(value))
        }}
        showAlpha={showAlpha}
        swatches={SWATCHES}
        swatchStyle={swatchStyle}
      />

      <div className="grid gap-6">
        <FormatsCard
          messages={messages}
          onCmykCommit={(value) => setOpaqueColor(parseCmykColor(value))}
          onHexCommit={(value) => {
            const parsed = parseHexColor(value)
            if (!parsed) return false
            setRgba(parsed)
            return true
          }}
          onHslCommit={(value) => {
            const parsed = parseHslColor(value)
            if (!parsed) return false
            setRgba(parsed)
            return true
          }}
          onHsvCommit={(value) => {
            const parsed = parseHsvColor(value)
            if (!parsed) return false
            setRgba(parsed)
            return true
          }}
          onHwbCommit={(value) => setOpaqueColor(parseHwbColor(value))}
          onKeywordCommit={(value) => {
            const parsed = parseKeywordColor(value)
            if (!parsed) return false
            setRgba(preserveAlpha(parsed, rgba.a))
            return true
          }}
          onLabCommit={(value) => setOpaqueColor(parseLabColor(value))}
          onLchCommit={(value) => setOpaqueColor(parseLchColor(value))}
          onRgbCommit={(value) => {
            const parsed = parseRgbColor(value)
            if (!parsed) return false
            setRgba(parsed)
            return true
          }}
          values={values}
        />
        <PreviewCard
          hexValue={values.hex}
          keywordValue={values.keyword}
          messages={messages}
          rgbValue={values.rgb}
          swatchStyle={swatchStyle}
        />
      </div>
    </div>
  )
}

export default ColorConverterClient
