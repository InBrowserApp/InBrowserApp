import { useEffect, useMemo, useRef, useState } from "react"

import { createSwatches, sortSwatches } from "./core/color"
import { extractPalette } from "./core/extract-palette"
import {
  DEFAULT_PALETTE_OPTIONS,
  QUALITY_PRESETS,
  getSampleStride,
} from "./core/options"
import { isImageFile, loadImageData } from "./client/image-data"
import { OptionsCard } from "./client/options-card"
import { ResultsCard } from "./client/results-card"
import type { ImagePaletteExtractorMessages } from "./client/types"
import { UploadCard } from "./client/upload-card"
import { useObjectUrl } from "./client/object-url"

import type { PaletteOptions, PaletteSwatch } from "./core/types"

const STORAGE_KEY = "tools:image-palette-extractor:options"

type ImagePaletteExtractorClientProps = Readonly<{
  messages: ImagePaletteExtractorMessages
}>

function readStoredOptions(): PaletteOptions {
  if (typeof window === "undefined") return DEFAULT_PALETTE_OPTIONS

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "null"
    ) as Partial<PaletteOptions> | null

    if (!parsed) return DEFAULT_PALETTE_OPTIONS

    return {
      colorCount: clampColorCount(parsed.colorCount),
      quality: isQuality(parsed.quality)
        ? parsed.quality
        : DEFAULT_PALETTE_OPTIONS.quality,
      sortBy: isSort(parsed.sortBy)
        ? parsed.sortBy
        : DEFAULT_PALETTE_OPTIONS.sortBy,
      ignoreTransparent:
        typeof parsed.ignoreTransparent === "boolean"
          ? parsed.ignoreTransparent
          : DEFAULT_PALETTE_OPTIONS.ignoreTransparent,
    }
  } catch {
    return DEFAULT_PALETTE_OPTIONS
  }
}

function ImagePaletteExtractorClient({
  messages,
}: ImagePaletteExtractorClientProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const dragDepthRef = useRef(0)
  const runIdRef = useRef(0)
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)
  const [options, setOptions] = useState<PaletteOptions>(
    DEFAULT_PALETTE_OPTIONS
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dimensions, setDimensions] = useState<{
    width: number
    height: number
  } | null>(null)
  const [sourceSwatches, setSourceSwatches] = useState<PaletteSwatch[]>([])
  const [totalPixels, setTotalPixels] = useState(0)
  const [error, setError] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const previewUrl = useObjectUrl(selectedFile)
  const sortedSwatches = useMemo(
    () => sortSwatches(sourceSwatches, options.sortBy),
    [options.sortBy, sourceSwatches]
  )

  useEffect(() => {
    setOptions(readStoredOptions())
    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    if (!hasLoadedStorage) return

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(options))
  }, [hasLoadedStorage, options])

  useEffect(() => {
    if (!selectedFile) {
      runIdRef.current += 1
      setDimensions(null)
      setSourceSwatches([])
      setTotalPixels(0)
      setIsExtracting(false)
      return
    }

    const currentRun = (runIdRef.current += 1)
    setIsExtracting(true)
    setError("")
    setSourceSwatches([])
    setTotalPixels(0)

    async function extractFromFile() {
      try {
        const preset = QUALITY_PRESETS[options.quality]
        const loaded = await loadImageData(selectedFile!, preset.maxDimension)
        if (currentRun !== runIdRef.current) return

        const sampleStride = getSampleStride(
          loaded.sampleWidth,
          loaded.sampleHeight,
          preset.targetSamples
        )
        const result = extractPalette(loaded.imageData, {
          colorCount: options.colorCount,
          ignoreTransparent: options.ignoreTransparent,
          sampleStride,
        })
        if (currentRun !== runIdRef.current) return

        setDimensions({ width: loaded.width, height: loaded.height })
        setSourceSwatches(createSwatches(result.colors, result.totalPixels))
        setTotalPixels(result.totalPixels)

        if (result.colors.length === 0) {
          setError(messages.noPixelsError)
        }
      } catch {
        if (currentRun !== runIdRef.current) return

        setDimensions(null)
        setSourceSwatches([])
        setTotalPixels(0)
        setError(messages.loadFailedError)
      } finally {
        if (currentRun === runIdRef.current) {
          setIsExtracting(false)
        }
      }
    }

    void extractFromFile()
  }, [
    messages.loadFailedError,
    messages.noPixelsError,
    options.colorCount,
    options.ignoreTransparent,
    options.quality,
    selectedFile,
  ])

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  function selectFile(file: File | null) {
    dragDepthRef.current = 0
    setIsDraggingOver(false)

    if (!file) return

    if (!isImageFile(file)) {
      setSelectedFile(null)
      setDimensions(null)
      setSourceSwatches([])
      setTotalPixels(0)
      setError(messages.invalidFileTypeError)
      return
    }

    setError("")
    setSelectedFile(file)
  }

  function clearImage() {
    dragDepthRef.current = 0
    setIsDraggingOver(false)
    setSelectedFile(null)
    setError("")
  }

  function handleDragEnter(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    dragDepthRef.current += 1
    setIsDraggingOver(true)
  }

  function handleDragLeave(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
    if (dragDepthRef.current === 0) {
      setIsDraggingOver(false)
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setIsDraggingOver(true)
  }

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    dragDepthRef.current = 0
    setIsDraggingOver(false)
    selectFile(event.dataTransfer.files?.[0] ?? null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <UploadCard
          dimensions={dimensions}
          fileInputRef={fileInputRef}
          isDraggingOver={isDraggingOver}
          messages={messages}
          onClear={clearImage}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onFileChange={(event) => {
            selectFile(event.target.files?.[0] ?? null)
            event.target.value = ""
          }}
          onSelectImage={openFilePicker}
          previewUrl={previewUrl}
          selectedFile={selectedFile}
        />
        <OptionsCard
          disabled={isExtracting}
          messages={messages}
          onChange={setOptions}
          options={options}
        />
      </div>

      <ResultsCard
        error={error}
        fileName={selectedFile?.name ?? ""}
        isExtracting={isExtracting}
        messages={messages}
        swatches={sortedSwatches}
        totalPixels={totalPixels}
      />
    </div>
  )
}

function clampColorCount(value: unknown) {
  return typeof value === "number"
    ? Math.max(3, Math.min(12, Math.round(value)))
    : DEFAULT_PALETTE_OPTIONS.colorCount
}

function isQuality(value: unknown): value is PaletteOptions["quality"] {
  return value === "fast" || value === "balanced" || value === "precise"
}

function isSort(value: unknown): value is PaletteOptions["sortBy"] {
  return value === "dominance" || value === "hue" || value === "lightness"
}

export default ImagePaletteExtractorClient
