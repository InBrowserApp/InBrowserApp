import { useDeferredValue, useEffect, useId, useRef, useState } from "react"

import {
  DEFAULT_ALGORITHM,
  DEFAULT_TEXT,
  STORAGE_KEYS,
} from "./client/constants"
import type {
  HashDigestState,
  HashTextOrFileTemplatePageMessages,
} from "./client/types"
import { AlgorithmCard } from "./components/algorithm-card"
import { HashInputCard } from "./components/hash-input-card"
import { ResultsCard } from "./components/results-card"
import { hashSource, isHashAlgorithm, type HashAlgorithm } from "./core/hash"

type HashTextOrFileTemplateClientProps = Readonly<{
  messages: HashTextOrFileTemplatePageMessages
}>

function HashTextOrFileTemplateClient({
  messages,
}: HashTextOrFileTemplateClientProps) {
  const plainTextId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [algorithm, setAlgorithm] = useState<HashAlgorithm>(DEFAULT_ALGORITHM)
  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [digestState, setDigestState] = useState<HashDigestState>({
    status: "loading",
  })

  const deferredPlainText = useDeferredValue(plainText)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedAlgorithm = window.localStorage.getItem(STORAGE_KEYS.algorithm)
    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)

    if (storedAlgorithm && isHashAlgorithm(storedAlgorithm)) {
      setAlgorithm(storedAlgorithm)
    }

    if (storedText !== null) {
      setPlainText(storedText)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.algorithm, algorithm)
  }, [algorithm])

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

    void hashSource(source, algorithm)
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
                : messages.hashErrorMessage,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [algorithm, deferredPlainText, messages.hashErrorMessage, selectedFile])

  return (
    <div className="grid gap-6">
      <AlgorithmCard
        algorithm={algorithm}
        messages={messages}
        onAlgorithmChange={setAlgorithm}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <HashInputCard
          fileInputRef={fileInputRef}
          messages={messages}
          plainText={plainText}
          plainTextId={plainTextId}
          selectedFile={selectedFile}
          onClearFile={() => {
            setSelectedFile(null)
          }}
          onImportFile={setSelectedFile}
          onPlainTextChange={setPlainText}
        />

        <ResultsCard
          algorithm={algorithm}
          digestState={digestState}
          messages={messages}
          selectedFile={selectedFile}
        />
      </div>
    </div>
  )
}

export default HashTextOrFileTemplateClient
