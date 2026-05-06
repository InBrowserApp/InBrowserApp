import {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import { DEFAULT_TEXT, STORAGE_KEYS } from "./client/constants"
import {
  EMPTY_RESULTS,
  filterResults,
  getResults,
  type CrcDigestState,
  type ResultFilter,
} from "./client/state"
import type { CrcChecksumCalculatorPageMessages } from "./client/types"
import { CrcInputCard } from "./components/crc-input-card"
import { CrcResultsCard } from "./components/crc-results-card"
import { calculateCrcChecksums, type CrcResult } from "./core/crc"

type CrcChecksumCalculatorClientProps = Readonly<{
  messages: CrcChecksumCalculatorPageMessages
}>

function CrcChecksumCalculatorClient({
  messages,
}: CrcChecksumCalculatorClientProps) {
  const plainTextId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const lastResultsRef = useRef<readonly CrcResult[]>(EMPTY_RESULTS)

  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filter, setFilter] = useState<ResultFilter>("all")
  const [digestState, setDigestState] = useState<CrcDigestState>({
    status: "loading",
    results: EMPTY_RESULTS,
  })

  const deferredPlainText = useDeferredValue(plainText)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)

    if (storedText !== null) {
      setPlainText(storedText)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.text, plainText)
  }, [plainText])

  useEffect(() => {
    let cancelled = false
    const previousResults = lastResultsRef.current
    const source = selectedFile
      ? selectedFile
      : deferredPlainText.length > 0
        ? new Blob([deferredPlainText])
        : null

    if (!source) {
      setDigestState({ status: "idle" })
      return
    }

    setDigestState({ status: "loading", results: previousResults })

    void calculateCrcChecksums(source)
      .then((results) => {
        if (!cancelled) {
          lastResultsRef.current = results
          setDigestState({ status: "ready", results })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setDigestState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : messages.calculationError,
            results: previousResults,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [deferredPlainText, messages.calculationError, selectedFile])

  const visibleResults = useMemo(
    () => filterResults(getResults(digestState), filter),
    [digestState, filter]
  )
  const visibleResultsText = useMemo(
    () =>
      visibleResults
        .map((result) => `${result.name}: ${result.hex}`)
        .join("\n"),
    [visibleResults]
  )

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0]
    event.target.value = ""

    if (!nextFile) {
      return
    }

    setSelectedFile(nextFile)
  }

  return (
    <div className="grid gap-6">
      <CrcInputCard
        messages={messages}
        plainTextId={plainTextId}
        plainText={plainText}
        selectedFile={selectedFile}
        fileInputRef={fileInputRef}
        onTextChange={setPlainText}
        onFileChange={(event) => {
          void handleFileChange(event)
        }}
        onClearFile={() => {
          setSelectedFile(null)
        }}
      />

      <CrcResultsCard
        messages={messages}
        state={digestState}
        filter={filter}
        visibleResults={visibleResults}
        visibleResultsText={visibleResultsText}
        onFilterChange={setFilter}
      />
    </div>
  )
}

export default CrcChecksumCalculatorClient
