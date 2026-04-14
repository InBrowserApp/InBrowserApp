import { useDeferredValue, useEffect, useMemo, useState } from "react"

import {
  DEFAULT_BARCODE_GENERATOR_OPTIONS,
  normalizeBarcodeGeneratorOptions,
  parseStoredBarcodeGeneratorOptions,
} from "./core/barcode-options"
import { STORAGE_KEY } from "./client/constants"
import { OptionsCard } from "./client/options-card"
import { PreviewCard } from "./client/preview-card"
import { renderBarcodePngBlob, renderBarcodeSvgMarkup } from "./client/render"

import type {
  BarcodeFormat,
  BarcodeGeneratorOptions,
  BarcodeTextAlign,
  BarcodeTextPosition,
} from "./core/barcode-options"
import type { BarcodeGeneratorMessages } from "./client/types"

type BarcodeGeneratorClientProps = Readonly<{
  messages: BarcodeGeneratorMessages
}>

function useObjectUrl(blob: Blob | null) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blob) {
      setUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [blob])

  return url
}

function BarcodeGeneratorClient({ messages }: BarcodeGeneratorClientProps) {
  const [options, setOptions] = useState(DEFAULT_BARCODE_GENERATOR_OPTIONS)
  const [pngBlob, setPngBlob] = useState<Blob | null>(null)
  const [svgMarkup, setSvgMarkup] = useState("")
  const [error, setError] = useState("")
  const [isRendering, setIsRendering] = useState(false)
  const deferredOptions = useDeferredValue(options)

  useEffect(() => {
    const storedOptions = parseStoredBarcodeGeneratorOptions(
      window.localStorage.getItem(STORAGE_KEY)
    )

    if (storedOptions) {
      setOptions(storedOptions)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(options))
  }, [options])

  useEffect(() => {
    let cancelled = false

    setIsRendering(true)
    setError("")

    void (async () => {
      try {
        const nextSvgMarkup = renderBarcodeSvgMarkup(deferredOptions)
        const nextPngBlob = await renderBarcodePngBlob(deferredOptions)

        if (cancelled) {
          return
        }

        setSvgMarkup(nextSvgMarkup)
        setPngBlob(nextPngBlob)
      } catch (renderError) {
        if (cancelled) {
          return
        }

        setSvgMarkup("")
        setPngBlob(null)
        setError(
          renderError instanceof Error
            ? renderError.message
            : "Failed to render barcode."
        )
      } finally {
        if (!cancelled) {
          setIsRendering(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [deferredOptions])

  const svgBlob = useMemo(
    () =>
      svgMarkup
        ? new Blob([svgMarkup], {
            type: "image/svg+xml",
          })
        : null,
    [svgMarkup]
  )
  const pngUrl = useObjectUrl(pngBlob)
  const svgUrl = useObjectUrl(svgBlob)
  const previewUrl = useMemo(
    () =>
      svgMarkup
        ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`
        : null,
    [svgMarkup]
  )

  function updateOptions(nextOptions: Partial<BarcodeGeneratorOptions>) {
    setOptions((currentOptions) =>
      normalizeBarcodeGeneratorOptions({
        ...currentOptions,
        ...nextOptions,
      })
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PreviewCard
        error={error}
        isRendering={isRendering}
        messages={messages}
        pngUrl={pngUrl}
        previewUrl={previewUrl}
        svgUrl={svgUrl}
      />
      <OptionsCard
        handlers={{
          onBooleanChange: (key, value) => {
            updateOptions({ [key]: value })
          },
          onColorChange: (key, value) => {
            updateOptions({ [key]: value })
          },
          onFormatChange: (value: BarcodeFormat) => {
            updateOptions({ format: value })
          },
          onNumberChange: (key, value) => {
            updateOptions({ [key]: value })
          },
          onTextAlignChange: (value: BarcodeTextAlign) => {
            updateOptions({ textAlign: value })
          },
          onTextChange: (value: string) => {
            updateOptions({ text: value })
          },
          onTextPositionChange: (value: BarcodeTextPosition) => {
            updateOptions({ textPosition: value })
          },
        }}
        messages={messages}
        options={options}
      />
    </div>
  )
}

export default BarcodeGeneratorClient
