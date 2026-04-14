import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import {
  DEFAULT_PRETTIER_FORMAT_OPTIONS,
  DEFAULT_SOURCE_CODE,
  LARGE_PRETTIER_INPUT_THRESHOLD,
  STORAGE_KEYS,
} from "./client/constants"
import { formatCodeWithPrettierWorker } from "./client/prettier-worker-client"
import { parseStoredFormatOptions } from "./client/storage"
import type {
  PrettierCodeFormatterClientProps,
  PrettierOutputState,
} from "./client/types"
import { OptionsCard } from "./components/options-card"
import { PrettierInputCard } from "./components/prettier-input-card"
import { PrettierOutputCard } from "./components/prettier-output-card"
import {
  createPrettierFormatRequest,
  detectPrettierLanguageFromFilename,
  getPrettierDownloadFilename,
  getPrettierLanguageConfig,
} from "./core/prettier-languages"

function PrettierCodeFormatterClient({
  messages,
}: PrettierCodeFormatterClientProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)
  const formatTokenRef = useRef(0)
  const previousLanguageRef = useRef(DEFAULT_PRETTIER_FORMAT_OPTIONS.language)

  const [sourceCode, setSourceCode] = useState(DEFAULT_SOURCE_CODE)
  const [formatOptions, setFormatOptions] = useState(
    DEFAULT_PRETTIER_FORMAT_OPTIONS
  )
  const [submittedSourceCode, setSubmittedSourceCode] =
    useState(DEFAULT_SOURCE_CODE)
  const [submittedFormatOptions, setSubmittedFormatOptions] = useState(
    DEFAULT_PRETTIER_FORMAT_OPTIONS
  )
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [isPendingLargeFormat, setIsPendingLargeFormat] = useState(false)
  const [outputState, setOutputState] = useState<PrettierOutputState>({
    state: "formatting",
  })

  const deferredSourceCode = useDeferredValue(sourceCode)
  const deferredFormatOptions = useDeferredValue(formatOptions)
  const formatOptionsSignature = JSON.stringify(formatOptions)
  const submittedFormatOptionsSignature = JSON.stringify(submittedFormatOptions)
  const downloadFilename = getPrettierDownloadFilename(
    submittedFormatOptions.language
  )

  useEffect(() => {
    const storedSourceCode = window.localStorage.getItem(
      STORAGE_KEYS.sourceCode
    )
    const storedFormatOptions = window.localStorage.getItem(
      STORAGE_KEYS.formatOptions
    )
    const parsedStoredFormatOptions =
      parseStoredFormatOptions(storedFormatOptions)

    if (storedSourceCode !== null) {
      setSourceCode(storedSourceCode)
      setSubmittedSourceCode(storedSourceCode)
    }

    setFormatOptions(parsedStoredFormatOptions)
    setSubmittedFormatOptions(parsedStoredFormatOptions)
    previousLanguageRef.current = parsedStoredFormatOptions.language
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.sourceCode, sourceCode)
  }, [sourceCode])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.formatOptions,
      JSON.stringify(formatOptions)
    )
  }, [formatOptions])

  useEffect(() => {
    const previousLanguage = previousLanguageRef.current

    if (formatOptions.language === previousLanguage) {
      return
    }

    const previousSample = getPrettierLanguageConfig(previousLanguage).sample

    if (!sourceCode.trim() || sourceCode === previousSample) {
      setSourceCode(getPrettierLanguageConfig(formatOptions.language).sample)
    }

    previousLanguageRef.current = formatOptions.language
  }, [formatOptions.language, sourceCode])

  useEffect(() => {
    if (sourceCode.length >= LARGE_PRETTIER_INPUT_THRESHOLD) {
      setIsPendingLargeFormat(
        sourceCode !== submittedSourceCode ||
          formatOptionsSignature !== submittedFormatOptionsSignature
      )
      return
    }

    setSubmittedSourceCode(deferredSourceCode)
    setSubmittedFormatOptions(deferredFormatOptions)
    setIsPendingLargeFormat(false)
  }, [
    deferredFormatOptions,
    deferredSourceCode,
    formatOptionsSignature,
    sourceCode,
    submittedFormatOptionsSignature,
    submittedSourceCode,
  ])

  useEffect(() => {
    const request = createPrettierFormatRequest(
      submittedSourceCode,
      submittedFormatOptions
    )
    const token = ++formatTokenRef.current

    if (!submittedSourceCode.trim()) {
      setOutputState({ state: "empty" })
      return
    }

    setOutputState({ state: "formatting" })

    void formatCodeWithPrettierWorker(request)
      .then((formatted) => {
        if (token !== formatTokenRef.current) {
          return
        }

        setOutputState({
          state: "formatted",
          request,
          formatted,
        })
      })
      .catch((error: unknown) => {
        if (token !== formatTokenRef.current) {
          return
        }

        setOutputState({
          state: "error",
          request,
          message:
            error instanceof Error ? error.message : messages.formatErrorLabel,
        })
      })
  }, [messages.formatErrorLabel, submittedFormatOptions, submittedSourceCode])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (outputState.state !== "formatted") {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([outputState.formatted], {
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
  }, [outputState])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const nextSourceCode = await file.text()
    const detectedLanguage = detectPrettierLanguageFromFilename(file.name)

    startTransition(() => {
      setSourceCode(nextSourceCode)

      if (detectedLanguage) {
        setFormatOptions((currentOptions) => ({
          ...currentOptions,
          language: detectedLanguage,
        }))
      }
    })
  }

  function handleUseSample() {
    startTransition(() => {
      setSourceCode(getPrettierLanguageConfig(formatOptions.language).sample)
      setFormatOptions({
        ...DEFAULT_PRETTIER_FORMAT_OPTIONS,
        language: formatOptions.language,
      })
    })
  }

  function handleClear() {
    startTransition(() => {
      setSourceCode("")
    })
  }

  function handleFormatNow() {
    setSubmittedSourceCode(sourceCode)
    setSubmittedFormatOptions(formatOptions)
    setIsPendingLargeFormat(false)
  }

  return (
    <div className="grid gap-6">
      <div className="grid items-stretch gap-6 xl:grid-cols-2">
        <PrettierInputCard
          fileInputRef={fileInputRef}
          hasInputError={outputState.state === "error"}
          isPendingLargeFormat={isPendingLargeFormat}
          messages={messages}
          sourceCode={sourceCode}
          onClear={handleClear}
          onFileChange={(event) => {
            void handleFileChange(event)
          }}
          onFormatNow={handleFormatNow}
          onSourceCodeChange={setSourceCode}
          onUseSample={handleUseSample}
        />
        <PrettierOutputCard
          downloadFilename={downloadFilename}
          downloadUrl={downloadUrl}
          messages={messages}
          outputState={outputState}
        />
      </div>

      <OptionsCard
        messages={messages}
        options={formatOptions}
        setOptions={setFormatOptions}
      />
    </div>
  )
}

export default PrettierCodeFormatterClient
