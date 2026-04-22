import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import { InputCard } from "./components/input-card"
import { OptionsCard } from "./components/options-card"
import { ResultsCard } from "./components/results-card"
import {
  BASE58_ALPHABETS,
  decodeBase58Preview,
  deriveDecodedFileName,
  resolveBase58AlphabetKey,
  type Base58AlphabetKey,
} from "./core/base58"
import type { Base58AlphabetOption, Base58DecoderPageMessages } from "./types"

type Base58DecoderClientProps = Readonly<{
  messages: Base58DecoderPageMessages
}>

const STORAGE_KEYS = {
  text: "tools:base58-decoder:text",
  alphabet: "tools:base58-decoder:alphabet",
} as const

const DEFAULT_INPUT = "StV1DL6CwTryKyV"
const DEFAULT_ALPHABET_KEY = "bitcoin" as const satisfies Base58AlphabetKey
const FILE_ACCEPT = "text/*,.txt,.log,.md,.json,.csv,.yaml,.yml,.b58,.base58"

function Base58DecoderClient({ messages }: Base58DecoderClientProps) {
  const base58InputId = useId()
  const alphabetSelectId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const pendingFileReadIdRef = useRef(0)
  const downloadUrlRef = useRef<string | null>(null)

  const [base58Input, setBase58Input] = useState(DEFAULT_INPUT)
  const [alphabetKey, setAlphabetKey] =
    useState<Base58AlphabetKey>(DEFAULT_ALPHABET_KEY)
  const [sourceFileName, setSourceFileName] = useState<string | null>(null)
  const [fileReadFailed, setFileReadFailed] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredBase58Input = useDeferredValue(base58Input)
  const decodeState = useMemo(
    () =>
      decodeBase58Preview(deferredBase58Input, {
        alphabet: BASE58_ALPHABETS[alphabetKey],
      }),
    [alphabetKey, deferredBase58Input]
  )
  const decodedBytes = useMemo(
    () => (decodeState.state === "decoded" ? decodeState.bytes : null),
    [decodeState]
  )
  const alphabetOptions = useMemo<readonly Base58AlphabetOption[]>(
    () => [
      {
        value: "bitcoin",
        label: messages.alphabetBitcoinLabel,
      },
      {
        value: "flickr",
        label: messages.alphabetFlickrLabel,
      },
      {
        value: "ripple",
        label: messages.alphabetRippleLabel,
      },
    ],
    [
      messages.alphabetBitcoinLabel,
      messages.alphabetFlickrLabel,
      messages.alphabetRippleLabel,
    ]
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)
    const storedAlphabet = window.localStorage.getItem(STORAGE_KEYS.alphabet)

    if (storedText !== null) {
      setBase58Input(storedText)
    }

    if (storedAlphabet !== null) {
      setAlphabetKey(resolveBase58AlphabetKey(storedAlphabet))
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.text, base58Input)
  }, [base58Input])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.alphabet, alphabetKey)
  }, [alphabetKey])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (!decodedBytes) {
      setDownloadUrl(null)
      return
    }

    const downloadBuffer = decodedBytes.buffer.slice(
      decodedBytes.byteOffset,
      decodedBytes.byteOffset + decodedBytes.byteLength
    ) as ArrayBuffer
    const nextUrl = URL.createObjectURL(
      new Blob([downloadBuffer], { type: "application/octet-stream" })
    )

    downloadUrlRef.current = nextUrl
    setDownloadUrl(nextUrl)

    return () => {
      if (downloadUrlRef.current === nextUrl) {
        URL.revokeObjectURL(nextUrl)
        downloadUrlRef.current = null
      }
    }
  }, [decodedBytes])

  function handleInputChange(nextValue: string) {
    pendingFileReadIdRef.current += 1
    setBase58Input(nextValue)
    setSourceFileName(null)
    setFileReadFailed(false)
  }

  function handleReset() {
    pendingFileReadIdRef.current += 1
    setBase58Input(DEFAULT_INPUT)
    setAlphabetKey(DEFAULT_ALPHABET_KEY)
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
        setBase58Input(nextText)
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

  const downloadFileName = deriveDecodedFileName(sourceFileName)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <div className="grid gap-6">
        <OptionsCard
          alphabetKey={alphabetKey}
          alphabetOptions={alphabetOptions}
          messages={messages}
          selectId={alphabetSelectId}
          onAlphabetChange={setAlphabetKey}
        />

        <InputCard
          accept={FILE_ACCEPT}
          base58Input={base58Input}
          inputId={base58InputId}
          fileInputRef={fileInputRef}
          hasInvalidInput={
            !fileReadFailed && decodeState.state === "invalid-base58"
          }
          messages={messages}
          sourceFileName={sourceFileName}
          onFileChange={handleFileChange}
          onInputChange={handleInputChange}
          onReset={handleReset}
        />
      </div>

      <ResultsCard
        decodeState={decodeState}
        downloadFileName={downloadFileName}
        downloadUrl={downloadUrl}
        fileReadFailed={fileReadFailed}
        messages={messages}
      />
    </div>
  )
}

export default Base58DecoderClient
