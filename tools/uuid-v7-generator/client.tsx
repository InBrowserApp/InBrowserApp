import { startTransition, useEffect, useId, useMemo, useState } from "react"

import {
  UUID_V7_DEFAULT_COUNT,
  generateUuidV7Ids,
  normalizeUuidV7Count,
  parseUuidV7Timestamp,
} from "./core/uuid-v7"
import { UuidV7OptionsCard } from "./components/options-card"
import { UuidV7ResultsCard } from "./components/results-card"

import type { UuidV7Messages } from "./types"

type UuidV7GeneratorClientProps = Readonly<{
  messages: UuidV7Messages
}>

const STORAGE_KEYS = {
  count: "tools:uuid-v7-generator:count",
} as const

function UuidV7GeneratorClient({ messages }: UuidV7GeneratorClientProps) {
  const countId = useId()

  const [count, setCount] = useState(UUID_V7_DEFAULT_COUNT)
  const [generationVersion, setGenerationVersion] = useState(0)
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedCount = window.localStorage.getItem(STORAGE_KEYS.count)

    if (storedCount !== null) {
      const parsedCount = Number(storedCount)

      if (Number.isFinite(parsedCount)) {
        setCount(normalizeUuidV7Count(parsedCount))
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
    const normalizedCount = normalizeUuidV7Count(count)

    if (count !== normalizedCount) {
      setCount(normalizedCount)
      return
    }

    startTransition(() => {
      setGeneratedIds(generateUuidV7Ids(normalizedCount))
    })
  }, [count, generationVersion])

  const output = generatedIds.join("\n")
  const generatedAtMs = generatedIds[0]
    ? parseUuidV7Timestamp(generatedIds[0])
    : null
  const generatedAtLabel = useMemo(() => {
    if (generatedAtMs === null) {
      return messages.unavailableLabel
    }

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(new Date(generatedAtMs))
  }, [generatedAtMs, messages.unavailableLabel])
  const downloadFilename = `uuid-v7-${count}.txt`

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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div className="min-w-0 xl:sticky xl:top-6 xl:self-start">
        <UuidV7OptionsCard
          messages={messages}
          countId={countId}
          count={count}
          onCountChange={(value) => {
            setCount(normalizeUuidV7Count(Number(value)))
          }}
        />
      </div>

      <UuidV7ResultsCard
        downloadFilename={downloadFilename}
        downloadUrl={downloadUrl}
        generatedAtLabel={generatedAtLabel}
        generatedAtMs={generatedAtMs}
        messages={messages}
        output={output}
        count={generatedIds.length}
        onRegenerate={() => {
          startTransition(() => {
            setGenerationVersion((current) => current + 1)
          })
        }}
      />
    </div>
  )
}

export default UuidV7GeneratorClient
