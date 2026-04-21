import { useEffect, useMemo, useRef, useState } from "react"
import type { MouseEvent } from "react"

import {
  formatAlphaPercent,
  formatCmyk,
  formatHsl,
  formatHsv,
  formatRgb,
  parseHexToRgba,
  rgbaToHex,
  toCssRgba,
} from "./core/color"
import { DEFAULT_COLOR, STORAGE_KEYS } from "./client/constants"
import { ImageCard } from "./client/image-card"
import { ResultsCard } from "./client/results-card"
import { ScreenCard } from "./client/screen-card"

import type { RGBA } from "./core/color"
import type { ColorPickerMessages } from "./client/types"

type EyeDropperResult = { sRGBHex: string }

type EyeDropperInstance = {
  open: () => Promise<EyeDropperResult>
}

type EyeDropperConstructor = new () => EyeDropperInstance

type ColorPickerClientProps = Readonly<{
  messages: ColorPickerMessages
}>

function readStoredColor(): RGBA {
  /* v8 ignore next */
  if (typeof window === "undefined") return DEFAULT_COLOR
  const stored = window.localStorage.getItem(STORAGE_KEYS.rgba)
  if (!stored) return DEFAULT_COLOR

  try {
    const parsed = JSON.parse(stored) as Partial<RGBA>
    if (
      typeof parsed.r === "number" &&
      typeof parsed.g === "number" &&
      typeof parsed.b === "number" &&
      typeof parsed.a === "number"
    ) {
      return parsed as RGBA
    }
  } catch {}

  return DEFAULT_COLOR
}

function readStoredAlphaFlag() {
  /* v8 ignore next */
  if (typeof window === "undefined") return true
  const stored = window.localStorage.getItem(STORAGE_KEYS.showAlpha)
  return stored === null ? true : stored === "true"
}

function isImageFile(file: File | null) {
  if (!file) return false
  if (file.type.startsWith("image/")) return true

  const name = file.name.toLowerCase()
  return [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
    ".tif",
    ".tiff",
    ".avif",
    ".heic",
    ".heif",
  ].some((extension) => name.endsWith(extension))
}

function ColorPickerClient({ messages }: ColorPickerClientProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dragDepthRef = useRef(0)
  const [rgba, setRgba] = useState<RGBA>(DEFAULT_COLOR)
  const [showAlpha, setShowAlpha] = useState(true)
  const [pickedSource, setPickedSource] = useState<"screen" | "image" | null>(
    null
  )
  const [hasImage, setHasImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)

  useEffect(() => {
    setRgba(readStoredColor())
    setShowAlpha(readStoredAlphaFlag())
    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (!hasLoadedStorage || typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.rgba, JSON.stringify(rgba))
  }, [hasLoadedStorage, rgba])

  useEffect(() => {
    /* v8 ignore next */
    if (!hasLoadedStorage || typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.showAlpha, String(showAlpha))
  }, [hasLoadedStorage, showAlpha])

  const eyeDropperConstructor = useMemo(
    () =>
      (globalThis as typeof globalThis & { EyeDropper?: EyeDropperConstructor })
        .EyeDropper,
    []
  )

  const values = useMemo(
    () => ({
      cssColor: toCssRgba(rgba),
      hex: rgbaToHex(rgba, showAlpha),
      rgb: formatRgb(rgba, showAlpha),
      hsl: formatHsl(rgba, showAlpha),
      hsv: formatHsv(rgba, showAlpha),
      cmyk: formatCmyk(rgba),
      alpha: formatAlphaPercent(rgba.a),
    }),
    [rgba, showAlpha]
  )

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  function clearImage() {
    dragDepthRef.current = 0
    setHasImage(false)
    setImageError(null)
    setIsDraggingOver(false)

    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      canvas.width = 0
      canvas.height = 0
    }
  }

  function loadImage(file: File) {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")

    if (!canvas || !context) {
      setImageError(messages.imageError)
      setHasImage(false)
      return
    }

    setImageError(null)
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0)
      setHasImage(true)
      URL.revokeObjectURL(objectUrl)
    }

    image.onerror = () => {
      setImageError(messages.imageError)
      setHasImage(false)
      URL.revokeObjectURL(objectUrl)
    }

    image.src = objectUrl
  }

  function handleFile(file: File | null) {
    if (!file || !isImageFile(file)) {
      setImageError(messages.imageError)
      setHasImage(false)
      return
    }

    loadImage(file)
  }

  async function handleScreenPick() {
    if (!eyeDropperConstructor) return

    try {
      const eyeDropper = new eyeDropperConstructor()
      const result = await eyeDropper.open()
      const parsed = parseHexToRgba(result.sRGBHex)
      if (!parsed) return

      setRgba(parsed)
      setPickedSource("screen")
    } catch (error) {
      if ((error as DOMException).name === "AbortError") return
    }
  }

  function handleCanvasClick(event: MouseEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget
    const context = canvas.getContext("2d")
    if (!context || !hasImage) return

    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = Math.max(
      0,
      Math.min(
        Math.floor((event.clientX - rect.left) * scaleX),
        canvas.width - 1
      )
    )
    const y = Math.max(
      0,
      Math.min(
        Math.floor((event.clientY - rect.top) * scaleY),
        canvas.height - 1
      )
    )
    const data = context.getImageData(x, y, 1, 1).data

    setRgba({
      r: data[0] ?? 0,
      g: data[1] ?? 0,
      b: data[2] ?? 0,
      a: (data[3] ?? 255) / 255,
    })
    setPickedSource("image")
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <div className="grid gap-6">
        <ScreenCard
          isSupported={Boolean(eyeDropperConstructor)}
          messages={messages}
          onPick={() => {
            void handleScreenPick()
          }}
        />
        <ImageCard
          canvasRef={canvasRef}
          fileInputRef={fileInputRef}
          hasImage={hasImage}
          imageError={imageError}
          isDraggingOver={isDraggingOver}
          messages={messages}
          onCanvasClick={handleCanvasClick}
          onClearImage={clearImage}
          onDragEnter={(event) => {
            event.preventDefault()
            dragDepthRef.current += 1
            setIsDraggingOver(true)
          }}
          onDragLeave={(event) => {
            event.preventDefault()
            dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
            if (dragDepthRef.current === 0) {
              setIsDraggingOver(false)
            }
          }}
          onDragOver={(event) => {
            event.preventDefault()
            event.dataTransfer.dropEffect = "copy"
            setIsDraggingOver(true)
          }}
          onDrop={(event) => {
            event.preventDefault()
            dragDepthRef.current = 0
            setIsDraggingOver(false)
            handleFile(event.dataTransfer.files?.[0] ?? null)
          }}
          onFileChange={(event) => {
            handleFile(event.target.files?.[0] ?? null)
            event.target.value = ""
          }}
          onSelectImage={openFilePicker}
        />
      </div>

      <ResultsCard
        alphaValue={values.alpha}
        cmykValue={values.cmyk}
        cssColor={values.cssColor}
        hexValue={values.hex}
        hslValue={values.hsl}
        hsvValue={values.hsv}
        messages={messages}
        onShowAlphaChange={setShowAlpha}
        pickedSource={pickedSource}
        rgbValue={values.rgb}
        showAlpha={showAlpha}
      />
    </div>
  )
}

export default ColorPickerClient
