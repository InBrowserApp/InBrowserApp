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
  DEFAULT_JSON_TEXT,
  DEFAULT_QUERY_TEXT,
  EXAMPLE_QUERY_VALUES,
  STORAGE_KEYS,
} from "./client/constants"
import type { JmespathTesterMessages } from "./client/types"
import { JsonInputCard } from "./components/json-input-card"
import { QueryCard } from "./components/query-card"
import { ResultCard } from "./components/result-card"
import { evaluateJmespathText, parseJsonText } from "./core/evaluate-jmespath"

type JmespathTesterClientProps = Readonly<{
  messages: JmespathTesterMessages
}>

function JmespathTesterClient({ messages }: JmespathTesterClientProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [jsonText, setJsonText] = useState(DEFAULT_JSON_TEXT)
  const [queryText, setQueryText] = useState(DEFAULT_QUERY_TEXT)
  const [selectedExampleValue, setSelectedExampleValue] =
    useState(DEFAULT_QUERY_TEXT)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredJsonText = useDeferredValue(jsonText)
  const deferredQueryText = useDeferredValue(queryText)
  const evaluation = useMemo(
    () => evaluateJmespathText(deferredJsonText, deferredQueryText),
    [deferredJsonText, deferredQueryText]
  )

  const exampleOptions = useMemo(
    () => [
      {
        label: messages.exampleLastNamesLabel,
        value: EXAMPLE_QUERY_VALUES.lastNames,
      },
      {
        label: messages.exampleAdultsLabel,
        value: EXAMPLE_QUERY_VALUES.adults,
      },
      {
        label: messages.exampleOrdersLabel,
        value: EXAMPLE_QUERY_VALUES.orders,
      },
    ],
    [messages]
  )
  const jsonErrorMessage =
    evaluation.state === "json-error"
      ? `${messages.invalidJsonLabel}: ${evaluation.error}`
      : ""
  const queryErrorMessage =
    evaluation.state === "query-error"
      ? `${messages.invalidQueryLabel}: ${evaluation.error}`
      : ""

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedJsonText = window.localStorage.getItem(STORAGE_KEYS.jsonText)
    const storedQueryText = window.localStorage.getItem(STORAGE_KEYS.queryText)

    if (storedJsonText !== null) {
      setJsonText(storedJsonText)
    }

    if (storedQueryText !== null) {
      setQueryText(storedQueryText)
      setSelectedExampleValue(
        exampleOptions.some((option) => option.value === storedQueryText)
          ? storedQueryText
          : ""
      )
    }
  }, [exampleOptions])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.jsonText, jsonText)
  }, [jsonText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.queryText, queryText)
  }, [queryText])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (evaluation.state !== "ready") {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([evaluation.formattedResult], {
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
  }, [evaluation])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const nextText = await file.text()

    startTransition(() => {
      setJsonText(nextText)
    })
  }

  function formatJson() {
    const parsed = parseJsonText(jsonText)

    if (!jsonText.trim() || !("value" in parsed)) {
      return
    }

    startTransition(() => {
      setJsonText(JSON.stringify(parsed.value, null, 2))
    })
  }

  function useSample() {
    startTransition(() => {
      setJsonText(DEFAULT_JSON_TEXT)
      setQueryText(DEFAULT_QUERY_TEXT)
      setSelectedExampleValue(DEFAULT_QUERY_TEXT)
    })
  }

  function clearAll() {
    startTransition(() => {
      setJsonText("")
      setQueryText("")
      setSelectedExampleValue("")
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <JsonInputCard
          fileInputRef={fileInputRef}
          jsonErrorMessage={jsonErrorMessage}
          jsonText={jsonText}
          messages={messages}
          onClearAll={clearAll}
          onFileChange={(event) => {
            void handleFileChange(event)
          }}
          onFormatJson={formatJson}
          onJsonChange={setJsonText}
          onUseSample={useSample}
        />

        <QueryCard
          exampleOptions={exampleOptions}
          messages={messages}
          onExampleSelect={(value) => {
            setQueryText(value)
            setSelectedExampleValue(value)
          }}
          onQueryChange={(value) => {
            setQueryText(value)
            setSelectedExampleValue(
              exampleOptions.some((option) => option.value === value)
                ? value
                : ""
            )
          }}
          queryErrorMessage={queryErrorMessage}
          queryText={queryText}
          selectedExampleValue={selectedExampleValue}
        />
      </div>

      <ResultCard
        downloadUrl={downloadUrl}
        evaluation={evaluation}
        messages={messages}
      />
    </div>
  )
}

export default JmespathTesterClient
