import { useDeferredValue, useEffect, useId, useRef, useState } from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { LoaderCircle } from "@workspace/ui/icons"

import { DEFAULT_SEED, DEFAULT_TEXT, STORAGE_KEYS } from "./client/constants"
import type { CityHash64HashTextOrFilePageMessages } from "./client/types"
import {
  DigestSection,
  type CityHash64DigestState,
} from "./components/digest-section"
import { HashInputCard } from "./components/hash-input-card"
import { SeedCard } from "./components/seed-card"
import { hashCityHash64, parseCityHash64Seed } from "./core/cityhash64"

type CityHash64HashTextOrFileClientProps = Readonly<{
  messages: CityHash64HashTextOrFilePageMessages
}>

function CityHash64HashTextOrFileClient({
  messages,
}: CityHash64HashTextOrFileClientProps) {
  const plainTextId = useId()
  const seedInputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [seedInput, setSeedInput] = useState(DEFAULT_SEED)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [digestState, setDigestState] = useState<CityHash64DigestState>({
    status: "loading",
  })

  const deferredPlainText = useDeferredValue(plainText)
  const seedState = parseCityHash64Seed(seedInput)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)

    if (storedText !== null) {
      setPlainText(storedText)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.text, plainText)
  }, [plainText])

  useEffect(() => {
    let cancelled = false

    const source = selectedFile
      ? selectedFile
      : deferredPlainText.length > 0
        ? new Blob([deferredPlainText])
        : null

    if (!source) {
      setDigestState({ status: "idle" })
      return
    }

    if (!seedState.isValid) {
      setDigestState({
        status: "error",
        message: messages.seedInvalid,
      })
      return
    }

    setDigestState({ status: "loading" })

    void hashCityHash64(source, seedState.value)
      .then((digest) => {
        if (!cancelled) {
          setDigestState({ status: "ready", digest })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDigestState({
            status: "error",
            message: selectedFile
              ? messages.fileHashError
              : messages.textHashError,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [
    deferredPlainText,
    messages.seedInvalid,
    messages.fileHashError,
    messages.textHashError,
    seedState.isValid,
    seedState.value,
    selectedFile,
  ])

  return (
    <div className="grid gap-6">
      <HashInputCard
        fileInputRef={fileInputRef}
        messages={messages}
        plainText={plainText}
        plainTextId={plainTextId}
        selectedFile={selectedFile}
        onClearFile={() => {
          setSelectedFile(null)
        }}
        onImportFile={(file) => {
          setSelectedFile(file)
        }}
        onPlainTextChange={setPlainText}
      />

      <SeedCard
        inputId={seedInputId}
        messages={messages}
        seedInput={seedInput}
        invalid={!seedState.isValid}
        onSeedInputChange={setSeedInput}
      />

      <Card>
        <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="grid gap-1">
            <CardTitle>{messages.hashResultLabel}</CardTitle>
            <CardDescription>
              {selectedFile
                ? `${selectedFile.name} • ${formatFileSize(selectedFile.size)}`
                : messages.hashResultDescription}
            </CardDescription>
          </div>
          {digestState.status === "loading" ? (
            <CardAction>
              <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <DigestSection state={digestState} messages={messages} />
        </CardContent>
      </Card>
    </div>
  )
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${formatNumber(size / 1024)} KB`
  }

  return `${formatNumber(size / (1024 * 1024))} MB`
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(value)
}

export default CityHash64HashTextOrFileClient
