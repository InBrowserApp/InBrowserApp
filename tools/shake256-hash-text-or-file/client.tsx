import { useDeferredValue, useEffect, useId, useRef, useState } from "react"

import {
  DEFAULT_OUTPUT_LENGTH,
  DEFAULT_TEXT,
  STORAGE_KEYS,
} from "./client/constants"
import type {
  Shake256DigestState,
  Shake256HashTextOrFilePageMessages,
} from "./client/types"
import { ConfigurationCard } from "./components/configuration-card"
import { HashInputCard } from "./components/hash-input-card"
import { ResultsCard } from "./components/results-card"
import {
  SHAKE256_MAX_OUTPUT_LENGTH,
  SHAKE256_MIN_OUTPUT_LENGTH,
  SHAKE256_OUTPUT_LENGTH_STEP,
  hashShake256,
} from "./core/shake256"

type Shake256HashTextOrFileClientProps = Readonly<{
  messages: Shake256HashTextOrFilePageMessages
}>

function Shake256HashTextOrFileClient({
  messages,
}: Shake256HashTextOrFileClientProps) {
  const outputLengthId = useId()
  const plainTextId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [outputLengthInput, setOutputLengthInput] = useState(
    String(DEFAULT_OUTPUT_LENGTH)
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [digestState, setDigestState] = useState<Shake256DigestState>({
    status: "loading",
  })

  const deferredPlainText = useDeferredValue(plainText)
  const outputLengthState = parseOutputLength(outputLengthInput)

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

    setDigestState({ status: "loading" })

    void hashShake256(source, {
      outputLength: outputLengthState.value,
    })
      .then((digest) => {
        if (!cancelled) {
          setDigestState({ status: "ready", digest })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setDigestState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : selectedFile
                  ? "Failed to hash file."
                  : "Failed to hash text.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [deferredPlainText, outputLengthState.value, selectedFile])

  return (
    <div className="grid gap-6">
      <ConfigurationCard
        isOutputLengthValid={outputLengthState.isValid}
        messages={messages}
        outputLengthId={outputLengthId}
        outputLengthInput={outputLengthInput}
        onOutputLengthChange={setOutputLengthInput}
      />

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

      <ResultsCard
        digestState={digestState}
        messages={messages}
        selectedFile={selectedFile}
      />
    </div>
  )
}

function parseOutputLength(value: string) {
  const normalized = value.trim()

  if (normalized === "") {
    return { value: DEFAULT_OUTPUT_LENGTH, isValid: true }
  }

  const parsed = Number(normalized)

  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return { value: DEFAULT_OUTPUT_LENGTH, isValid: false }
  }

  if (
    parsed < SHAKE256_MIN_OUTPUT_LENGTH ||
    parsed > SHAKE256_MAX_OUTPUT_LENGTH ||
    parsed % SHAKE256_OUTPUT_LENGTH_STEP !== 0
  ) {
    return { value: DEFAULT_OUTPUT_LENGTH, isValid: false }
  }

  return { value: parsed, isValid: true }
}

export default Shake256HashTextOrFileClient
