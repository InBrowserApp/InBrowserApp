import { useEffect, useId, useRef, useState, type ChangeEvent } from "react"

import {
  DEFAULT_TEXT,
  STORAGE_KEYS,
  getAlphabetLabel,
  getBaseName,
  getEncodedExtension,
} from "./constants"
import { Base85InputCard } from "./components/input-card"
import { Base85OutputCard } from "./components/output-card"
import {
  encodeBase85,
  isBase85Variant,
  type Base85Variant,
} from "./core/base85"
import type { Base85EncoderMessages } from "./types"

type Base85EncoderClientProps = Readonly<{
  messages: Base85EncoderMessages
}>

function Base85EncoderClient({ messages }: Base85EncoderClientProps) {
  const alphabetId = useId()
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [alphabetKey, setAlphabetKey] = useState<Base85Variant>("ascii85")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [encodedText, setEncodedText] = useState(() =>
    encodeBase85(new TextEncoder().encode(DEFAULT_TEXT))
  )
  const [errorMessage, setErrorMessage] = useState("")
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)
    const storedAlphabet = window.localStorage.getItem(STORAGE_KEYS.alphabet)

    if (storedText !== null) {
      setPlainText(storedText)
    }

    if (storedAlphabet !== null && isBase85Variant(storedAlphabet)) {
      setAlphabetKey(storedAlphabet)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.text, plainText)
    window.localStorage.setItem(STORAGE_KEYS.alphabet, alphabetKey)
  }, [alphabetKey, plainText])

  useEffect(() => {
    let cancelled = false

    async function updateEncodedText() {
      setErrorMessage("")

      if (selectedFile === null && plainText.length === 0) {
        setEncodedText("")
        return
      }

      try {
        const bytes =
          selectedFile === null
            ? new TextEncoder().encode(plainText)
            : new Uint8Array(await selectedFile.arrayBuffer())

        if (!cancelled) {
          setEncodedText(encodeBase85(bytes, { variant: alphabetKey }))
        }
      } catch (error) {
        if (!cancelled) {
          setEncodedText("")
          setErrorMessage(
            error instanceof Error && error.message === "Invalid Base85 length"
              ? messages.invalidBase85
              : messages.readFailed
          )
        }
      }
    }

    void updateEncodedText()

    return () => {
      cancelled = true
    }
  }, [
    alphabetKey,
    messages.invalidBase85,
    messages.readFailed,
    plainText,
    selectedFile,
  ])

  useEffect(() => {
    if (encodedText.length === 0) {
      setDownloadUrl(null)
      return
    }

    const nextDownloadUrl = URL.createObjectURL(
      new Blob([encodedText], {
        type: "text/plain;charset=utf-8",
      })
    )

    setDownloadUrl((currentDownloadUrl) => {
      if (currentDownloadUrl !== null) {
        URL.revokeObjectURL(currentDownloadUrl)
      }

      return nextDownloadUrl
    })

    return () => {
      URL.revokeObjectURL(nextDownloadUrl)
    }
  }, [encodedText])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0]
    event.target.value = ""

    if (!nextFile) {
      return
    }

    setSelectedFile(nextFile)
  }

  function handleLoadSample() {
    setSelectedFile(null)
    setPlainText(DEFAULT_TEXT)
  }

  function handleClear() {
    setSelectedFile(null)
    setPlainText("")
  }

  const outputDescription =
    messages.alphabet + ": " + getAlphabetLabel(messages, alphabetKey)
  const downloadName =
    selectedFile === null
      ? "encoded." + getEncodedExtension(alphabetKey) + ".txt"
      : getBaseName(selectedFile.name) + "." + getEncodedExtension(alphabetKey)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <Base85InputCard
        messages={messages}
        alphabetId={alphabetId}
        inputId={inputId}
        alphabetKey={alphabetKey}
        plainText={plainText}
        selectedFile={selectedFile}
        fileInputRef={fileInputRef}
        onAlphabetChange={setAlphabetKey}
        onPlainTextChange={setPlainText}
        onLoadSample={handleLoadSample}
        onClear={handleClear}
        onFileChange={handleFileChange}
      />
      <Base85OutputCard
        messages={messages}
        description={outputDescription}
        encodedText={encodedText}
        errorMessage={errorMessage}
        downloadName={downloadName}
        downloadUrl={downloadUrl}
      />
    </div>
  )
}

export default Base85EncoderClient
export type { Base85EncoderMessages }
