import { startTransition, useDeferredValue, useEffect, useState } from "react"

import { DEFAULT_TEXT, SAMPLE_TEXT, STORAGE_KEYS } from "./constants"
import { InputCard } from "./components/input-card"
import { MetricsCard } from "./components/metrics-card"
import { OptionsCard } from "./components/options-card"
import { OutputCard } from "./components/output-card"
import {
  DEFAULT_OPTIONS,
  createMetrics,
  normalizeAsciiArtOptions,
  renderAsciiArt,
} from "./core/ascii-art"

import type { AsciiArtGeneratorClientProps, AsciiArtOutputState } from "./types"

function AsciiArtGeneratorClient({ messages }: AsciiArtGeneratorClientProps) {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [outputState, setOutputState] = useState<AsciiArtOutputState>({
    state: "empty",
    metrics: createMetrics("", DEFAULT_OPTIONS),
  })
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredText = useDeferredValue(text)
  const deferredOptions = useDeferredValue(options)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)
    const storedOptions = window.localStorage.getItem(STORAGE_KEYS.options)

    if (storedText !== null) {
      setText(storedText)
    }

    if (storedOptions !== null) {
      try {
        const parsed = JSON.parse(storedOptions)

        setOptions(normalizeAsciiArtOptions(parsed))
      } catch {
        setOptions(DEFAULT_OPTIONS)
      }
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.text, text)
  }, [text])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.options, JSON.stringify(options))
  }, [options])

  useEffect(() => {
    const normalizedOptions = normalizeAsciiArtOptions(deferredOptions)

    if (!deferredText.trim()) {
      setOutputState({
        state: "empty",
        metrics: createMetrics("", normalizedOptions),
      })
      return
    }

    let cancelled = false

    setOutputState({
      state: "rendering",
      metrics: createMetrics("", normalizedOptions),
    })

    Promise.resolve().then(() => {
      if (cancelled) {
        return
      }

      try {
        const result = renderAsciiArt(deferredText, normalizedOptions)

        if (!cancelled) {
          setOutputState({
            state: "ready",
            output: result.output,
            metrics: result.metrics,
          })
        }
      } catch (error) {
        if (!cancelled) {
          setOutputState({
            state: "error",
            message:
              error instanceof Error
                ? error.message
                : messages.renderErrorTitle,
            metrics: createMetrics("", normalizedOptions),
          })
        }
      }
    })

    return () => {
      cancelled = true
    }
  }, [deferredOptions, deferredText, messages.renderErrorTitle])

  useEffect(() => {
    const nextUrl =
      outputState.state === "ready" && outputState.output
        ? URL.createObjectURL(
            new Blob([outputState.output], {
              type: "text/plain;charset=utf-8",
            })
          )
        : null

    setDownloadUrl(nextUrl)

    return () => {
      if (nextUrl) {
        URL.revokeObjectURL(nextUrl)
      }
    }
  }, [outputState])

  const downloadFilename = `${options.font.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-ascii-art.txt`

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <InputCard
          messages={messages}
          text={text}
          onTextChange={setText}
          onLoadSample={() => {
            startTransition(() => {
              setText(SAMPLE_TEXT)
            })
          }}
          onClear={() => {
            startTransition(() => {
              setText("")
            })
          }}
        />

        <OptionsCard
          messages={messages}
          options={options}
          onOptionsChange={setOptions}
        />
      </div>

      <MetricsCard messages={messages} metrics={outputState.metrics} />

      <OutputCard
        messages={messages}
        outputState={outputState}
        downloadFilename={downloadFilename}
        downloadUrl={downloadUrl}
      />
    </div>
  )
}

export default AsciiArtGeneratorClient
