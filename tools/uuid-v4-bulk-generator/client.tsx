import { startTransition, useEffect, useId, useState } from "react"

import {
  UUID_V4_BULK_DEFAULT_COUNT,
  generateUuidV4Batch,
  normalizeUuidV4BulkCount,
} from "./core/uuid-v4-bulk"
import { UuidV4BulkOptionsCard } from "./components/options-card"
import { UuidV4BulkResultsCard } from "./components/results-card"

import type { UuidV4BulkMessages } from "./types"

type UuidV4BulkGeneratorClientProps = Readonly<{
  messages: UuidV4BulkMessages
}>

const STORAGE_KEYS = {
  count: "tools:uuid-v4-bulk-generator:count",
} as const

function UuidV4BulkGeneratorClient({
  messages,
}: UuidV4BulkGeneratorClientProps) {
  const countId = useId()

  const [count, setCount] = useState(UUID_V4_BULK_DEFAULT_COUNT)
  const [generationVersion, setGenerationVersion] = useState(0)
  const [generationError, setGenerationError] = useState("")
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([])
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
        setCount(normalizeUuidV4BulkCount(parsedCount))
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
    const normalizedCount = normalizeUuidV4BulkCount(count)

    if (count !== normalizedCount) {
      setCount(normalizedCount)
      return
    }

    startTransition(() => {
      try {
        setGeneratedUuids(generateUuidV4Batch(normalizedCount))
        setGenerationError("")
      } catch {
        setGeneratedUuids([])
        setGenerationError(messages.generationError)
      }
    })
  }, [count, generationVersion, messages.generationError])

  const output = generatedUuids.join("\n")
  const downloadFilename = `uuid-v4-${count}.txt`

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
      <UuidV4BulkOptionsCard
        messages={messages}
        countId={countId}
        count={count}
        onCountChange={(value) => {
          setCount(normalizeUuidV4BulkCount(Number(value)))
        }}
      />

      <UuidV4BulkResultsCard
        messages={messages}
        output={output}
        generationError={generationError}
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

export default UuidV4BulkGeneratorClient
