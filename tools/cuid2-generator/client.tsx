import { startTransition, useEffect, useId, useState } from "react"

import {
  CUID2_DEFAULT_LENGTH,
  generateCuid2Ids,
  normalizeCuid2Count,
  normalizeCuid2Length,
} from "./core/cuid2"
import { Cuid2OptionsCard } from "./components/options-card"
import { Cuid2ResultsCard } from "./components/results-card"

import type { Cuid2Messages } from "./types"

type Cuid2GeneratorClientProps = Readonly<{
  messages: Cuid2Messages
}>

const DEFAULT_COUNT = 5

const STORAGE_KEYS = {
  count: "tools:cuid2-generator:count",
  length: "tools:cuid2-generator:length",
} as const

function Cuid2GeneratorClient({ messages }: Cuid2GeneratorClientProps) {
  const countId = useId()
  const lengthId = useId()

  const [count, setCount] = useState(DEFAULT_COUNT)
  const [length, setLength] = useState(CUID2_DEFAULT_LENGTH)
  const [generationVersion, setGenerationVersion] = useState(0)
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedCount = window.localStorage.getItem(STORAGE_KEYS.count)
    const storedLength = window.localStorage.getItem(STORAGE_KEYS.length)

    if (storedCount !== null) {
      const parsedCount = Number(storedCount)

      if (Number.isFinite(parsedCount)) {
        setCount(normalizeCuid2Count(parsedCount))
      }
    }

    if (storedLength !== null) {
      const parsedLength = Number(storedLength)

      if (Number.isFinite(parsedLength)) {
        setLength(normalizeCuid2Length(parsedLength))
      }
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
    const normalizedCount = normalizeCuid2Count(count)
    const normalizedLength = normalizeCuid2Length(length)

    if (count !== normalizedCount) {
      setCount(normalizedCount)
      return
    }

    if (length !== normalizedLength) {
      setLength(normalizedLength)
      return
    }

    startTransition(() => {
      setGeneratedIds(generateCuid2Ids(normalizedCount, normalizedLength))
    })
  }, [count, generationVersion, length])

  const output = generatedIds.join("\n")
  const downloadFilename = `cuid2-${count}x${length}.txt`

  useEffect(() => {
    if (output.length === 0) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([output], {
        type: "text/plain;charset=utf-8",
      })
    )

    setDownloadUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [output])

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Cuid2OptionsCard
        messages={messages}
        countId={countId}
        lengthId={lengthId}
        count={count}
        length={length}
        onCountChange={(value) => {
          setCount(normalizeCuid2Count(Number(value)))
        }}
        onLengthChange={(value) => {
          setLength(normalizeCuid2Length(Number(value)))
        }}
      />

      <Cuid2ResultsCard
        messages={messages}
        output={output}
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

export default Cuid2GeneratorClient
