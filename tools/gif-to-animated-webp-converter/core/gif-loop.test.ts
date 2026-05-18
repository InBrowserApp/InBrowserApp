import { describe, expect, test } from "vitest"

import { readGifLoopCount, resolveLoopCount } from "./gif-loop"

function loopExtension(
  identifier: "ANIMEXTS1.0" | "NETSCAPE2.0",
  count: number
) {
  const bytes = [
    0x21,
    0xff,
    0x0b,
    ...Array.from(identifier, (character) => character.charCodeAt(0)),
    0x03,
    0x01,
    count & 0xff,
    (count >> 8) & 0xff,
    0x00,
  ]

  return new Uint8Array(bytes)
}

describe("readGifLoopCount", () => {
  test("reads Netscape and ANIMEXTS loop extensions", () => {
    expect(readGifLoopCount(loopExtension("NETSCAPE2.0", 0))).toBe(0)
    expect(readGifLoopCount(loopExtension("ANIMEXTS1.0", 5))).toBe(5)
  })

  test("ignores malformed loop extensions", () => {
    expect(readGifLoopCount(new Uint8Array([0x21, 0xff]))).toBeNull()
    expect(readGifLoopCount(new Uint8Array(19))).toBeNull()

    const malformed = loopExtension("NETSCAPE2.0", 3)
    malformed[14] = 2
    expect(readGifLoopCount(malformed)).toBeNull()

    const wrongMarker = loopExtension("NETSCAPE2.0", 3)
    wrongMarker[15] = 0
    expect(readGifLoopCount(wrongMarker)).toBeNull()

    const unknown = loopExtension("NETSCAPE2.0", 3)
    unknown[3] = 0x58
    expect(readGifLoopCount(unknown)).toBeNull()
  })
})

describe("resolveLoopCount", () => {
  test("uses explicit loop options before GIF metadata", () => {
    const bytes = loopExtension("NETSCAPE2.0", 4)

    expect(resolveLoopCount(bytes, { loopMode: "infinite" })).toBe(0)
    expect(resolveLoopCount(bytes, { loopCount: 8, loopMode: "custom" })).toBe(
      8
    )
  })

  test("inherits GIF metadata or falls back to one play", () => {
    expect(resolveLoopCount(loopExtension("NETSCAPE2.0", 7), {})).toBe(7)
    expect(resolveLoopCount(new Uint8Array(), {})).toBe(1)
  })
})
