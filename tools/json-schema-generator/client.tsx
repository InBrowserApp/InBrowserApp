import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import { DEFAULT_OPTIONS, SAMPLE_JSON, STORAGE_KEYS } from "./client/constants"
import type {
  JsonSchemaGeneratorMessages,
  JsonSchemaGeneratorOptions,
} from "./client/types"
import { InputCard } from "./components/input-card"
import { OptionsCard } from "./components/options-card"
import { OutputCard } from "./components/output-card"
import {
  generateJsonSchema,
  type JsonSchemaDraft,
} from "./core/generate-json-schema"

type JsonSchemaGeneratorClientProps = Readonly<{
  messages: JsonSchemaGeneratorMessages
}>

function parseJsonInput(input: string): { value?: unknown; error?: string } {
  if (!input.trim()) {
    return {}
  }

  try {
    return { value: JSON.parse(input) }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

function isJsonSchemaDraft(value: string | null): value is JsonSchemaDraft {
  return value === "2020-12" || value === "2019-09" || value === "draft-07"
}

function JsonSchemaGeneratorClient({
  messages,
}: JsonSchemaGeneratorClientProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [inputText, setInputText] = useState(SAMPLE_JSON)
  const [options, setOptions] =
    useState<JsonSchemaGeneratorOptions>(DEFAULT_OPTIONS)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredInputText = useDeferredValue(inputText)
  const deferredOptions = useDeferredValue(options)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedInput = window.localStorage.getItem(STORAGE_KEYS.input)
    const storedDraft = window.localStorage.getItem(STORAGE_KEYS.draft)
    const storedInferRequired = window.localStorage.getItem(
      STORAGE_KEYS.inferRequired
    )
    const storedAllowAdditionalProperties = window.localStorage.getItem(
      STORAGE_KEYS.allowAdditionalProperties
    )
    const storedDetectFormat = window.localStorage.getItem(
      STORAGE_KEYS.detectFormat
    )

    if (storedInput !== null) {
      setInputText(storedInput)
    }

    setOptions({
      draft: isJsonSchemaDraft(storedDraft)
        ? storedDraft
        : DEFAULT_OPTIONS.draft,
      inferRequired:
        storedInferRequired === null
          ? DEFAULT_OPTIONS.inferRequired
          : storedInferRequired === "true",
      allowAdditionalProperties:
        storedAllowAdditionalProperties === null
          ? DEFAULT_OPTIONS.allowAdditionalProperties
          : storedAllowAdditionalProperties === "true",
      detectFormat:
        storedDetectFormat === null
          ? DEFAULT_OPTIONS.detectFormat
          : storedDetectFormat === "true",
    })
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.input, inputText)
  }, [inputText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.draft, options.draft)
    window.localStorage.setItem(
      STORAGE_KEYS.inferRequired,
      String(options.inferRequired)
    )
    window.localStorage.setItem(
      STORAGE_KEYS.allowAdditionalProperties,
      String(options.allowAdditionalProperties)
    )
    window.localStorage.setItem(
      STORAGE_KEYS.detectFormat,
      String(options.detectFormat)
    )
  }, [options])

  const parseResult = useMemo(
    () => parseJsonInput(deferredInputText),
    [deferredInputText]
  )
  const schemaText = useMemo(() => {
    if (parseResult.error || parseResult.value === undefined) {
      return ""
    }

    const schema = generateJsonSchema(parseResult.value, deferredOptions)
    return JSON.stringify(schema, null, 2)
  }, [deferredOptions, parseResult.error, parseResult.value])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (!schemaText) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([schemaText], {
        type: "application/json;charset=utf-8",
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
  }, [schemaText])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const nextText = await file.text()
    startTransition(() => {
      setInputText(nextText)
    })
  }

  function useSample() {
    startTransition(() => {
      setInputText(SAMPLE_JSON)
    })
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="xl:h-[80vh]">
          <InputCard
            errorMessage={parseResult.error ?? ""}
            fileInputRef={fileInputRef}
            inputText={inputText}
            messages={messages}
            onFileChange={(event) => {
              void handleFileChange(event)
            }}
            onInputChange={setInputText}
            onUseSample={useSample}
          />
        </div>

        <div className="xl:h-[80vh]">
          <OutputCard
            downloadUrl={downloadUrl}
            errorMessage={parseResult.error ?? ""}
            messages={messages}
            schemaText={schemaText}
          />
        </div>
      </div>

      <OptionsCard
        messages={messages}
        options={options}
        setOptions={setOptions}
      />
    </div>
  )
}

export default JsonSchemaGeneratorClient
