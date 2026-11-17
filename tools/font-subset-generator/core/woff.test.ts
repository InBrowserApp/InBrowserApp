// @vitest-environment node
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { decodeWoff } from "./woff"
import { readFont } from "./font"

const fixture = () =>
  new Uint8Array(
    readFileSync(new URL("../fixtures/static.woff", import.meta.url))
  )
function mutate(update: (view: DataView, bytes: Uint8Array) => void) {
  const bytes = fixture()
  update(new DataView(bytes.buffer), bytes)
  return bytes
}

describe("WOFF container decoding", () => {
  it("reconstructs padded SFNT tables and a valid whole-font checksum", () => {
    const output = decodeWoff(fixture())
    expect(readFont(output).hasCharacter(65)).toBe(true)
    const view = new DataView(output.buffer)
    let sum = 0
    for (let i = 0; i < output.length; i += 4)
      sum = (sum + view.getUint32(i)) >>> 0
    expect(sum).toBe(0xb1b0afba)
  })
  it("rejects broken table directories and lengths", () => {
    const badCount = mutate((view) => view.setUint16(12, 0))
    expect(() => decodeWoff(badCount)).toThrow("INVALID_FONT")
    expect(() =>
      decodeWoff(mutate((view) => view.setUint16(12, 0xffff)))
    ).toThrow("INVALID_FONT")
    expect(() => decodeWoff(mutate((view) => view.setUint32(16, 20)))).toThrow(
      "INVALID_FONT"
    )
    expect(() =>
      decodeWoff(mutate((view) => view.setUint32(52, 0xffffffff)))
    ).toThrow("INVALID_FONT")
    expect(() =>
      decodeWoff(mutate((view) => view.setUint32(48, 0xffffffff)))
    ).toThrow("INVALID_FONT")
    const mismatched = mutate((view) => {
      // Advertise a different inflated table size while retaining its padding.
      const count = view.getUint16(12)
      for (let i = 0; i < count; i++) {
        const entry = 44 + i * 20
        const length = view.getUint32(entry + 12)
        if (view.getUint32(entry + 8) < length && length % 4 !== 0) {
          view.setUint32(entry + 12, length + 1)
          return
        }
      }
      throw new Error("Fixture needs an unaligned compressed table")
    })
    expect(() => decodeWoff(mismatched)).toThrow("INVALID_FONT")
    expect(() =>
      decodeWoff(
        mutate((view) => {
          for (let i = 0; i < view.getUint16(12); i++) {
            const entry = 44 + i * 20
            if (view.getUint32(entry) === 0x68656164) view.setUint32(entry, 0)
          }
        })
      )
    ).toThrow("INVALID_FONT")
  })
})
