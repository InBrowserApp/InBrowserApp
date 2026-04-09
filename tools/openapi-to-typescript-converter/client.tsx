import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import {
  DEFAULT_OPENAPI_TYPEGEN_OPTIONS,
  LARGE_OPENAPI_INPUT_THRESHOLD,
  SAMPLE_OPENAPI_DOCUMENT,
  STORAGE_KEYS,
} from "./client/constants"
import { parseStoredOptions } from "./client/storage"
import type {
  OpenApiToTypescriptConverterMessages,
  OpenApiToTypescriptOutputState,
} from "./client/types"
import { OpenApiInputCard } from "./components/openapi-input-card"
import { OptionsCard } from "./components/options-card"
import { TypescriptOutputCard } from "./components/typescript-output-card"
import {
  generateOpenApiTypes,
  parseOpenApiDocument,
  type OpenApiTypegenOptions,
} from "./core/openapi-typescript"

type OpenApiToTypescriptConverterClientProps = Readonly<{
  messages: OpenApiToTypescriptConverterMessages
}>

function OpenApiToTypescriptConverterClient({
  messages,
}: OpenApiToTypescriptConverterClientProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [openApiText, setOpenApiText] = useState(SAMPLE_OPENAPI_DOCUMENT)
  const [generatedOpenApiText, setGeneratedOpenApiText] = useState(
    SAMPLE_OPENAPI_DOCUMENT
  )
  const [options, setOptions] = useState<OpenApiTypegenOptions>(
    DEFAULT_OPENAPI_TYPEGEN_OPTIONS
  )
  const [generatedOptions, setGeneratedOptions] =
    useState<OpenApiTypegenOptions>(DEFAULT_OPENAPI_TYPEGEN_OPTIONS)
  const [showUrlImport, setShowUrlImport] = useState(false)
  const [importUrl, setImportUrl] = useState("")
  const [importUrlError, setImportUrlError] = useState("")
  const [isFetchingUrl, setIsFetchingUrl] = useState(false)
  const [pendingLargeGenerate, setPendingLargeGenerate] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredOpenApiText = useDeferredValue(openApiText)
  const deferredOptions = useDeferredValue(options)
  const optionsSignature = JSON.stringify(options)
  const generatedOptionsSignature = JSON.stringify(generatedOptions)
  const parseResult = useMemo(
    () => parseOpenApiDocument(generatedOpenApiText),
    [generatedOpenApiText]
  )
  const outputState = useMemo<OpenApiToTypescriptOutputState>(() => {
    if (!generatedOpenApiText.trim()) {
      return { state: "empty" }
    }

    if (!parseResult.ok) {
      if (parseResult.code === "empty") {
        return { state: "empty" }
      }

      return {
        state: "parse-error",
        description: getParseErrorMessage(parseResult, messages),
      }
    }

    if (parseResult.externalRefs.length > 0) {
      return {
        state: "external-refs",
        refs: parseResult.externalRefs,
      }
    }

    try {
      return {
        state: "generated",
        output: generateOpenApiTypes(parseResult.document, generatedOptions),
      }
    } catch (error) {
      return {
        state: "generate-error",
        description: error instanceof Error ? error.message : String(error),
      }
    }
  }, [generatedOpenApiText, generatedOptions, messages, parseResult])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedOpenApiText = window.localStorage.getItem(
      STORAGE_KEYS.openApiText
    )
    const storedOptions = window.localStorage.getItem(STORAGE_KEYS.options)
    const parsedStoredOptions = parseStoredOptions(storedOptions)

    if (storedOpenApiText !== null) {
      setOpenApiText(storedOpenApiText)
      setGeneratedOpenApiText(storedOpenApiText)
    }

    setOptions(parsedStoredOptions)
    setGeneratedOptions(parsedStoredOptions)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.openApiText, openApiText)
  }, [openApiText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.options, JSON.stringify(options))
  }, [options])

  useEffect(() => {
    if (openApiText.length >= LARGE_OPENAPI_INPUT_THRESHOLD) {
      setPendingLargeGenerate(
        openApiText !== generatedOpenApiText ||
          optionsSignature !== generatedOptionsSignature
      )
      return
    }

    setGeneratedOpenApiText(deferredOpenApiText)
    setGeneratedOptions(deferredOptions)
    setPendingLargeGenerate(false)
  }, [
    deferredOpenApiText,
    deferredOptions,
    generatedOpenApiText,
    generatedOptionsSignature,
    openApiText,
    optionsSignature,
  ])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (outputState.state !== "generated") {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([outputState.output], {
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

    const nextText = await file.text()

    startTransition(() => {
      setOpenApiText(nextText)
    })
  }

  function useSample() {
    startTransition(() => {
      setOpenApiText(SAMPLE_OPENAPI_DOCUMENT)
      setOptions(DEFAULT_OPENAPI_TYPEGEN_OPTIONS)
      setImportUrl("")
      setImportUrlError("")
      setShowUrlImport(false)
    })
  }

  function clearAll() {
    startTransition(() => {
      setOpenApiText("")
      setImportUrl("")
      setImportUrlError("")
    })
  }

  function generateNow() {
    setGeneratedOpenApiText(openApiText)
    setGeneratedOptions(options)
    setPendingLargeGenerate(false)
  }

  function toggleUrlImport() {
    setShowUrlImport((currentValue) => !currentValue)
    setImportUrlError("")
  }

  async function fetchFromUrl() {
    const value = importUrl.trim()

    if (!value) {
      setImportUrlError(messages.importUrlEmptyError)
      return
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(value)
    } catch {
      setImportUrlError(messages.importUrlInvalidError)
      return
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      setImportUrlError(messages.importUrlInvalidError)
      return
    }

    setIsFetchingUrl(true)
    setImportUrlError("")

    try {
      const response = await fetch(value, { mode: "cors" })

      if (!response.ok) {
        const status = response.status ? `${response.status}` : ""
        const statusText = response.statusText ? ` ${response.statusText}` : ""
        throw new Error(`${status}${statusText}`.trim() || "Request failed")
      }

      const nextText = await response.text()

      startTransition(() => {
        setOpenApiText(nextText)
        setShowUrlImport(false)
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setImportUrlError(
        messages.importUrlFetchError.replace("{message}", message)
      )
    } finally {
      setIsFetchingUrl(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid items-stretch gap-6 xl:grid-cols-2">
        <OpenApiInputCard
          fileInputRef={fileInputRef}
          hasInputError={outputState.state === "parse-error"}
          importUrl={importUrl}
          importUrlError={importUrlError}
          isFetchingUrl={isFetchingUrl}
          messages={messages}
          openApiText={openApiText}
          pendingLargeGenerate={pendingLargeGenerate}
          showUrlImport={showUrlImport}
          onClear={clearAll}
          onFetchUrl={() => {
            void fetchFromUrl()
          }}
          onFileChange={(event) => {
            void handleFileChange(event)
          }}
          onGenerateNow={generateNow}
          onImportUrlChange={(value) => {
            setImportUrl(value)
            if (importUrlError) {
              setImportUrlError("")
            }
          }}
          onOpenApiChange={setOpenApiText}
          onToggleUrlImport={toggleUrlImport}
          onUseSample={useSample}
        />

        <TypescriptOutputCard
          downloadUrl={downloadUrl}
          messages={messages}
          outputState={outputState}
        />
      </div>

      <OptionsCard
        messages={messages}
        options={options}
        setOptions={setOptions}
      />
    </div>
  )
}

function getParseErrorMessage(
  parseResult: ReturnType<typeof parseOpenApiDocument>,
  messages: OpenApiToTypescriptConverterMessages
) {
  if (parseResult.ok) {
    return ""
  }

  if (parseResult.code === "invalid") {
    return parseResult.message
      ? messages.invalidDocumentWithMessage.replace(
          "{message}",
          parseResult.message
        )
      : messages.invalidDocumentMessage
  }

  if (parseResult.code === "not-object") {
    return messages.invalidRootMessage
  }

  if (parseResult.code === "unsupported-version") {
    return messages.unsupportedVersionMessage
  }

  return messages.invalidDocumentMessage
}

export default OpenApiToTypescriptConverterClient
