import { useEffect, useId, useMemo, useState } from "react"

import {
  contrastRatio,
  parseColor,
  resolveContrastColors,
  rgbaToHex,
  toCssRgba,
} from "./core/color"
import {
  CONTRAST_THRESHOLDS,
  DEFAULT_BACKGROUND,
  DEFAULT_BACKGROUND_INPUT,
  DEFAULT_FOREGROUND,
  DEFAULT_FOREGROUND_INPUT,
  STORAGE_KEYS,
  SWATCHES,
} from "./client/constants"
import { OptionsCard } from "./client/options-card"
import { PreviewCard } from "./client/preview-card"
import { ResultsCard } from "./client/results-card"

import type { RGBA } from "./core/color"
import type { ColorContrastMessages, ContrastCheck } from "./client/types"

type ColorContrastCheckerClientProps = Readonly<{
  messages: ColorContrastMessages
}>

function readStoredInput(key: string, fallbackValue: string) {
  /* v8 ignore next */
  if (typeof window === "undefined") return fallbackValue
  return window.localStorage.getItem(key) ?? fallbackValue
}

function replaceRgbPreservingAlpha(nextHex: string, reference: RGBA) {
  const parsed = parseColor(nextHex)
  if (!parsed) {
    return nextHex.toUpperCase()
  }

  return rgbaToHex({ ...parsed, a: reference.a }, reference.a < 1)
}

function createChecks(ratio: number | null): readonly ContrastCheck[] {
  if (ratio === null) {
    return []
  }

  return CONTRAST_THRESHOLDS.map(({ key, minimumRatio }) => ({
    key,
    pass: ratio >= minimumRatio,
  }))
}

function ColorContrastCheckerClient({
  messages,
}: ColorContrastCheckerClientProps) {
  const foregroundTextId = useId()
  const backgroundTextId = useId()

  const [foregroundInput, setForegroundInput] = useState(
    DEFAULT_FOREGROUND_INPUT
  )
  const [backgroundInput, setBackgroundInput] = useState(
    DEFAULT_BACKGROUND_INPUT
  )
  const [lastValidForeground, setLastValidForeground] =
    useState(DEFAULT_FOREGROUND)
  const [lastValidBackground, setLastValidBackground] =
    useState(DEFAULT_BACKGROUND)
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)

  useEffect(() => {
    setForegroundInput(
      readStoredInput(STORAGE_KEYS.foreground, DEFAULT_FOREGROUND_INPUT)
    )
    setBackgroundInput(
      readStoredInput(STORAGE_KEYS.background, DEFAULT_BACKGROUND_INPUT)
    )
    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (!hasLoadedStorage || typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.foreground, foregroundInput)
  }, [foregroundInput, hasLoadedStorage])

  useEffect(() => {
    /* v8 ignore next */
    if (!hasLoadedStorage || typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.background, backgroundInput)
  }, [backgroundInput, hasLoadedStorage])

  const foregroundParsed = useMemo(
    () => parseColor(foregroundInput),
    [foregroundInput]
  )
  const backgroundParsed = useMemo(
    () => parseColor(backgroundInput),
    [backgroundInput]
  )

  useEffect(() => {
    if (foregroundParsed) {
      setLastValidForeground(foregroundParsed)
    }
  }, [foregroundParsed])

  useEffect(() => {
    if (backgroundParsed) {
      setLastValidBackground(backgroundParsed)
    }
  }, [backgroundParsed])

  const foregroundPickerValue = useMemo(
    () => rgbaToHex(lastValidForeground),
    [lastValidForeground]
  )
  const backgroundPickerValue = useMemo(
    () => rgbaToHex(lastValidBackground),
    [lastValidBackground]
  )

  const ratio = useMemo(() => {
    if (!foregroundParsed || !backgroundParsed) return null
    return contrastRatio(foregroundParsed, backgroundParsed)
  }, [backgroundParsed, foregroundParsed])

  const checks = useMemo(() => createChecks(ratio), [ratio])

  const resolvedColors = useMemo(() => {
    if (!foregroundParsed || !backgroundParsed) return null
    return resolveContrastColors(foregroundParsed, backgroundParsed)
  }, [backgroundParsed, foregroundParsed])

  const previewStyle = useMemo(
    () => ({
      backgroundColor: toCssRgba(lastValidBackground),
      color: toCssRgba(lastValidForeground),
    }),
    [lastValidBackground, lastValidForeground]
  )

  const foregroundInvalid =
    foregroundInput.trim() !== "" && foregroundParsed === null
  const backgroundInvalid =
    backgroundInput.trim() !== "" && backgroundParsed === null

  function handleSwap() {
    setForegroundInput(backgroundInput)
    setBackgroundInput(foregroundInput)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      <OptionsCard
        backgroundInput={backgroundInput}
        backgroundInvalid={backgroundInvalid}
        backgroundPickerValue={backgroundPickerValue}
        backgroundTextId={backgroundTextId}
        foregroundInput={foregroundInput}
        foregroundInvalid={foregroundInvalid}
        foregroundPickerValue={foregroundPickerValue}
        foregroundTextId={foregroundTextId}
        messages={messages}
        onBackgroundInputChange={setBackgroundInput}
        onBackgroundPickerChange={(value) => {
          setBackgroundInput(
            replaceRgbPreservingAlpha(value, lastValidBackground)
          )
        }}
        onBackgroundSwatchSelect={setBackgroundInput}
        onForegroundInputChange={setForegroundInput}
        onForegroundPickerChange={(value) => {
          setForegroundInput(
            replaceRgbPreservingAlpha(value, lastValidForeground)
          )
        }}
        onForegroundSwatchSelect={setForegroundInput}
        onSwap={handleSwap}
        swatches={SWATCHES}
      />

      <div className="grid gap-6">
        <ResultsCard
          checks={checks}
          messages={messages}
          ratio={ratio}
          resolvedColors={resolvedColors}
        />
        <PreviewCard messages={messages} previewStyle={previewStyle} />
      </div>
    </div>
  )
}

export default ColorContrastCheckerClient
