import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  DEFAULT_QR_GENERATOR_OPTIONS,
  toQrRenderOptions,
} from "../core/options"
import { renderQrImageBlob, renderQrSvgMarkup } from "./render"

const qrcodeMocks = vi.hoisted(() => ({
  toDataURL: vi.fn(),
  toString: vi.fn(),
}))

vi.mock("qrcode", () => ({
  default: qrcodeMocks,
}))

describe("QR render helpers", () => {
  beforeEach(() => {
    qrcodeMocks.toDataURL.mockResolvedValue("data:image/png;base64,cXI=")
    qrcodeMocks.toString.mockResolvedValue("<svg><rect /></svg>")
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        blob: async () => new Blob(["qr"], { type: "image/png" }),
      }))
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it("renders SVG markup with normalized empty payloads", async () => {
    await expect(
      renderQrSvgMarkup("", DEFAULT_QR_GENERATOR_OPTIONS)
    ).resolves.toBe("<svg><rect /></svg>")

    expect(qrcodeMocks.toString).toHaveBeenCalledWith(" ", {
      ...toQrRenderOptions(DEFAULT_QR_GENERATOR_OPTIONS),
      type: "svg",
    })
  })

  it("falls back to an empty SVG string when the renderer is unexpected", async () => {
    qrcodeMocks.toString.mockResolvedValueOnce(undefined)

    await expect(
      renderQrSvgMarkup("payload", DEFAULT_QR_GENERATOR_OPTIONS)
    ).resolves.toBe("")
  })

  it("renders raster download blobs for supported image formats", async () => {
    await expect(
      renderQrImageBlob("payload", DEFAULT_QR_GENERATOR_OPTIONS, "image/png")
    ).resolves.toBeInstanceOf(Blob)
    await expect(
      renderQrImageBlob("payload", DEFAULT_QR_GENERATOR_OPTIONS, "image/jpeg")
    ).resolves.toBeInstanceOf(Blob)
    await expect(
      renderQrImageBlob("payload", DEFAULT_QR_GENERATOR_OPTIONS, "image/webp")
    ).resolves.toBeInstanceOf(Blob)

    expect(qrcodeMocks.toDataURL.mock.calls).toEqual([
      [
        "payload",
        {
          ...toQrRenderOptions(DEFAULT_QR_GENERATOR_OPTIONS),
          type: "image/png",
        },
      ],
      [
        "payload",
        {
          ...toQrRenderOptions(DEFAULT_QR_GENERATOR_OPTIONS),
          rendererOpts: {
            quality: 0.92,
          },
          type: "image/jpeg",
        },
      ],
      [
        "payload",
        {
          ...toQrRenderOptions(DEFAULT_QR_GENERATOR_OPTIONS),
          rendererOpts: {
            quality: 0.92,
          },
          type: "image/webp",
        },
      ],
    ])
  })
})
