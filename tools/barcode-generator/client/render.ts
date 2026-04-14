import JsBarcode from "jsbarcode"

import {
  getRenderableBarcodeText,
  toJsBarcodeOptions,
} from "../core/barcode-options"

import type { BarcodeGeneratorOptions } from "../core/barcode-options"

function renderBarcodeSvgMarkup(options: BarcodeGeneratorOptions) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")

  JsBarcode(svg, getRenderableBarcodeText(options.text), {
    ...toJsBarcodeOptions(options),
    xmlDocument: document,
  })

  return svg.outerHTML
}

async function renderBarcodePngBlob(options: BarcodeGeneratorOptions) {
  const canvas = document.createElement("canvas")

  JsBarcode(canvas, getRenderableBarcodeText(options.text), {
    ...toJsBarcodeOptions(options),
  })

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png")
  })

  if (!blob) {
    throw new Error("Unable to export barcode as PNG.")
  }

  return blob
}

export { renderBarcodePngBlob, renderBarcodeSvgMarkup }
