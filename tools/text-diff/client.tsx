"use client"

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  DEFAULT_MODIFIED_TEXT,
  DEFAULT_ORIGINAL_TEXT,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
} from "./constants"
import { DiffInputCard } from "./components/diff-input-card"
import { DiffOptionsCard } from "./components/diff-options-card"
import { DiffResultCard } from "./components/diff-result-card"
import { DiffSummaryCard } from "./components/diff-summary-card"
import { compareText } from "./core/text-diff"

import type { TextDiffSettings, TextDiffMessages } from "./types"

type TextDiffClientProps = Readonly<{
  messages: TextDiffMessages
}>

function parseStoredSettings(value: string | null) {
  if (!value) {
    return DEFAULT_SETTINGS
  }

  try {
    const parsed = JSON.parse(value) as Partial<TextDiffSettings>

    return {
      compareOptions: {
        ignoreCase:
          parsed.compareOptions?.ignoreCase ??
          DEFAULT_SETTINGS.compareOptions.ignoreCase,
        ignoreWhitespace:
          parsed.compareOptions?.ignoreWhitespace ??
          DEFAULT_SETTINGS.compareOptions.ignoreWhitespace,
      },
      viewMode:
        parsed.viewMode === "unified" ? "unified" : DEFAULT_SETTINGS.viewMode,
      hideUnchanged: parsed.hideUnchanged ?? DEFAULT_SETTINGS.hideUnchanged,
    } satisfies TextDiffSettings
  } catch {
    return DEFAULT_SETTINGS
  }
}

function getStoredText(storageKey: string) {
  if (typeof window === "undefined") {
    return ""
  }

  return window.localStorage.getItem(storageKey) ?? ""
}

function getInitialSettings() {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS
  }

  return parseStoredSettings(window.localStorage.getItem(STORAGE_KEYS.settings))
}

function TextDiffClient({ messages }: TextDiffClientProps) {
  const [originalText, setOriginalText] = useState(() =>
    getStoredText(STORAGE_KEYS.originalText)
  )
  const [modifiedText, setModifiedText] = useState(() =>
    getStoredText(STORAGE_KEYS.modifiedText)
  )
  const [settings, setSettings] = useState<TextDiffSettings>(getInitialSettings)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredOriginalText = useDeferredValue(originalText)
  const deferredModifiedText = useDeferredValue(modifiedText)
  const comparison = useMemo(
    () =>
      compareText(
        deferredOriginalText,
        deferredModifiedText,
        settings.compareOptions
      ),
    [deferredModifiedText, deferredOriginalText, settings.compareOptions]
  )
  const hasAnyInput = originalText.length > 0 || modifiedText.length > 0
  const visibleRows = useMemo(
    () =>
      settings.hideUnchanged
        ? comparison.rows.filter((row) => row.kind !== "equal")
        : comparison.rows,
    [comparison.rows, settings.hideUnchanged]
  )

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.originalText, originalText)
  }, [originalText])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.modifiedText, modifiedText)
  }, [modifiedText])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (!hasAnyInput) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([comparison.unifiedText], {
        type: "text/plain;charset=utf-8",
      })
    )

    setDownloadUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [comparison.unifiedText, hasAnyInput])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <DiffInputCard
          messages={messages}
          originalText={originalText}
          modifiedText={modifiedText}
          onOriginalTextChange={setOriginalText}
          onModifiedTextChange={setModifiedText}
          onSwap={() => {
            startTransition(() => {
              setOriginalText(modifiedText)
              setModifiedText(originalText)
            })
          }}
          onLoadSample={() => {
            startTransition(() => {
              setOriginalText(DEFAULT_ORIGINAL_TEXT)
              setModifiedText(DEFAULT_MODIFIED_TEXT)
            })
          }}
          onClear={() => {
            startTransition(() => {
              setOriginalText("")
              setModifiedText("")
            })
          }}
        />

        <DiffOptionsCard
          messages={messages}
          compareOptions={settings.compareOptions}
          viewMode={settings.viewMode}
          hideUnchanged={settings.hideUnchanged}
          onCompareOptionsChange={(nextOptions) => {
            setSettings((currentSettings) => ({
              ...currentSettings,
              compareOptions:
                typeof nextOptions === "function"
                  ? nextOptions(currentSettings.compareOptions)
                  : nextOptions,
            }))
          }}
          onViewModeChange={(viewMode) => {
            setSettings((currentSettings) => ({
              ...currentSettings,
              viewMode,
            }))
          }}
          onHideUnchangedChange={(hideUnchanged) => {
            setSettings((currentSettings) => ({
              ...currentSettings,
              hideUnchanged,
            }))
          }}
        />
      </div>

      <DiffSummaryCard messages={messages} stats={comparison.stats} />

      <DiffResultCard
        messages={messages}
        rows={visibleRows}
        hasAnyInput={hasAnyInput}
        viewMode={settings.viewMode}
        unifiedText={comparison.unifiedText}
        downloadUrl={downloadUrl}
      />
    </div>
  )
}

export default TextDiffClient
