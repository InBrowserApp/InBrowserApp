import { describe, expect, test } from "vitest"

import {
  ZIP_MIME_TYPE,
  createStoredZip,
  createStoredZipBytes,
  crc32,
} from "./zip"

const decoder = new TextDecoder()

const UINT32_MAX = 0xffffffff

function readUint16(bytes: Uint8Array, offset: number) {
  return new DataView(bytes.buffer).getUint16(offset, true)
}

function readUint32(bytes: Uint8Array, offset: number) {
  return new DataView(bytes.buffer).getUint32(offset, true)
}

describe("stored ZIP writer", () => {
  test("creates a valid ZIP structure for browser downloads", async () => {
    const bytes = createStoredZipBytes([
      { data: new TextEncoder().encode("one"), name: "first.png" },
      { data: new TextEncoder().encode("two"), name: "nested/second.png" },
    ])

    expect(readUint32(bytes, 0)).toBe(0x04034b50)
    expect(decoder.decode(bytes.slice(30, 39))).toBe("first.png")

    const endOffset = bytes.byteLength - 22
    expect(readUint32(bytes, endOffset)).toBe(0x06054b50)
    expect(readUint16(bytes, endOffset + 8)).toBe(2)
    expect(readUint16(bytes, endOffset + 10)).toBe(2)
    expect(decoder.decode(bytes)).toContain("nested_second.png")
  })

  test("falls back to a page filename when an entry name is blank", () => {
    const bytes = createStoredZipBytes([
      { data: new Uint8Array([1]), name: "   " },
    ])

    expect(decoder.decode(bytes)).toContain("page.png")
  })

  test("uses the ZIP MIME type and reports crc32 values", async () => {
    const blob = createStoredZip([
      { data: new TextEncoder().encode("hello"), name: "hello.txt" },
    ])

    expect(blob.type).toBe(ZIP_MIME_TYPE)
    expect(await blob.arrayBuffer()).toHaveProperty("byteLength")
    expect(crc32(new TextEncoder().encode("hello"))).toBe(0x3610a686)
  })

  test("rejects ZIP limits that require ZIP64", () => {
    expect(() =>
      createStoredZipBytes(
        Array.from({ length: 0x10000 }, () => ({
          data: new Uint8Array(),
          name: "page.png",
        }))
      )
    ).toThrow("ZIP_TOO_MANY_ENTRIES")

    expect(() =>
      createStoredZipBytes([
        { data: new Uint8Array(), name: "a".repeat(0x10000) },
      ])
    ).toThrow("ZIP_ENTRY_NAME_TOO_LONG")

    const oversizedData = {
      byteLength: UINT32_MAX + 1,
    } as unknown as Uint8Array

    expect(() =>
      createStoredZipBytes([{ data: oversizedData, name: "page.png" }])
    ).toThrow("ZIP_ENTRY_TOO_LARGE")
  })
})
