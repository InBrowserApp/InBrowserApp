import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useState,
} from "react"

import {
  DEFAULT_FLAGS,
  DEFAULT_PATTERN,
  DEFAULT_REPLACEMENT,
  DEFAULT_RESULT_VIEW,
  DEFAULT_SOURCE_TEXT,
  MATCH_LIMIT,
  PREVIEW_LIMIT,
  STORAGE_KEYS,
} from "./constants"
import { PatternCard } from "./components/pattern-card"
import { ResultsCard } from "./components/results-card"
import { SourceInputCard } from "./components/source-input-card"
import { SummaryCard } from "./components/summary-card"
import {
  REGEX_FLAGS,
  analyzeRegex,
  compileRegex,
  formatMatchesForExport,
  type RegexFlag,
  type RegexMatch,
  type RegexResultView,
} from "./core/regex-tester-replacer"

import type {
  RegexExportState,
  RegexFlagOption,
  RegexTesterReplacerMessages,
  RegexViewOption,
} from "./types"

type RegexTesterReplacerClientProps = Readonly<{
  messages: RegexTesterReplacerMessages
}>

function RegexTesterReplacerClient({
  messages,
}: RegexTesterReplacerClientProps) {
  const sourceTextId = useId()
  const patternId = useId()
  const replacementId = useId()

  const [sourceText, setSourceText] = useState(DEFAULT_SOURCE_TEXT)
  const [pattern, setPattern] = useState(DEFAULT_PATTERN)
  const [replacement, setReplacement] = useState(DEFAULT_REPLACEMENT)
  const [selectedFlags, setSelectedFlags] =
    useState<readonly RegexFlag[]>(DEFAULT_FLAGS)
  const [activeView, setActiveView] =
    useState<RegexResultView>(DEFAULT_RESULT_VIEW)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredSourceText = useDeferredValue(sourceText)
  const deferredPattern = useDeferredValue(pattern)
  const deferredReplacement = useDeferredValue(replacement)
  const deferredFlags = useDeferredValue(selectedFlags)

  const livePatternState = compileRegex(pattern, selectedFlags)
  const patternError = livePatternState.error
  const hasPattern = pattern.trim().length > 0
  const hasSourceText = sourceText.length > 0
  const analysis = analyzeRegex(
    deferredSourceText,
    deferredPattern,
    deferredFlags,
    deferredReplacement,
    {
      matchLimit: MATCH_LIMIT,
      previewLimit: PREVIEW_LIMIT,
    }
  )

  const flagOptions: readonly RegexFlagOption[] = [
    { key: "g", label: messages.globalFlagLabel },
    { key: "i", label: messages.ignoreCaseFlagLabel },
    { key: "m", label: messages.multilineFlagLabel },
    { key: "s", label: messages.dotAllFlagLabel },
    { key: "u", label: messages.unicodeFlagLabel },
    { key: "y", label: messages.stickyFlagLabel },
  ]
  const viewOptions: readonly RegexViewOption[] = [
    { key: "preview", label: messages.previewTabLabel },
    { key: "matches", label: messages.matchesTabLabel },
    { key: "replace", label: messages.replaceTabLabel },
  ]
  const exportState = getExportState(
    activeView,
    analysis.replacementOutput,
    analysis.matches,
    patternError
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedSourceText = window.localStorage.getItem(
      STORAGE_KEYS.sourceText
    )
    const storedPattern = window.localStorage.getItem(STORAGE_KEYS.pattern)
    const storedReplacement = window.localStorage.getItem(
      STORAGE_KEYS.replacement
    )
    const storedFlags = window.localStorage.getItem(STORAGE_KEYS.flags)
    const storedActiveView = window.localStorage.getItem(
      STORAGE_KEYS.activeResultView
    )

    if (storedSourceText !== null) {
      setSourceText(storedSourceText)
    }

    if (storedPattern !== null) {
      setPattern(storedPattern)
    }

    if (storedReplacement !== null) {
      setReplacement(storedReplacement)
    }

    if (storedFlags !== null) {
      try {
        const parsed = JSON.parse(storedFlags)

        if (Array.isArray(parsed)) {
          setSelectedFlags(REGEX_FLAGS.filter((flag) => parsed.includes(flag)))
        }
      } catch {
        setSelectedFlags(DEFAULT_FLAGS)
      }
    }

    if (
      storedActiveView === "preview" ||
      storedActiveView === "matches" ||
      storedActiveView === "replace"
    ) {
      setActiveView(storedActiveView)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.sourceText, sourceText)
  }, [sourceText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.pattern, pattern)
  }, [pattern])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.replacement, replacement)
  }, [replacement])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(
      STORAGE_KEYS.flags,
      JSON.stringify(selectedFlags)
    )
  }, [selectedFlags])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.activeResultView, activeView)
  }, [activeView])

  useEffect(() => {
    const nextUrl = exportState.value
      ? URL.createObjectURL(
          new Blob([exportState.value], {
            type: exportState.downloadName.endsWith(".tsv")
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
  }, [exportState.downloadName, exportState.value])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <SourceInputCard
          messages={messages}
          sourceText={sourceText}
          sourceTextId={sourceTextId}
          onSourceTextChange={setSourceText}
          onLoadSample={() => {
            startTransition(() => {
              setSourceText(DEFAULT_SOURCE_TEXT)
              setPattern(DEFAULT_PATTERN)
              setReplacement(DEFAULT_REPLACEMENT)
              setSelectedFlags(DEFAULT_FLAGS)
            })
          }}
          onClear={() => {
            startTransition(() => {
              setSourceText("")
            })
          }}
        />

        <PatternCard
          flagOptions={flagOptions}
          messages={messages}
          pattern={pattern}
          patternError={patternError}
          patternId={patternId}
          replacement={replacement}
          replacementId={replacementId}
          selectedFlags={selectedFlags}
          onPatternChange={setPattern}
          onReplacementChange={setReplacement}
          onToggleFlag={(flag, checked) => {
            setSelectedFlags((current) =>
              checked
                ? REGEX_FLAGS.filter(
                    (item) => item === flag || current.includes(item)
                  )
                : current.filter((item) => item !== flag)
            )
          }}
        />
      </div>

      <SummaryCard
        hasPattern={hasPattern}
        hasSourceText={hasSourceText}
        messages={messages}
        patternError={patternError}
        summary={analysis.summary}
      />

      <ResultsCard
        activeView={activeView}
        exportState={{ ...exportState, downloadUrl }}
        hasPattern={hasPattern}
        hasSourceText={hasSourceText}
        matchLimit={MATCH_LIMIT}
        messages={messages}
        patternError={patternError}
        previewLimit={PREVIEW_LIMIT}
        result={analysis}
        viewOptions={viewOptions}
        onActiveViewChange={setActiveView}
      />
    </div>
  )
}

function getExportState(
  activeView: RegexResultView,
  replacementOutput: string,
  matches: readonly RegexMatch[],
  patternError: string | null
): Omit<RegexExportState, "downloadUrl"> {
  if (patternError) {
    return {
      downloadName: "result.txt",
      value: "",
    }
  }

  if (activeView === "matches") {
    return {
      downloadName: "regex-matches.tsv",
      value: formatMatchesForExport(matches),
    }
  }

  if (activeView === "replace") {
    return {
      downloadName: "replaced-text.txt",
      value: replacementOutput,
    }
  }

  return {
    downloadName: "result.txt",
    value: "",
  }
}

export default RegexTesterReplacerClient
