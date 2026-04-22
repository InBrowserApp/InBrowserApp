import { startTransition, useEffect, useId, useState } from "react"

import { LoremIpsumOptionsCard } from "./components/options-card"
import { LoremIpsumResultsCard } from "./components/results-card"
import {
  DEFAULT_LOREM_IPSUM_LOCALE,
  DEFAULT_LOREM_IPSUM_MODE,
  LOREM_IPSUM_LOCALE_OPTIONS,
  generateLoremIpsum,
  normalizeLoremCount,
  normalizeLoremIpsumMode,
  resolveLoremIpsumLocale,
} from "./core/lorem"

import type { LoremIpsumMessages } from "./types"
import type { LoremIpsumLocale, LoremIpsumMode } from "./core/lorem"

type LoremIpsumGeneratorClientProps = Readonly<{
  messages: LoremIpsumMessages
}>

const DEFAULT_COUNT = 3

const STORAGE_KEYS = {
  mode: "tools:lorem-ipsum-generator:mode",
  count: "tools:lorem-ipsum-generator:count",
  locale: "tools:lorem-ipsum-generator:locale",
} as const

function LoremIpsumGeneratorClient({
  messages,
}: LoremIpsumGeneratorClientProps) {
  const countId = useId()
  const localeId = useId()

  const [mode, setMode] = useState<LoremIpsumMode>(DEFAULT_LOREM_IPSUM_MODE)
  const [count, setCount] = useState(DEFAULT_COUNT)
  const [selectedLocale, setSelectedLocale] = useState<LoremIpsumLocale>(
    DEFAULT_LOREM_IPSUM_LOCALE
  )
  const [generationVersion, setGenerationVersion] = useState(0)
  const [generatedText, setGeneratedText] = useState("")
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedMode = window.localStorage.getItem(STORAGE_KEYS.mode)
    const storedCount = window.localStorage.getItem(STORAGE_KEYS.count)
    const storedLocale = window.localStorage.getItem(STORAGE_KEYS.locale)

    if (storedMode !== null) {
      setMode(normalizeLoremIpsumMode(storedMode))
    }

    if (storedCount !== null) {
      const parsedCount = Number(storedCount)

      if (Number.isFinite(parsedCount)) {
        setCount(normalizeLoremCount(parsedCount))
      }
    }

    if (storedLocale !== null) {
      setSelectedLocale(resolveLoremIpsumLocale(storedLocale))
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.mode, mode)
  }, [mode])

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

    window.localStorage.setItem(STORAGE_KEYS.locale, selectedLocale)
  }, [selectedLocale])

  useEffect(() => {
    startTransition(() => {
      setGeneratedText(
        generateLoremIpsum({
          mode,
          count,
          locale: selectedLocale,
          seed: generationVersion + 1,
        })
      )
    })
  }, [count, generationVersion, mode, selectedLocale])

  const downloadFilename = `lorem-ipsum-${mode}-${count}-${selectedLocale}.txt`

  useEffect(() => {
    if (generatedText.length === 0) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([generatedText], {
        type: "text/plain;charset=utf-8",
      })
    )

    setDownloadUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [generatedText])

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
      <LoremIpsumOptionsCard
        messages={messages}
        countId={countId}
        localeId={localeId}
        mode={mode}
        count={count}
        locale={selectedLocale}
        localeOptions={LOREM_IPSUM_LOCALE_OPTIONS}
        onModeChange={setMode}
        onCountChange={(value) => {
          setCount(normalizeLoremCount(Number(value)))
        }}
        onLocaleChange={setSelectedLocale}
      />

      <LoremIpsumResultsCard
        messages={messages}
        output={generatedText}
        downloadFilename={downloadFilename}
        downloadUrl={downloadUrl}
        onRegenerate={() => {
          startTransition(() => {
            setGenerationVersion((current) => current + 1)
          })
        }}
      />
    </div>
  )
}

export default LoremIpsumGeneratorClient
