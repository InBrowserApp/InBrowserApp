import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useState,
} from "react"

import { DEFAULT_TEXT, SAMPLE_TEXT, STORAGE_KEYS } from "./client/constants"
import { fontNames, loadFont } from "./client/font-loader"
import { InputCard } from "./components/input-card"
import { OptionsCard } from "./components/options-card"
import { OutputCard } from "./components/output-card"
import {
  DEFAULT_OPTIONS,
  normalizeAsciiArtOptions,
  renderAsciiArt,
} from "./core/generate-ascii-art"

import type { AsciiArtGeneratorMessages } from "./types"

type AsciiArtGeneratorClientProps = Readonly<{
  messages: AsciiArtGeneratorMessages
}>

function AsciiArtGeneratorClient({ messages }: AsciiArtGeneratorClientProps) {
  const textInputId = useId()
  const fontSearchId = useId()
  const fontSelectId = useId()
  const alignSelectId = useId()
  const widthInputId = useId()

  const [text, setText] = useState(DEFAULT_TEXT)
  const [fontQuery, setFontQuery] = useState("")
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredText = useDeferredValue(text)
  const deferredOptions = useDeferredValue(options)

  const filteredFontNames = fontNames.filter((name) =>
    name.toLowerCase().includes(fontQuery.trim().toLowerCase())
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)
    const storedFont = window.localStorage.getItem(STORAGE_KEYS.font)
    const storedAlign = window.localStorage.getItem(STORAGE_KEYS.align)
    const storedWidth = window.localStorage.getItem(STORAGE_KEYS.width)

    if (storedText !== null) {
      setText(storedText)
    }

    setOptions(
      normalizeAsciiArtOptions({
        font:
          storedFont !== null && fontNames.includes(storedFont)
            ? storedFont
            : DEFAULT_OPTIONS.font,
        align: storedAlign ?? DEFAULT_OPTIONS.align,
        width: storedWidth ?? DEFAULT_OPTIONS.width,
      })
    )
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.text, text)
  }, [text])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.font, options.font)
    window.localStorage.setItem(STORAGE_KEYS.align, options.align)
    window.localStorage.setItem(STORAGE_KEYS.width, String(options.width))
  }, [options])

  useEffect(() => {
    let cancelled = false

    async function generate() {
      const normalizedOptions = normalizeAsciiArtOptions(deferredOptions)

      if (!deferredText.trim()) {
        setOutput("")
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        await loadFont(normalizedOptions.font)

        if (cancelled) {
          return
        }

        setOutput(renderAsciiArt(deferredText, normalizedOptions))
      } catch {
        if (!cancelled) {
          setOutput("")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void generate()

    return () => {
      cancelled = true
    }
  }, [deferredOptions, deferredText])

  useEffect(() => {
    const nextUrl = output
      ? URL.createObjectURL(
          new Blob([output], {
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
  }, [output])

  const downloadFilename = `${options.font.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-ascii-art.txt`

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <InputCard
          inputId={textInputId}
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
          alignSelectId={alignSelectId}
          fontQuery={fontQuery}
          fontSearchId={fontSearchId}
          fontSelectId={fontSelectId}
          fontNames={filteredFontNames}
          messages={messages}
          options={options}
          widthInputId={widthInputId}
          onAlignChange={(value) => {
            setOptions((current) =>
              normalizeAsciiArtOptions({
                ...current,
                align: value,
              })
            )
          }}
          onFontChange={(value) => {
            setOptions((current) =>
              normalizeAsciiArtOptions({
                ...current,
                font: value,
              })
            )
          }}
          onFontQueryChange={setFontQuery}
          onWidthChange={(value) => {
            setOptions((current) =>
              normalizeAsciiArtOptions({
                ...current,
                width: value,
              })
            )
          }}
        />
      </div>

      <OutputCard
        downloadFilename={downloadFilename}
        downloadUrl={downloadUrl}
        loading={loading}
        messages={messages}
        output={output}
      />
    </div>
  )
}

export default AsciiArtGeneratorClient
