import { startTransition, useEffect, useId, useMemo, useState } from "react"

import {
  DEFAULT_NANOID_COUNT,
  DEFAULT_NANOID_LENGTH,
  NANOID_ALPHABETS,
  generateNanoid,
  getAlphabetMetrics,
  normalizeNanoidCount,
  normalizeNanoidLength,
  type NanoidAlphabetPreset,
} from "./core/nanoid"
import { NanoidOptionsCard } from "./components/options-card"
import { NanoidResultsCard } from "./components/results-card"

import type { NanoidMessages } from "./types"

type NanoidGeneratorClientProps = Readonly<{
  messages: NanoidMessages
}>

const STORAGE_KEYS = {
  count: "tools:nanoid-generator:count",
  length: "tools:nanoid-generator:length",
  alphabetPreset: "tools:nanoid-generator:alphabet-preset",
  customAlphabet: "tools:nanoid-generator:custom-alphabet",
} as const

const PRESET_OPTIONS = [
  "url-safe",
  "alphanumeric",
  "lowercase",
  "uppercase",
  "numbers",
  "hex-lowercase",
  "hex-uppercase",
  "custom",
] as const satisfies readonly NanoidAlphabetPreset[]

function isNanoidAlphabetPreset(value: string): value is NanoidAlphabetPreset {
  return PRESET_OPTIONS.includes(value as NanoidAlphabetPreset)
}

function buildIds(count: number, alphabet: string, length: number) {
  return Array.from({ length: count }, () => generateNanoid(alphabet, length))
}

function resolveGeneratedIds(
  alphabetError: string,
  count: number,
  alphabet: string,
  length: number
) {
  return alphabetError ? [] : buildIds(count, alphabet, length)
}

function NanoidGeneratorClient({ messages }: NanoidGeneratorClientProps) {
  const countId = useId()
  const lengthId = useId()
  const customAlphabetId = useId()

  const [count, setCount] = useState(DEFAULT_NANOID_COUNT)
  const [length, setLength] = useState(DEFAULT_NANOID_LENGTH)
  const [alphabetPreset, setAlphabetPreset] =
    useState<NanoidAlphabetPreset>("url-safe")
  const [customAlphabet, setCustomAlphabet] = useState<string>(
    NANOID_ALPHABETS["url-safe"]
  )
  const [generatedIds, setGeneratedIds] = useState<string[]>([])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedCount = window.localStorage.getItem(STORAGE_KEYS.count)
    const storedLength = window.localStorage.getItem(STORAGE_KEYS.length)
    const storedAlphabetPreset = window.localStorage.getItem(
      STORAGE_KEYS.alphabetPreset
    )
    const storedCustomAlphabet = window.localStorage.getItem(
      STORAGE_KEYS.customAlphabet
    )

    if (storedCount !== null) {
      const parsedCount = Number(storedCount)

      if (Number.isFinite(parsedCount)) {
        setCount(normalizeNanoidCount(parsedCount))
      }
    }

    if (storedLength !== null) {
      const parsedLength = Number(storedLength)

      if (Number.isFinite(parsedLength)) {
        setLength(normalizeNanoidLength(parsedLength))
      }
    }

    if (storedAlphabetPreset && isNanoidAlphabetPreset(storedAlphabetPreset)) {
      setAlphabetPreset(storedAlphabetPreset)
    }

    if (storedCustomAlphabet) {
      setCustomAlphabet(storedCustomAlphabet)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.count, String(count))
  }, [count])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.length, String(length))
  }, [length])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.alphabetPreset, alphabetPreset)
  }, [alphabetPreset])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.customAlphabet, customAlphabet)
  }, [customAlphabet])

  const resolvedAlphabet = useMemo(
    () =>
      alphabetPreset === "custom"
        ? customAlphabet
        : NANOID_ALPHABETS[alphabetPreset],
    [alphabetPreset, customAlphabet]
  )
  const alphabetMetrics = useMemo(
    () => getAlphabetMetrics(resolvedAlphabet),
    [resolvedAlphabet]
  )
  const alphabetError =
    alphabetMetrics.uniqueCount < 2
      ? messages.alphabetTooShort
      : alphabetMetrics.duplicates.length > 0
        ? messages.alphabetDuplicate
        : ""
  const output = generatedIds.join("\n")

  useEffect(() => {
    const nextCount = normalizeNanoidCount(count)
    const nextLength = normalizeNanoidLength(length)

    if (count !== nextCount) {
      setCount(nextCount)
      return
    }

    if (length !== nextLength) {
      setLength(nextLength)
      return
    }

    startTransition(() => {
      setGeneratedIds(
        resolveGeneratedIds(
          alphabetError,
          nextCount,
          resolvedAlphabet,
          nextLength
        )
      )
    })
  }, [alphabetError, count, length, resolvedAlphabet])

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <NanoidOptionsCard
        messages={messages}
        countId={countId}
        lengthId={lengthId}
        customAlphabetId={customAlphabetId}
        count={count}
        length={length}
        alphabetPreset={alphabetPreset}
        customAlphabet={customAlphabet}
        alphabetMetrics={alphabetMetrics}
        alphabetError={alphabetError}
        presetOptions={PRESET_OPTIONS}
        onCountChange={(value) => {
          setCount(normalizeNanoidCount(Number(value)))
        }}
        onLengthChange={(value) => {
          setLength(normalizeNanoidLength(Number(value)))
        }}
        onAlphabetPresetChange={(value) => {
          setAlphabetPreset(value as NanoidAlphabetPreset)
        }}
        onCustomAlphabetChange={(value) => {
          setCustomAlphabet(value)
        }}
      />

      <NanoidResultsCard
        messages={messages}
        output={output}
        onRegenerate={() => {
          const nextCount = normalizeNanoidCount(count)
          const nextLength = normalizeNanoidLength(length)

          startTransition(() => {
            setGeneratedIds(
              resolveGeneratedIds(
                alphabetError,
                nextCount,
                resolvedAlphabet,
                nextLength
              )
            )
          })
        }}
      />
    </div>
  )
}

export default NanoidGeneratorClient
