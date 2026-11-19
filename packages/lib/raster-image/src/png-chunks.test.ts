import { describe, expect, test } from "vitest"

import { crc32, readChunkType, setApngLoop } from "./png-chunks"

function createApngBuffer(loopCount = 0, includeCrc = true) {
  const buffer = new ArrayBuffer(includeCrc ? 28 : 24)
  const view = new DataView(buffer)
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

  signature.forEach((value, index) => view.setUint8(index, value))
  view.setUint32(8, 8)
  view.setUint8(12, 0x61)
  view.setUint8(13, 0x63)
  view.setUint8(14, 0x54)
  view.setUint8(15, 0x4c)
  view.setUint32(16, 2)
  view.setUint32(20, loopCount)

  if (includeCrc) {
    view.setUint32(24, crc32(new Uint8Array(buffer, 12, 12)))
  }

  return buffer
}

describe("png chunk helpers", () => {
  test("reads PNG chunk type strings", () => {
    const buffer = createApngBuffer()
    const view = new DataView(buffer)

    expect(readChunkType(view, 12)).toBe("acTL")
  })

  test("calculates the standard CRC32 check value", () => {
    expect(crc32(new TextEncoder().encode("123456789"))).toBe(0xcbf43926)
  })

  test("sets APNG loop count and refreshes the chunk CRC", () => {
    const buffer = createApngBuffer(0)
    const result = setApngLoop(buffer, 3)
    const view = new DataView(result)

    expect(view.getUint32(20)).toBe(3)
    expect(view.getUint32(24)).toBe(crc32(new Uint8Array(result, 12, 12)))
  })

  test("sets APNG loop count even when a CRC is unavailable", () => {
    const buffer = createApngBuffer(0, false)
    const view = new DataView(setApngLoop(buffer, 4))

    expect(view.getUint32(20)).toBe(4)
  })

  test("leaves non-APNG buffers unchanged", () => {
    const buffer = new ArrayBuffer(20)
    const view = new DataView(buffer)

    view.setUint32(8, 0)
    view.setUint8(12, 0x49)
    view.setUint8(13, 0x45)
    view.setUint8(14, 0x4e)
    view.setUint8(15, 0x44)

    expect(setApngLoop(buffer, 2)).toBe(buffer)
  })
})
