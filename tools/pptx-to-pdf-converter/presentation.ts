import { PptxPresentation } from "@silurus/ooxml/pptx"
import { math } from "@silurus/ooxml/math"
import { threeD } from "@silurus/ooxml/three-d"
import { regionMap } from "@silurus/ooxml/region-map"
import { chartEx } from "@silurus/ooxml/chart-ex"
import { tiff } from "@silurus/ooxml/tiff"
import {
  imageResources,
  maximumPageZoom,
  officeLoadOptions,
} from "@workspace/document-reader"
import { inspectArchive } from "./core/archive"
import { ConversionError } from "./core/errors"
export { failure } from "./core/errors"

export async function loadPresentation(file: File, signal: AbortSignal) {
  const data = await file.arrayBuffer()
  signal.throwIfAborted()
  inspectArchive(data)
  return PptxPresentation.load(data, {
    ...officeLoadOptions,
    math,
    threeD,
    regionMap,
    chartEx,
    tiff,
  })
}

export async function renderSlideImage(
  source: PptxPresentation,
  index: number,
  width: number,
  height: number,
  signal: AbortSignal,
  mime: "image/png" | "image/jpeg" | "image/webp" = "image/png"
) {
  // Reject a canvas size the renderer would otherwise silently downscale.
  if (maximumPageZoom(width, height) < 1) throw new ConversionError("resource")
  const canvas = document.createElement("canvas")
  try {
    await source.renderSlide(canvas, index, {
      width,
      dpr: 1,
      imageResources,
      skipMediaControls: true,
      failOnError: true,
    })
    signal.throwIfAborted()
    const context = canvas.getContext("2d")
    if (!context) throw new ConversionError("resource")
    context.globalCompositeOperation = "destination-over"
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, mime, mime === "image/png" ? undefined : 0.92)
    )
    signal.throwIfAborted()
    if (!blob || blob.type !== mime) throw new ConversionError("resource")
    return blob
  } finally {
    canvas.width = canvas.height = 0
  }
}
