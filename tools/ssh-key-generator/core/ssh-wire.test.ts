import { describe, expect, test } from "vitest"

import {
  addOpenSshPadding,
  base64UrlToBytes,
  bytesToBase64,
  encodeString,
  encodeMpint,
  wrapPem,
} from "./ssh-wire"

function readUint32(bytes: Uint8Array) {
  return new DataView(
    bytes.buffer,
    bytes.byteOffset,
    bytes.byteLength
  ).getUint32(0, false)
}

describe("ssh wire helpers", () => {
  test("encodes SSH strings from text and bytes", () => {
    const text = encodeString("ssh")
    const bytes = encodeString(new Uint8Array([1, 2, 3]))

    expect(readUint32(text)).toBe(3)
    expect(Array.from(text.slice(4))).toEqual([115, 115, 104])
    expect(readUint32(bytes)).toBe(3)
    expect(Array.from(bytes.slice(4))).toEqual([1, 2, 3])
  })

  test("encodes and decodes base64 variants", () => {
    const bytes = new Uint8Array([251, 255, 238])

    expect(bytesToBase64(bytes)).toBe("+//u")
    expect(base64UrlToBytes("-__u")).toEqual(bytes)
  })

  test("encodes mpints with SSH positive-number rules", () => {
    const stripped = encodeMpint(new Uint8Array([0, 0, 0x7f]))
    const padded = encodeMpint(new Uint8Array([0x80]))

    expect(readUint32(stripped)).toBe(1)
    expect(Array.from(stripped.slice(4))).toEqual([0x7f])
    expect(readUint32(padded)).toBe(2)
    expect(Array.from(padded.slice(4))).toEqual([0, 0x80])
    expect(readUint32(encodeMpint(new Uint8Array()))).toBe(0)
  })

  test("adds OpenSSH padding only when needed", () => {
    expect(addOpenSshPadding(new Uint8Array(8))).toHaveLength(8)
    expect([...addOpenSshPadding(new Uint8Array([1, 2, 3]))]).toEqual([
      1, 2, 3, 1, 2, 3, 4, 5,
    ])
  })

  test("wraps empty and non-empty PEM payloads", () => {
    expect(wrapPem("TEST", new Uint8Array())).toBe(
      "-----BEGIN TEST-----\n\n-----END TEST-----\n"
    )
    expect(wrapPem("TEST", new Uint8Array([1, 2, 3]))).toContain("AQID")
  })
})
