import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import {
  DEFAULT_INPUTS,
  STORAGE_KEYS,
  isDefaultInputForVariant,
} from "./constants"
import { Base85InputCard } from "./components/input-card"
import { Base85OutputCard } from "./components/output-card"
import {
  decodeBase85,
  decodeBase85Preview,
  deriveDecodedFileName,
  isBase85Variant,
  type Base85Variant,
} from "./core/base85"
import type { Base85DecoderMessages } from "./types"

type Base85DecoderClientProps = Readonly<{
  messages: Base85DecoderMessages
}>

function Base85DecoderClient({ messages }: Base85DecoderClientProps) {
  const alphabetId = useId()
  const base85InputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const pendingFileReadIdRef = useRef(0)
  const downloadUrlRef = useRef<string | null>(null)

  const [alphabetKey, setAlphabetKey] = useState<Base85Variant>("ascii85")
  const [base85Input, setBase85Input] = useState<string>(DEFAULT_INPUTS.ascii85)
  const [sourceFileName, setSourceFileName] = useState<string | null>(null)
  const [fileReadFailed, setFileReadFailed] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredBase85Input = useDeferredValue(base85Input)
  const decodeState = decodeBase85Preview(deferredBase85Input, alphabetKey)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)
    const storedAlphabet = window.localStorage.getItem(STORAGE_KEYS.alphabet)

    if (storedText !== null) {
      setBase85Input(storedText)
    }

    if (storedAlphabet !== null && isBase85Variant(storedAlphabet)) {
      setAlphabetKey(storedAlphabet)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.text, base85Input)
    window.localStorage.setItem(STORAGE_KEYS.alphabet, alphabetKey)
  }, [alphabetKey, base85Input])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (decodeState.state !== "decoded") {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([decodeBase85(deferredBase85Input, { variant: alphabetKey })], {
        type: "application/octet-stream",
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
  }, [alphabetKey, decodeState.state, deferredBase85Input])

  function handleInputChange(nextValue: string) {
    pendingFileReadIdRef.current += 1
    setBase85Input(nextValue)
    setSourceFileName(null)
    setFileReadFailed(false)
  }

  function handleAlphabetChange(nextVariant: Base85Variant) {
    pendingFileReadIdRef.current += 1

    if (
      sourceFileName === null &&
      isDefaultInputForVariant(base85Input, alphabetKey)
    ) {
      setBase85Input(DEFAULT_INPUTS[nextVariant])
    }

    setAlphabetKey(nextVariant)
    setFileReadFailed(false)
  }

  function handleLoadSample() {
    pendingFileReadIdRef.current += 1
    setBase85Input(DEFAULT_INPUTS[alphabetKey])
    setSourceFileName(null)
    setFileReadFailed(false)
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const requestId = pendingFileReadIdRef.current + 1
    pendingFileReadIdRef.current = requestId
    setFileReadFailed(false)

    try {
      const nextText = await file.text()

      if (requestId !== pendingFileReadIdRef.current) {
        return
      }

      startTransition(() => {
        setBase85Input(nextText)
        setSourceFileName(file.name || null)
        setFileReadFailed(false)
      })
    } catch {
      if (requestId !== pendingFileReadIdRef.current) {
        return
      }

      startTransition(() => {
        setFileReadFailed(true)
        setSourceFileName(null)
      })
    }
  }

  const outputErrorTitle = fileReadFailed
    ? messages.fileReadFailedTitle
    : decodeState.state === "invalid-base85"
      ? messages.invalidBase85Title
      : null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <Base85InputCard
        messages={messages}
        alphabetId={alphabetId}
        base85InputId={base85InputId}
        alphabetKey={alphabetKey}
        base85Input={base85Input}
        sourceFileName={sourceFileName}
        fileInputRef={fileInputRef}
        onAlphabetChange={handleAlphabetChange}
        onInputChange={handleInputChange}
        onLoadSample={handleLoadSample}
        onFileChange={handleFileChange}
      />
      <Base85OutputCard
        messages={messages}
        decodeState={decodeState}
        outputErrorTitle={outputErrorTitle}
        decodedText={decodeState.state === "decoded" ? decodeState.text : ""}
        downloadUrl={downloadUrl}
        downloadFileName={deriveDecodedFileName(sourceFileName)}
      />
    </div>
  )
}

export default Base85DecoderClient
