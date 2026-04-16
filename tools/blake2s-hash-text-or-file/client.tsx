import { useDeferredValue, useEffect, useId, useRef, useState } from "react"

import {
  DEFAULT_OUTPUT_LENGTH,
  DEFAULT_TEXT,
  STORAGE_KEYS,
} from "./client/constants"
import type {
  Blake2sDigestState,
  Blake2sHashTextOrFilePageMessages,
} from "./client/types"
import { ConfigurationCard } from "./components/configuration-card"
import { HashInputCard } from "./components/hash-input-card"
import { ResultsCard } from "./components/results-card"
import { INVALID_BLAKE2S_KEY_BASE64_ERROR, hashBlake2s } from "./core/blake2s"

type Blake2sHashTextOrFileClientProps = Readonly<{
  messages: Blake2sHashTextOrFilePageMessages
}>

function Blake2sHashTextOrFileClient({
  messages,
}: Blake2sHashTextOrFileClientProps) {
  const plainTextId = useId()
  const keyInputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [keyBase64, setKeyBase64] = useState("")
  const [outputLength, setOutputLength] = useState(DEFAULT_OUTPUT_LENGTH)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [digestState, setDigestState] = useState<Blake2sDigestState>({
    status: "loading",
  })

  const deferredPlainText = useDeferredValue(plainText)

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

    void hashBlake2s(source, {
      outputLength,
      keyBase64,
    })
      .then((digest) => {
        if (!cancelled) {
          setDigestState({ status: "ready", digest })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setDigestState(resolveDigestError(error, selectedFile))
        }
      })

    return () => {
      cancelled = true
    }
  }, [deferredPlainText, keyBase64, outputLength, selectedFile])

  return (
    <div className="grid gap-6">
      <ConfigurationCard
        keyInputId={keyInputId}
        keyBase64={keyBase64}
        messages={messages}
        outputLength={outputLength}
        onKeyBase64Change={setKeyBase64}
        onOutputLengthChange={setOutputLength}
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

function resolveDigestError(
  error: unknown,
  selectedFile: File | null
): Blake2sDigestState {
  if (
    error instanceof Error &&
    error.message === INVALID_BLAKE2S_KEY_BASE64_ERROR
  ) {
    return {
      status: "error",
      reason: "invalidBase64",
      message: error.message,
    }
  }

  return {
    status: "error",
    message:
      error instanceof Error
        ? error.message
        : selectedFile
          ? "Failed to hash file."
          : "Failed to hash text.",
  }
}

export default Blake2sHashTextOrFileClient
