import { describe, expect, test } from "vitest"

import {
  DEFAULT_ICON_NAME,
  buildIcoBinary,
  isSupportedInputImage,
  normalizeIcoSizes,
  resolveIcoOutputName,
} from "./convert-image-to-ico"

describe("normalizeIcoSizes", () => {
  test("sorts sizes descending and removes duplicates", () => {
    expect(normalizeIcoSizes([32, 16, 256, 16, 48])).toEqual([256, 48, 32, 16])
  })

  test("filters invalid sizes", () => {
    expect(normalizeIcoSizes([0, -1, 16.4, 300, Number.NaN])).toEqual([16])
  })
})

describe("isSupportedInputImage", () => {
  test("accepts browser-provided image mime types", () => {
    expect(
      isSupportedInputImage({
        name: "icon.unknown",
        type: "image/png",
      })
    ).toBe(true)
  })

  test("falls back to known image extensions when the mime type is missing", () => {
    expect(
      isSupportedInputImage({
        name: "icon.svg",
        type: "",
      })
    ).toBe(true)
  })

  test("rejects unsupported files", () => {
    expect(
      isSupportedInputImage({
        name: "notes.txt",
        type: "",
      })
    ).toBe(false)
  })

  test("rejects files with an empty extension when mime type is missing", () => {
    expect(
      isSupportedInputImage({
        name: "README.",
        type: "",
      })
    ).toBe(false)
  })
})

describe("resolveIcoOutputName", () => {
  test("replaces existing file extensions", () => {
    expect(resolveIcoOutputName("favicon.png")).toBe("favicon.ico")
  })

  test("adds the ico extension when no extension exists", () => {
    expect(resolveIcoOutputName("favicon")).toBe("favicon.ico")
  })

  test("preserves dotfile-style names before appending ico", () => {
    expect(resolveIcoOutputName(".png")).toBe(".png.ico")
  })

  test("falls back to the default icon name", () => {
    expect(resolveIcoOutputName("")).toBe(DEFAULT_ICON_NAME)
  })
})

describe("buildIcoBinary", () => {
  test("builds an ico file with png payloads", () => {
    const frame16 = new Uint8Array([0x89, 0x50, 0x4e, 0x47])
    const frame256 = new Uint8Array([0x11, 0x22, 0x33])
    const ico = buildIcoBinary([
      { png: frame16, size: 16 },
      { png: frame256, size: 256 },
    ])
    const view = new DataView(ico.buffer)

    expect(view.getUint16(0, true)).toBe(0)
    expect(view.getUint16(2, true)).toBe(1)
    expect(view.getUint16(4, true)).toBe(2)

    expect(ico[6]).toBe(16)
    expect(ico[7]).toBe(16)
    expect(view.getUint32(14, true)).toBe(frame16.byteLength)
    expect(view.getUint32(18, true)).toBe(38)

    expect(ico[22]).toBe(0)
    expect(ico[23]).toBe(0)
    expect(view.getUint32(30, true)).toBe(frame256.byteLength)
    expect(view.getUint32(34, true)).toBe(42)

    expect(Array.from(ico.slice(38, 42))).toEqual(Array.from(frame16))
    expect(Array.from(ico.slice(42, 45))).toEqual(Array.from(frame256))
  })

  test("throws when no frames are provided", () => {
    expect(() => buildIcoBinary([])).toThrowError("NO_SIZES_SELECTED")
  })

  test("throws when a frame size is outside the ico range", () => {
    expect(() =>
      buildIcoBinary([{ png: new Uint8Array([1]), size: 300 }])
    ).toThrowError("INVALID_SIZE")
  })
})
