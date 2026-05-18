import { describe, expect, test } from "vitest"

import {
  ZIP_MIME_TYPE,
  createStoredZip,
  createStoredZipBytes,
  crc32,
} from "./zip"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function findEndOfCentralDirectory(bytes: Uint8Array) {
  for (let index = bytes.length - 22; index >= 0; index -= 1) {
    if (
      bytes[index] === 0x50 &&
      bytes[index + 1] === 0x4b &&
      bytes[index + 2] === 0x05 &&
      bytes[index + 3] === 0x06
    ) {
      return index
    }
  }

  throw new Error("EOCD_NOT_FOUND")
}

describe("crc32", () => {
  test("matches the standard check value", () => {
    expect(crc32(encoder.encode("123456789"))).toBe(0xcbf43926)
  })
})

describe("createStoredZipBytes", () => {
  test("creates an empty zip archive", () => {
    const bytes = createStoredZipBytes([])
    const view = new DataView(bytes.buffer)

    expect(bytes.length).toBe(22)
    expect(view.getUint32(0, true)).toBe(0x06054b50)
    expect(view.getUint16(8, true)).toBe(0)
  })

  test("writes local files and central directory records", () => {
    const first = encoder.encode("one")
    const second = encoder.encode("two")
    const bytes = createStoredZipBytes([
      { data: first, name: "alpha.webp" },
      { data: second, name: "nested\\beta.webp" },
    ])
    const view = new DataView(bytes.buffer)

    expect(view.getUint32(0, true)).toBe(0x04034b50)
    expect(view.getUint16(6, true)).toBe(0x0800)
    expect(view.getUint16(8, true)).toBe(0)
    expect(view.getUint32(14, true)).toBe(crc32(first))
    expect(view.getUint32(18, true)).toBe(first.byteLength)

    const firstNameLength = view.getUint16(26, true)
    expect(decoder.decode(bytes.slice(30, 30 + firstNameLength))).toBe(
      "alpha.webp"
    )
    expect(
      decoder.decode(
        bytes.slice(30 + firstNameLength, 30 + firstNameLength + first.length)
      )
    ).toBe("one")

    const eocdOffset = findEndOfCentralDirectory(bytes)
    const centralDirectoryOffset = view.getUint32(eocdOffset + 16, true)
    expect(view.getUint32(centralDirectoryOffset, true)).toBe(0x02014b50)
    expect(view.getUint16(eocdOffset + 8, true)).toBe(2)
    expect(view.getUint16(eocdOffset + 10, true)).toBe(2)

    const secondLocalOffset = 30 + firstNameLength + first.length
    const secondNameLength = view.getUint16(secondLocalOffset + 26, true)
    const secondNameStart = secondLocalOffset + 30
    expect(
      decoder.decode(
        bytes.slice(secondNameStart, secondNameStart + secondNameLength)
      )
    ).toBe("nested_beta.webp")
  })

  test("creates a zip Blob with the expected MIME type", () => {
    const blob = createStoredZip([
      { data: encoder.encode("image"), name: "image.webp" },
    ])

    expect(blob.type).toBe(ZIP_MIME_TYPE)
  })

  test("uses a default entry name when a zip entry name is blank", () => {
    const bytes = createStoredZipBytes([
      { data: encoder.encode("image"), name: "   " },
    ])

    expect(decoder.decode(bytes)).toContain("image.webp")
  })

  test("rejects unsupported zip sizes", () => {
    expect(() =>
      createStoredZipBytes(
        Array.from({ length: 0x10000 }, () => ({
          data: new Uint8Array(),
          name: "image.webp",
        }))
      )
    ).toThrowError("ZIP_TOO_MANY_ENTRIES")

    expect(() =>
      createStoredZipBytes([
        { data: new Uint8Array(), name: "a".repeat(0x10000) },
      ])
    ).toThrowError("ZIP_ENTRY_NAME_TOO_LONG")

    expect(() =>
      createStoredZipBytes([
        {
          data: { byteLength: 0x100000000 } as Uint8Array,
          name: "huge.webp",
        },
      ])
    ).toThrowError("ZIP_ENTRY_TOO_LARGE")
  })
})
