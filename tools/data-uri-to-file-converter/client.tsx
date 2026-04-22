import { useEffect, useId, useMemo, useRef, useState } from "react"

import { DEFAULT_SAMPLE_INPUT, STORAGE_KEYS } from "./constants"
import { DataUriInputCard } from "./components/input-card"
import { DataUriResultsCard } from "./components/results-card"
import { deriveDecodedFileName, parseDataUriPreview } from "./core/data-uri"
import type { DataUriToFileConverterMessages } from "./types"

type DataUriToFileConverterClientProps = Readonly<{
  messages: DataUriToFileConverterMessages
}>

function DataUriToFileConverterClient({
  messages,
}: DataUriToFileConverterClientProps) {
  const inputId = useId()
  const fileNameId = useId()
  const previousSuggestedNameRef = useRef(
    deriveDecodedFileName("image/svg+xml")
  )

  const previewUrlRef = useRef<string | null>(null)

  const [input, setInput] = useState(DEFAULT_SAMPLE_INPUT)
  const [fileName, setFileName] = useState(previousSuggestedNameRef.current)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const decodeState = useMemo(() => parseDataUriPreview(input), [input])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedInput = window.localStorage.getItem(STORAGE_KEYS.input)

    if (storedInput !== null) {
      setInput(storedInput)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.input, input)
  }, [input])

  useEffect(() => {
    if (decodeState.state !== "decoded") {
      const previousSuggestedName = previousSuggestedNameRef.current
      previousSuggestedNameRef.current = "data.bin"
      setFileName((currentFileName) =>
        currentFileName === previousSuggestedName ? "" : currentFileName
      )
      return
    }

    const nextSuggestedName = deriveDecodedFileName(decodeState.mimeType)
    const previousSuggestedName = previousSuggestedNameRef.current

    setFileName((currentFileName) => {
      if (
        currentFileName.trim().length === 0 ||
        currentFileName === previousSuggestedName
      ) {
        return nextSuggestedName
      }

      return currentFileName
    })
    previousSuggestedNameRef.current = nextSuggestedName
  }, [decodeState])

  useEffect(() => {
    const previousPreviewUrl = previewUrlRef.current

    if (previousPreviewUrl !== null) {
      URL.revokeObjectURL(previousPreviewUrl)
      previewUrlRef.current = null
    }

    if (decodeState.state !== "decoded") {
      setPreviewUrl(null)
      return
    }

    const blobBuffer = decodeState.bytes.buffer.slice(
      decodeState.bytes.byteOffset,
      decodeState.bytes.byteOffset + decodeState.bytes.byteLength
    ) as ArrayBuffer
    const nextPreviewUrl = URL.createObjectURL(
      new Blob([blobBuffer], { type: decodeState.mimeType })
    )
    previewUrlRef.current = nextPreviewUrl
    setPreviewUrl(nextPreviewUrl)

    return () => {
      if (previewUrlRef.current === nextPreviewUrl) {
        URL.revokeObjectURL(nextPreviewUrl)
        previewUrlRef.current = null
      }
    }
  }, [decodeState])

  function handleInputChange(nextValue: string) {
    setInput(nextValue)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <DataUriInputCard
        messages={messages}
        inputId={inputId}
        value={input}
        onInputChange={handleInputChange}
        onReset={() => {
          setInput(DEFAULT_SAMPLE_INPUT)
        }}
      />
      <DataUriResultsCard
        messages={messages}
        fileNameId={fileNameId}
        decodeState={decodeState}
        fileName={fileName}
        previewUrl={previewUrl}
        onFileNameChange={setFileName}
      />
    </div>
  )
}

export default DataUriToFileConverterClient
