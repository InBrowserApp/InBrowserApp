import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  DEFAULT_MODIFIED_TEXT,
  DEFAULT_ORIGINAL_TEXT,
  DEFAULT_SELECTED_OPERATIONS,
  LARGE_JSON_INPUT_THRESHOLD,
  STORAGE_KEYS,
} from "./client/constants"
import type { JsonDiffPathMessages, ResultMode } from "./client/types"
import {
  formatJsonInput,
  getOperationOptions,
  parseStoredOperations,
  useLocalStorageItem,
} from "./client/utils"
import { CompareToolbar } from "./components/compare-toolbar"
import { JsonEditorCard } from "./components/json-editor-card"
import { ResultCard } from "./components/result-card"
import {
  diffJsonValues,
  parseJsonWithError,
  toJsonPatch,
  type JsonDiffOperation,
} from "./core/json-diff"

type JsonDiffPathClientProps = Readonly<{
  messages: JsonDiffPathMessages
}>

function JsonDiffPathClient({ messages }: JsonDiffPathClientProps) {
  const downloadUrlRef = useRef<string | null>(null)

  const [originalText, setOriginalText] = useState(DEFAULT_ORIGINAL_TEXT)
  const [modifiedText, setModifiedText] = useState(DEFAULT_MODIFIED_TEXT)
  const [comparisonOriginalText, setComparisonOriginalText] = useState(
    DEFAULT_ORIGINAL_TEXT
  )
  const [comparisonModifiedText, setComparisonModifiedText] = useState(
    DEFAULT_MODIFIED_TEXT
  )
  const [selectedOperations, setSelectedOperations] = useState<
    JsonDiffOperation[]
  >([...DEFAULT_SELECTED_OPERATIONS])
  const [activeResultMode, setActiveResultMode] = useState<ResultMode>("paths")
  const [pendingLargeCompare, setPendingLargeCompare] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredOriginalText = useDeferredValue(originalText)
  const deferredModifiedText = useDeferredValue(modifiedText)
  const exceedsLargeInputThreshold =
    originalText.length + modifiedText.length >= LARGE_JSON_INPUT_THRESHOLD
  const originalParse = useMemo(
    () => parseJsonWithError(comparisonOriginalText),
    [comparisonOriginalText]
  )
  const modifiedParse = useMemo(
    () => parseJsonWithError(comparisonModifiedText),
    [comparisonModifiedText]
  )
  const displayedOriginalError = pendingLargeCompare
    ? undefined
    : originalParse.error
  const displayedModifiedError = pendingLargeCompare
    ? undefined
    : modifiedParse.error
  const isReady =
    Boolean(comparisonOriginalText.trim()) &&
    Boolean(comparisonModifiedText.trim()) &&
    !originalParse.error &&
    !modifiedParse.error
  const diffEntries = useMemo(
    () =>
      isReady ? diffJsonValues(originalParse.value, modifiedParse.value) : [],
    [isReady, originalParse.value, modifiedParse.value]
  )
  const filteredEntries = useMemo(
    () => diffEntries.filter((entry) => selectedOperations.includes(entry.op)),
    [diffEntries, selectedOperations]
  )
  const formattedPaths = useMemo(
    () =>
      JSON.stringify(
        filteredEntries.map((entry) => ({
          op: entry.op,
          path: entry.jsonPath,
          pointer: entry.jsonPointer,
          oldValue: entry.oldValue,
          newValue: entry.newValue,
        })),
        null,
        2
      ),
    [filteredEntries]
  )
  const formattedPatch = useMemo(
    () => JSON.stringify(toJsonPatch(filteredEntries), null, 2),
    [filteredEntries]
  )
  const activeResultValue =
    activeResultMode === "paths" ? formattedPaths : formattedPatch
  const downloadFilename =
    activeResultMode === "paths"
      ? "json-diff-paths.json"
      : "json-diff-patch.json"
  const operationOptions = useMemo(
    () => getOperationOptions(messages),
    [messages]
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedOriginalText = window.localStorage.getItem(
      STORAGE_KEYS.originalText
    )
    const storedModifiedText = window.localStorage.getItem(
      STORAGE_KEYS.modifiedText
    )
    const storedSelectedOperations = window.localStorage.getItem(
      STORAGE_KEYS.selectedOperations
    )
    const storedActiveResultMode = window.localStorage.getItem(
      STORAGE_KEYS.activeResultMode
    )

    if (storedOriginalText !== null) {
      setOriginalText(storedOriginalText)
      setComparisonOriginalText(storedOriginalText)
    }

    if (storedModifiedText !== null) {
      setModifiedText(storedModifiedText)
      setComparisonModifiedText(storedModifiedText)
    }

    if (storedSelectedOperations !== null) {
      const parsedOperations = parseStoredOperations(storedSelectedOperations)

      if (parsedOperations) {
        setSelectedOperations(parsedOperations)
      }
    }

    if (
      storedActiveResultMode === "paths" ||
      storedActiveResultMode === "patch"
    ) {
      setActiveResultMode(storedActiveResultMode)
    }
  }, [])

  useLocalStorageItem(STORAGE_KEYS.originalText, originalText)
  useLocalStorageItem(STORAGE_KEYS.modifiedText, modifiedText)
  useLocalStorageItem(
    STORAGE_KEYS.selectedOperations,
    JSON.stringify(selectedOperations)
  )
  useLocalStorageItem(STORAGE_KEYS.activeResultMode, activeResultMode)

  useEffect(() => {
    if (exceedsLargeInputThreshold) {
      setPendingLargeCompare(
        originalText !== comparisonOriginalText ||
          modifiedText !== comparisonModifiedText
      )
      return
    }

    setComparisonOriginalText(deferredOriginalText)
    setComparisonModifiedText(deferredModifiedText)
    setPendingLargeCompare(false)
  }, [
    comparisonModifiedText,
    comparisonOriginalText,
    deferredModifiedText,
    deferredOriginalText,
    exceedsLargeInputThreshold,
    modifiedText,
    originalText,
  ])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (!isReady) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([activeResultValue], {
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
  }, [activeResultValue, isReady])

  function swapInputs() {
    startTransition(() => {
      setOriginalText(modifiedText)
      setModifiedText(originalText)
    })
  }

  function formatInputs() {
    startTransition(() => {
      setOriginalText(formatJsonInput(originalText))
      setModifiedText(formatJsonInput(modifiedText))
    })
  }

  function useSample() {
    startTransition(() => {
      setOriginalText(DEFAULT_ORIGINAL_TEXT)
      setModifiedText(DEFAULT_MODIFIED_TEXT)
      setSelectedOperations([...DEFAULT_SELECTED_OPERATIONS])
      setActiveResultMode("paths")
    })
  }

  function clearAll() {
    startTransition(() => {
      setOriginalText("")
      setModifiedText("")
      setSelectedOperations([...DEFAULT_SELECTED_OPERATIONS])
      setActiveResultMode("paths")
    })
  }

  function applyComparison() {
    setComparisonOriginalText(originalText)
    setComparisonModifiedText(modifiedText)
    setPendingLargeCompare(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <CompareToolbar
        messages={messages}
        pendingLargeCompare={pendingLargeCompare}
        onApplyComparison={applyComparison}
        onClearAll={clearAll}
        onFormatInputs={formatInputs}
        onSwapInputs={swapInputs}
        onUseSample={useSample}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <JsonEditorCard
          description={messages.originalJsonDescription}
          errorMessage={
            displayedOriginalError
              ? `${messages.invalidOriginalJsonLabel}: ${displayedOriginalError.message}`
              : ""
          }
          label={messages.originalJsonLabel}
          placeholder={messages.originalJsonPlaceholder}
          value={originalText}
          onChange={setOriginalText}
        />

        <JsonEditorCard
          description={messages.modifiedJsonDescription}
          errorMessage={
            displayedModifiedError
              ? `${messages.invalidModifiedJsonLabel}: ${displayedModifiedError.message}`
              : ""
          }
          label={messages.modifiedJsonLabel}
          placeholder={messages.modifiedJsonPlaceholder}
          value={modifiedText}
          onChange={setModifiedText}
        />
      </div>

      <ResultCard
        activeResultMode={activeResultMode}
        activeResultValue={activeResultValue}
        downloadFilename={downloadFilename}
        downloadUrl={downloadUrl}
        filteredCount={filteredEntries.length}
        isReady={isReady}
        messages={messages}
        operationOptions={operationOptions}
        pendingLargeCompare={pendingLargeCompare}
        selectedOperations={selectedOperations}
        totalCount={diffEntries.length}
        onResultModeChange={setActiveResultMode}
        onSelectedOperationsChange={setSelectedOperations}
      />
    </div>
  )
}

export default JsonDiffPathClient
