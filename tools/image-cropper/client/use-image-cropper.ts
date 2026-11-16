import { useEffect, useRef, useState } from "react"
import {
  centeredCrop,
  INITIAL_TRANSFORM,
  transformedDimensions,
  type Crop,
  type Transform,
} from "../core/crop"
import { exportImage, loadImage } from "./image"
import type { CropResult, ImageSource, Messages, OutputFormat } from "./types"

type CropError = { target: "source" | "export"; message: string }

export function useImageCropper(m: Messages) {
  const [file, setFile] = useState<File | null>(null)
  const [source, setSource] = useState<ImageSource | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  })
  const [transform, setTransform] = useState(INITIAL_TRANSFORM)
  const [ratio, setRatio] = useState("free")
  const [format, setFormat] = useState<OutputFormat>("image/png")
  const [quality, setQuality] = useState(92)
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<CropError | null>(null)
  const [result, setResult] = useState<CropResult | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const revision = useRef(0)

  useEffect(() => {
    if (!file) return
    let cancelled = false
    let loaded: ImageSource | undefined
    setLoading(true)
    void loadImage(file)
      .then((image) => {
        loaded = image
        if (cancelled) return image.dispose()
        setSource(image)
        setCrop(centeredCrop(image))
      })
      .catch(() => {
        if (!cancelled) setError({ target: "source", message: m.invalidImage })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
      loaded?.dispose()
    }
  }, [file, m.invalidImage])

  useEffect(() => {
    if (!result) {
      setResultUrl(null)
      return
    }
    const url = URL.createObjectURL(result.blob)
    setResultUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [result])
  useEffect(
    () => () => {
      revision.current++
    },
    []
  )

  const size = source ? transformedDimensions(source, transform.rotation) : null
  const aspect =
    ratio === "free"
      ? undefined
      : ratio === "original" && size
        ? size.width / size.height
        : Number(ratio)

  function invalidate() {
    revision.current++
    setResult(null)
    setError(null)
    setProcessing(false)
  }
  function changeFile(next: File | null) {
    invalidate()
    setFile(next)
    setSource(null)
    setLoading(false)
    setTransform(INITIAL_TRANSFORM)
    setRatio("free")
  }
  function changeCrop(next: Crop) {
    invalidate()
    setCrop(next)
  }
  function changeRatio(next: string) {
    invalidate()
    setRatio(next)
    if (size)
      setCrop(
        centeredCrop(
          size,
          next === "free" || next === "original" ? undefined : Number(next)
        )
      )
  }
  function changeTransform(next: Transform) {
    invalidate()
    setTransform(next)
    if (source && next.rotation !== transform.rotation) {
      const dimensions = transformedDimensions(source, next.rotation)
      setCrop(
        centeredCrop(
          dimensions,
          ratio === "free" || ratio === "original" ? undefined : Number(ratio)
        )
      )
    }
  }
  function reset() {
    invalidate()
    setTransform(INITIAL_TRANSFORM)
    setRatio("free")
    if (source) setCrop(centeredCrop(source))
  }
  async function runExport() {
    if (!source || !file) return
    const currentRevision = ++revision.current
    setProcessing(true)
    setError(null)
    setResult(null)
    try {
      const output = await exportImage(
        source,
        file.name,
        crop,
        transform,
        format,
        quality
      )
      if (revision.current === currentRevision) setResult(output)
    } catch {
      if (revision.current === currentRevision)
        setError({ target: "export", message: m.exportError })
    } finally {
      if (revision.current === currentRevision) setProcessing(false)
    }
  }
  return {
    file,
    source,
    crop,
    transform,
    ratio,
    aspect,
    size,
    format,
    quality,
    loading,
    processing,
    error: error?.message ?? null,
    errorTarget: error?.target,
    result,
    resultUrl,
    changeFile,
    changeCrop,
    changeRatio,
    changeTransform,
    reset,
    runExport,
    changeFormat: (next: OutputFormat) => {
      invalidate()
      setFormat(next)
    },
    changeQuality: (next: number) => {
      invalidate()
      setQuality(next)
    },
    previewError: () => {
      invalidate()
      setError({ target: "source", message: m.previewError })
    },
  }
}

export type Cropper = ReturnType<typeof useImageCropper>
