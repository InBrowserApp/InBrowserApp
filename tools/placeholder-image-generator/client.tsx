import { useDeferredValue, useEffect, useMemo, useState } from "react"

import {
  DEFAULT_PLACEHOLDER_OPTIONS,
  PLACEHOLDER_PRESETS,
  buildPlaceholderFilename,
  buildPlaceholderPreviewDataUri,
  buildPlaceholderSvgMarkup,
  createPlaceholderRasterBlob,
  normalizePlaceholderOptions,
  normalizePlaceholderScale,
  resolvePlaceholderText,
} from "./core/placeholder-image"
import { OptionsCard } from "./client/options-card"
import { PreviewCard } from "./client/preview-card"

import type {
  PlaceholderBackgroundChoice,
  PlaceholderImageGeneratorMessages,
} from "./client/types"
import type {
  PlaceholderOptions,
  PlaceholderScale,
} from "./core/placeholder-image"

type PlaceholderClientProps = Readonly<{
  messages: PlaceholderImageGeneratorMessages
}>

type RasterDownloads = Readonly<{
  jpeg: Blob | null
  png: Blob | null
  webp: Blob | null
}>

const EMPTY_DOWNLOADS: RasterDownloads = {
  jpeg: null,
  png: null,
  webp: null,
}

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

function PlaceholderImageGeneratorClient({ messages }: PlaceholderClientProps) {
  const [options, setOptions] = useState(DEFAULT_PLACEHOLDER_OPTIONS)
  const [scale, setScale] = useState<PlaceholderScale>(1)
  const [quality, setQuality] = useState(90)
  const [downloads, setDownloads] = useState(EMPTY_DOWNLOADS)
  const [error, setError] = useState("")
  const deferredOptions = useDeferredValue(options)
  const normalizedOptions = useMemo(
    () => normalizePlaceholderOptions(deferredOptions),
    [deferredOptions]
  )
  const normalizedScale = useMemo(
    () => normalizePlaceholderScale(scale),
    [scale]
  )
  const previewUrl = useMemo(
    () => buildPlaceholderPreviewDataUri(normalizedOptions),
    [normalizedOptions]
  )
  const svgBlob = useMemo(
    () =>
      new Blob(
        [buildPlaceholderSvgMarkup(normalizedOptions, normalizedScale)],
        {
          type: "image/svg+xml",
        }
      ),
    [normalizedOptions, normalizedScale]
  )
  const activePreset = useMemo(
    () =>
      PLACEHOLDER_PRESETS.find(
        (preset) =>
          preset.width === normalizedOptions.width &&
          preset.height === normalizedOptions.height
      ) ?? null,
    [normalizedOptions.height, normalizedOptions.width]
  )
  const resolvedText = useMemo(
    () => resolvePlaceholderText(normalizedOptions),
    [normalizedOptions]
  )
  const currentSizeLabel = `${messages.currentSizeLabel}: ${normalizedOptions.width} × ${normalizedOptions.height}`
  const activePresetLabel =
    activePreset?.label ??
    `${normalizedOptions.width} × ${normalizedOptions.height}`
  const jpegUrl = useObjectUrl(downloads.jpeg)
  const pngUrl = useObjectUrl(downloads.png)
  const svgUrl = useObjectUrl(svgBlob)
  const webpUrl = useObjectUrl(downloads.webp)
  const backgroundChoices: readonly PlaceholderBackgroundChoice[] = [
    { label: messages.solidBackgroundLabel, value: "solid" },
    { label: messages.linearGradientLabel, value: "linear-gradient" },
    { label: messages.radialGradientLabel, value: "radial-gradient" },
  ]
  const downloadItems = [
    {
      download: buildPlaceholderFilename(
        normalizedOptions,
        "png",
        normalizedScale
      ),
      href: pngUrl,
      label: "PNG",
    },
    {
      download: buildPlaceholderFilename(
        normalizedOptions,
        "jpeg",
        normalizedScale
      ),
      href: jpegUrl,
      label: "JPEG",
    },
    {
      download: buildPlaceholderFilename(
        normalizedOptions,
        "webp",
        normalizedScale
      ),
      href: webpUrl,
      label: "WebP",
    },
    {
      download: buildPlaceholderFilename(
        normalizedOptions,
        "svg",
        normalizedScale
      ),
      href: svgUrl,
      label: "SVG",
    },
  ] as const

  useEffect(() => {
    let cancelled = false

    setError("")

    void (async () => {
      try {
        const nextQuality = quality / 100
        const [png, jpeg, webp] = await Promise.all([
          createPlaceholderRasterBlob(
            normalizedOptions,
            "png",
            normalizedScale,
            nextQuality
          ),
          createPlaceholderRasterBlob(
            normalizedOptions,
            "jpeg",
            normalizedScale,
            nextQuality
          ),
          createPlaceholderRasterBlob(
            normalizedOptions,
            "webp",
            normalizedScale,
            nextQuality
          ),
        ])

        if (cancelled) {
          return
        }

        setDownloads({ jpeg, png, webp })
      } catch {
        if (cancelled) {
          return
        }

        setDownloads(EMPTY_DOWNLOADS)
        setError(messages.exportError)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [messages.exportError, normalizedOptions, normalizedScale, quality])

  function updateOption<Key extends keyof PlaceholderOptions>(
    key: Key,
    value: PlaceholderOptions[Key]
  ) {
    setOptions((currentOptions) => ({
      ...currentOptions,
      [key]: value,
    }))
  }

  return (
    <div className="grid gap-6">
      <PreviewCard
        currentSizeLabel={currentSizeLabel}
        messages={messages}
        previewUrl={previewUrl}
        resolvedText={resolvedText}
      />
      <OptionsCard
        activePresetLabel={activePresetLabel}
        backgroundChoices={backgroundChoices}
        downloads={downloadItems}
        error={error}
        handlers={{
          onOptionChange: updateOption,
          onPresetSelect: (width, height) => {
            setOptions((currentOptions) => ({
              ...currentOptions,
              height,
              width,
            }))
          },
          onQualityChange: setQuality,
          onScaleChange: setScale,
        }}
        messages={messages}
        options={normalizedOptions}
        quality={quality}
        scale={normalizedScale}
      />
    </div>
  )
}

export default PlaceholderImageGeneratorClient
