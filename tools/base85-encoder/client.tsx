import {
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import { ConfigurationCard } from "./components/configuration-card"
import { InputCard } from "./components/input-card"
import { OutputCard } from "./components/output-card"
import {
  INVALID_BASE85_LENGTH,
  deriveEncodedFileName,
  encodeBase85,
} from "./core/base85-encoder"

import type {
  Base85EncoderClientProps,
  Base85Variant,
  EncodingState,
} from "./types"

const TEXT_STORAGE_KEY = "tools:base85-encoder:text"
const VARIANT_STORAGE_KEY = "tools:base85-encoder:alphabet"
const DEFAULT_INPUT = "Hello, World!"

function Base85EncoderClient({ messages }: Base85EncoderClientProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [plainText, setPlainText] = useState(DEFAULT_INPUT)
  const [variant, setVariant] = useState<Base85Variant>("ascii85")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [encodingState, setEncodingState] = useState<EncodingState>({
    status: "loading",
  })

  const deferredPlainText = useDeferredValue(plainText)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(TEXT_STORAGE_KEY)
    const storedVariant = window.localStorage.getItem(VARIANT_STORAGE_KEY)

    if (storedText !== null) {
      setPlainText(storedText)
    }

    if (storedVariant === "ascii85" || storedVariant === "z85") {
      setVariant(storedVariant)
    }
  }, [])

  useEffect(() => {
    persistStorage(TEXT_STORAGE_KEY, plainText)
  }, [plainText])

  useEffect(() => {
    persistStorage(VARIANT_STORAGE_KEY, variant)
  }, [variant])

  useEffect(() => {
    let cancelled = false
    const source = resolveEncodingSource(deferredPlainText, selectedFile)

    if (!source) {
      setEncodingState({ status: "idle" })
      return
    }

    setEncodingState({ status: "loading" })

    void encodeBase85(source, { variant })
      .then((encodedText) => {
        if (!cancelled) {
          setEncodingState({ status: "ready", encodedText })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setEncodingState({
            status: "error",
            message:
              error instanceof Error && error.message === INVALID_BASE85_LENGTH
                ? messages.invalidLengthTitle
                : messages.fileReadFailedTitle,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [
    deferredPlainText,
    messages.fileReadFailedTitle,
    messages.invalidLengthTitle,
    selectedFile,
    variant,
  ])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (encodingState.status !== "ready") {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([encodingState.encodedText], {
        type: "text/plain;charset=utf-8",
      })
    )

    downloadUrlRef.current = nextUrl
    setDownloadUrl(nextUrl)

    return () => {
      if (downloadUrlRef.current === nextUrl) {
        URL.revokeObjectURL(nextUrl)
        downloadUrlRef.current = null
      }
    }
  }, [encodingState])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0]
    event.target.value = ""

    if (!nextFile) {
      return
    }

    setSelectedFile(nextFile)
  }

  const outputText =
    encodingState.status === "ready" ? encodingState.encodedText : ""
  const downloadFileName = deriveEncodedFileName(
    selectedFile ? (selectedFile.name ?? null) : undefined,
    variant
  )

  return (
    <div className="grid gap-6">
      <ConfigurationCard
        alphabet={variant}
        messages={messages}
        onAlphabetChange={setVariant}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
        <InputCard
          inputId={inputId}
          plainText={plainText}
          selectedFile={selectedFile}
          fileInputRef={fileInputRef}
          messages={messages}
          onPlainTextChange={setPlainText}
          onFileChange={(event) => {
            void handleFileChange(event)
          }}
          onClearFile={() => {
            setSelectedFile(null)
          }}
        />

        <OutputCard
          state={encodingState}
          outputText={outputText}
          downloadUrl={downloadUrl}
          downloadFileName={downloadFileName}
          messages={messages}
        />
      </div>
    </div>
  )
}

function persistStorage(key: string, value: string) {
  /* v8 ignore next */
  if (typeof window === "undefined") return

  window.localStorage.setItem(key, value)
}

function resolveEncodingSource(plainText: string, selectedFile: File | null) {
  if (selectedFile) {
    return selectedFile
  }

  return plainText.length > 0 ? new Blob([plainText]) : null
}

export default Base85EncoderClient
