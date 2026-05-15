import { BrowserMultiFormatReader } from "@zxing/browser"
import {
  BarcodeFormat,
  ChecksumException,
  FormatException,
  NotFoundException,
} from "@zxing/library"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  BARCODE_DECODER_ERRORS,
  SUPPORTED_BARCODE_FORMATS,
  createBarcodeReader,
  decodeBarcodeFromImageFile,
  formatBarcodeFormat,
  isIgnorableDecodeError,
  isSupportedImageFile,
  toBarcodeResult,
} from "./barcode-decoder"

const originalCreateObjectURL = URL.createObjectURL
const originalRevokeObjectURL = URL.revokeObjectURL

function createZxingResult(text: string, format: BarcodeFormat) {
  return {
    getBarcodeFormat: () => format,
    getText: () => text,
  }
}

beforeEach(() => {
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: vi.fn(() => "blob:barcode-reader"),
  })
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: vi.fn(),
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: originalCreateObjectURL,
  })
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: originalRevokeObjectURL,
  })
})

describe("barcode decoder", () => {
  it("checks image file support by MIME type", () => {
    expect(
      isSupportedImageFile(
        new File(["png"], "barcode.png", { type: "image/png" })
      )
    ).toBe(true)
    expect(
      isSupportedImageFile(
        new File(["txt"], "barcode.txt", { type: "text/plain" })
      )
    ).toBe(false)
  })

  it("creates a multi-format reader with the expected scan formats", () => {
    expect(createBarcodeReader()).toBeInstanceOf(BrowserMultiFormatReader)
    expect(SUPPORTED_BARCODE_FORMATS).toContain(BarcodeFormat.CODE_128)
    expect(SUPPORTED_BARCODE_FORMATS).toContain(BarcodeFormat.QR_CODE)
  })

  it("normalizes zxing results for the UI", () => {
    expect(
      toBarcodeResult(createZxingResult("A-100", BarcodeFormat.CODE_128))
    ).toEqual({
      format: "CODE_128",
      text: "A-100",
    })
    expect(
      toBarcodeResult(createZxingResult("A-100", 999 as BarcodeFormat))
    ).toEqual({
      format: "999",
      text: "A-100",
    })
    expect(formatBarcodeFormat("CODE_128")).toBe("CODE 128")
  })

  it("detects decode failures that only mean no readable code was present", () => {
    expect(isIgnorableDecodeError(new NotFoundException())).toBe(true)
    expect(isIgnorableDecodeError(new ChecksumException())).toBe(true)
    expect(isIgnorableDecodeError(new FormatException())).toBe(true)
    expect(isIgnorableDecodeError({ name: "NotFoundException" })).toBe(true)
    expect(isIgnorableDecodeError(new Error("boom"))).toBe(false)
    expect(isIgnorableDecodeError("boom")).toBe(false)
  })

  it("decodes a barcode from an image file and revokes the object URL", async () => {
    const decodeSpy = vi
      .spyOn(BrowserMultiFormatReader.prototype, "decodeFromImageUrl")
      .mockResolvedValue(
        createZxingResult(
          "https://example.com/item/100",
          BarcodeFormat.QR_CODE
        ) as Awaited<ReturnType<BrowserMultiFormatReader["decodeFromImageUrl"]>>
      )

    await expect(
      decodeBarcodeFromImageFile(
        new File(["png"], "barcode.png", { type: "image/png" })
      )
    ).resolves.toEqual({
      format: "QR_CODE",
      text: "https://example.com/item/100",
    })

    expect(decodeSpy).toHaveBeenCalledWith("blob:barcode-reader")
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:barcode-reader")
  })

  it("returns null when zxing reports no readable barcode", async () => {
    vi.spyOn(
      BrowserMultiFormatReader.prototype,
      "decodeFromImageUrl"
    ).mockRejectedValue(new NotFoundException())

    await expect(
      decodeBarcodeFromImageFile(
        new File(["png"], "empty.png", { type: "image/png" })
      )
    ).resolves.toBe(null)
  })

  it("rejects unsupported files and non-ignorable decoding errors", async () => {
    await expect(
      decodeBarcodeFromImageFile(
        new File(["txt"], "barcode.txt", { type: "text/plain" })
      )
    ).rejects.toThrow(BARCODE_DECODER_ERRORS.invalidFileType)

    vi.spyOn(
      BrowserMultiFormatReader.prototype,
      "decodeFromImageUrl"
    ).mockRejectedValue(new Error("decode failed"))

    await expect(
      decodeBarcodeFromImageFile(
        new File(["png"], "broken.png", { type: "image/png" })
      )
    ).rejects.toThrow(BARCODE_DECODER_ERRORS.decodeFailed)
  })
})
