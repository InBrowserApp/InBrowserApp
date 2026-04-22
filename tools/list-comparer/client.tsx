import { startTransition, useDeferredValue, useEffect, useState } from "react"

import {
  DEFAULT_OPTIONS,
  DEFAULT_LEFT_SAMPLE,
  DEFAULT_RESULT_KEY,
  DEFAULT_RIGHT_SAMPLE,
  STORAGE_KEYS,
} from "./constants"
import { CompareInputCard } from "./components/compare-input-card"
import { OptionsCard } from "./components/options-card"
import { ResultCard } from "./components/result-card"
import { SummaryCard } from "./components/summary-card"
import {
  compareLists,
  formatDuplicateItemsForExport,
  formatItemsForExport,
  normalizeDelimiterMode,
  normalizeResultKey,
  type ListComparerOptions,
  type ListResultKey,
} from "./core/compare-lists"

import type { ListComparerMessages, ResultOption } from "./types"

type ListComparerClientProps = Readonly<{
  messages: ListComparerMessages
}>

function ListComparerClient({ messages }: ListComparerClientProps) {
  const [leftText, setLeftText] = useState("")
  const [rightText, setRightText] = useState("")
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [activeResult, setActiveResult] =
    useState<ListResultKey>(DEFAULT_RESULT_KEY)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredLeftText = useDeferredValue(leftText)
  const deferredRightText = useDeferredValue(rightText)
  const comparison = compareLists(deferredLeftText, deferredRightText, options)
  const hasAnyInput =
    deferredLeftText.length > 0 || deferredRightText.length > 0

  const resultOptions: readonly ResultOption[] = [
    {
      key: "shared",
      label: `${messages.sharedLabel} (${comparison.sharedItems.length})`,
      count: comparison.sharedItems.length,
      output: formatItemsForExport(comparison.sharedItems),
      downloadName: "shared.txt",
    },
    {
      key: "left-only",
      label: `${messages.leftOnlyLabel} (${comparison.leftOnlyItems.length})`,
      count: comparison.leftOnlyItems.length,
      output: formatItemsForExport(comparison.leftOnlyItems),
      downloadName: "list-a-only.txt",
    },
    {
      key: "right-only",
      label: `${messages.rightOnlyLabel} (${comparison.rightOnlyItems.length})`,
      count: comparison.rightOnlyItems.length,
      output: formatItemsForExport(comparison.rightOnlyItems),
      downloadName: "list-b-only.txt",
    },
    {
      key: "all-unique",
      label: `${messages.allUniqueLabel} (${comparison.allUniqueItems.length})`,
      count: comparison.allUniqueItems.length,
      output: formatItemsForExport(comparison.allUniqueItems),
      downloadName: "all-unique.txt",
    },
    {
      key: "left-duplicates",
      label: `${messages.leftDuplicatesLabel} (${comparison.left.duplicateItems.length})`,
      count: comparison.left.duplicateItems.length,
      output: formatDuplicateItemsForExport(comparison.left.duplicateItems),
      downloadName: "list-a-duplicates.tsv",
    },
    {
      key: "right-duplicates",
      label: `${messages.rightDuplicatesLabel} (${comparison.right.duplicateItems.length})`,
      count: comparison.right.duplicateItems.length,
      output: formatDuplicateItemsForExport(comparison.right.duplicateItems),
      downloadName: "list-b-duplicates.tsv",
    },
  ]

  const activeOption =
    resultOptions.find((option) => option.key === activeResult) ??
    resultOptions[0]
  const activeCount = activeOption?.count ?? 0
  const activeOutput = activeOption?.output ?? ""
  const activeDownloadName = activeOption?.downloadName ?? "result.txt"

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedLeftText = window.localStorage.getItem(STORAGE_KEYS.leftText)
    const storedRightText = window.localStorage.getItem(STORAGE_KEYS.rightText)
    const storedOptions = window.localStorage.getItem(STORAGE_KEYS.options)
    const storedActiveResult = window.localStorage.getItem(
      STORAGE_KEYS.activeResult
    )

    if (storedLeftText !== null) {
      setLeftText(storedLeftText)
    }

    if (storedRightText !== null) {
      setRightText(storedRightText)
    }

    if (storedOptions !== null) {
      try {
        const parsed = JSON.parse(storedOptions) as Partial<ListComparerOptions>

        setOptions({
          ...DEFAULT_OPTIONS,
          ...parsed,
          delimiterMode: normalizeDelimiterMode(
            parsed.delimiterMode ?? DEFAULT_OPTIONS.delimiterMode
          ),
        })
      } catch {
        setOptions(DEFAULT_OPTIONS)
      }
    }

    if (storedActiveResult !== null) {
      setActiveResult(normalizeResultKey(storedActiveResult))
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.leftText, leftText)
  }, [leftText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.rightText, rightText)
  }, [rightText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.options, JSON.stringify(options))
  }, [options])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.activeResult, activeResult)
  }, [activeResult])

  useEffect(() => {
    const nextUrl =
      hasAnyInput && activeCount > 0
        ? URL.createObjectURL(
            new Blob([activeOutput], {
              type: activeDownloadName.endsWith(".tsv")
                ? "text/tab-separated-values;charset=utf-8"
                : "text/plain;charset=utf-8",
            })
          )
        : null

    setDownloadUrl(nextUrl)

    return () => {
      if (nextUrl) {
        URL.revokeObjectURL(nextUrl)
      }
    }
  }, [activeCount, activeDownloadName, activeOutput, hasAnyInput])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <CompareInputCard
          messages={messages}
          leftText={leftText}
          rightText={rightText}
          leftSummary={comparison.left}
          rightSummary={comparison.right}
          onLeftTextChange={setLeftText}
          onRightTextChange={setRightText}
          onSwap={() => {
            startTransition(() => {
              setLeftText(rightText)
              setRightText(leftText)
            })
          }}
          onLoadSample={() => {
            startTransition(() => {
              setLeftText(DEFAULT_LEFT_SAMPLE)
              setRightText(DEFAULT_RIGHT_SAMPLE)
            })
          }}
          onClear={() => {
            startTransition(() => {
              setLeftText("")
              setRightText("")
            })
          }}
        />

        <OptionsCard
          messages={messages}
          options={options}
          onOptionsChange={setOptions}
        />
      </div>

      <SummaryCard messages={messages} comparison={comparison} />

      <ResultCard
        messages={messages}
        hasAnyInput={hasAnyInput}
        activeResult={activeResult}
        resultOptions={resultOptions}
        downloadUrl={downloadUrl}
        onActiveResultChange={setActiveResult}
      />
    </div>
  )
}

export default ListComparerClient
