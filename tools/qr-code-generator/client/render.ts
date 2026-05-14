import QRCode from "qrcode"

import { getRenderableQrPayload, toQrRenderOptions } from "../core/options"

import type { QrGeneratorOptions } from "../core/options"

type QrRasterMimeType = "image/png" | "image/jpeg" | "image/webp"

async function renderQrSvgMarkup(payload: string, options: QrGeneratorOptions) {
  const svg = await QRCode.toString(getRenderableQrPayload(payload), {
    ...toQrRenderOptions(options),
    type: "svg",
  })

  return typeof svg === "string" ? svg : ""
}

async function renderQrImageBlob(
  payload: string,
  options: QrGeneratorOptions,
  type: QrRasterMimeType
) {
  const renderOptions =
    type === "image/png"
      ? {
          ...toQrRenderOptions(options),
          type,
        }
      : {
          ...toQrRenderOptions(options),
          rendererOpts: {
            quality: 0.92,
          },
          type,
        }
  const dataUrl = await QRCode.toDataURL(
    getRenderableQrPayload(payload),
    renderOptions
  )
  const response = await fetch(dataUrl)

  return response.blob()
}

export { renderQrImageBlob, renderQrSvgMarkup }
