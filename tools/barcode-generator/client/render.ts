import JsBarcode from "jsbarcode"

import {
  getRenderableBarcodeText,
  toJsBarcodeOptions,
} from "../core/barcode-options"

import type { BarcodeGeneratorOptions } from "../core/barcode-options"

type BarcodeRasterFormat = "jpeg" | "png" | "webp"

function renderBarcodeSvgMarkup(options: BarcodeGeneratorOptions) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")

  JsBarcode(svg, getRenderableBarcodeText(options.text), {
    ...toJsBarcodeOptions(options),
    xmlDocument: document,
  })

  return svg.outerHTML
}

function toRasterMimeType(format: BarcodeRasterFormat) {
  switch (format) {
    case "jpeg":
      return "image/jpeg"
    case "png":
      return "image/png"
    case "webp":
      return "image/webp"
  }
}

function toRasterQuality(format: BarcodeRasterFormat) {
  return format === "png" ? undefined : 0.95
}

async function renderBarcodeRasterBlob(
  options: BarcodeGeneratorOptions,
  format: BarcodeRasterFormat
) {
  const canvas = document.createElement("canvas")
  const mimeType = toRasterMimeType(format)

  JsBarcode(canvas, getRenderableBarcodeText(options.text), {
    ...toJsBarcodeOptions(options),
  })

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, toRasterQuality(format))
  })

  if (!blob) {
    throw new Error(`Unable to export barcode as ${format.toUpperCase()}.`)
  }

  return blob
}

export { renderBarcodeRasterBlob, renderBarcodeSvgMarkup }
