// @vitest-environment node
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { fontKind, readFont } from "./font"

function font(name = "static.ttf") {
  return new Uint8Array(
    readFileSync(new URL(`../fixtures/${name}`, import.meta.url))
  )
}
function table(data: Uint8Array, tag: string) {
  const view = new DataView(data.buffer)
  for (let i = 0; i < view.getUint16(4); i++) {
    const entry = 12 + i * 16
    if (String.fromCharCode(...data.subarray(entry, entry + 4)) === tag)
      return { entry, offset: view.getUint32(entry + 8) }
  }
  throw new Error(`Missing fixture table: ${tag}`)
}
function cmapFixture(format: 4 | 12 | 13, range = false, sentinel = true) {
  const data = font()
  const { offset, entry } = table(data, "cmap")
  const bytes = new Uint8Array(
    data.buffer,
    offset,
    new DataView(data.buffer).getUint32(entry + 12)
  )
  bytes.fill(0)
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  view.setUint16(2, 1)
  view.setUint16(4, 0)
  view.setUint16(6, 4)
  view.setUint32(8, 12)
  view.setUint16(12, format)
  if (format === 4) {
    const count = sentinel ? 2 : 1
    view.setUint16(14, 16 + count * 8 + 6)
    view.setUint16(18, count * 2)
    const ends = 26
    const starts = ends + count * 2 + 2
    const deltas = starts + count * 2
    const ranges = deltas + count * 2
    view.setUint16(ends, 67)
    view.setUint16(starts, 65)
    view.setInt16(deltas, range ? -1 : -64)
    if (sentinel) {
      view.setUint16(ends + 2, 0xffff)
      view.setUint16(starts + 2, 0xffff)
      view.setInt16(deltas + 2, 1)
    }
    if (range) {
      view.setUint16(ranges, count * 2)
      view.setUint16(ranges + count * 2, 2)
      view.setUint16(ranges + count * 2 + 2, 0)
      view.setUint16(ranges + count * 2 + 4, 1)
    }
  } else {
    view.setUint32(16, 40)
    view.setUint32(24, 2)
    view.setUint32(28, 65)
    view.setUint32(32, 67)
    view.setUint32(36, 5)
    view.setUint32(40, 0x1f600)
    view.setUint32(44, 0x1f601)
    view.setUint32(48, 0)
  }
  return data
}

describe("SFNT metadata and Unicode coverage", () => {
  it("identifies supported containers by bytes, including legacy true signatures", () => {
    for (const [name, expected] of [
      ["static.ttf", "ttf"],
      ["static.woff", "woff"],
      ["static.woff2", "woff2"],
      ["cff.otf", "otf"],
    ])
      expect(fontKind(font(name))).toBe(expected)
    const bytes = font()
    new DataView(bytes.buffer).setUint32(0, 0x74727565)
    expect(fontKind(bytes)).toBe("ttf")
    expect(() => fontKind(new Uint8Array(4))).toThrow("INVALID_FONT")
    expect(() => fontKind(new Uint8Array(1))).toThrow(RangeError)
  })
  it("reads format 4 deltas and glyph arrays without treating missing glyphs as coverage", () => {
    const direct = readFont(cmapFixture(4)).hasCharacter
    expect([64, 65, 66, 67, 68, 0xffff, 0x10000].map(direct)).toEqual([
      false,
      true,
      true,
      true,
      false,
      false,
      false,
    ])
    const array = readFont(cmapFixture(4, true)).hasCharacter
    expect([65, 66, 67].map(array)).toEqual([true, false, false])
    expect(readFont(cmapFixture(4, false, false)).hasCharacter(68)).toBe(false)
  })
  it("reads format 12 and 13 ranges, including non-BMP and zero glyphs", () => {
    for (const format of [12, 13] as const) {
      const has = readFont(cmapFixture(format)).hasCharacter
      expect([64, 65, 66, 68, 0x1f600, 0x1f602].map(has)).toEqual([
        false,
        true,
        true,
        false,
        false,
        false,
      ])
      expect(has(0x1f601)).toBe(format === 12)
    }
  })
  it("reads static and variable weight metadata and source style", () => {
    expect(readFont(font("variable.ttf")).details.weight).toBe("100 900")
    const data = font()
    const view = new DataView(data.buffer)
    const os2 = table(data, "OS/2")
    const head = table(data, "head")
    view.setUint16(os2.offset + 62, 1)
    expect(readFont(data).details.style).toBe("italic")
    view.setUint16(os2.offset + 62, 512)
    expect(readFont(data).details.style).toBe("oblique")
    view.setUint16(os2.offset + 62, 0)
    view.setUint16(head.offset + 44, 2)
    expect(readFont(data).details.style).toBe("italic")
    view.setUint16(head.offset + 44, 0)
    view.setUint32(os2.entry + 12, 6)
    expect(readFont(data).details.style).toBe("normal")
    data.set([84, 69, 83, 84], os2.entry)
    expect(readFont(data).details).toMatchObject({
      weight: "400",
      style: "normal",
    })
  })
  it("rejects non-SFNT, absent directories and unsupported cmap mappings", () => {
    expect(() => readFont(font("static.woff"))).toThrow("INVALID_FONT")
    const data = font()
    const view = new DataView(data.buffer)
    view.setUint16(4, 0)
    expect(() => readFont(data)).toThrow("INVALID_FONT")
    view.setUint16(4, 0xffff)
    expect(() => readFont(data)).toThrow("INVALID_FONT")
    const unsupported = cmapFixture(4)
    const cmap = table(unsupported, "cmap").offset
    const cmapView = new DataView(unsupported.buffer)
    cmapView.setUint16(cmap + 4, 1)
    expect(() => readFont(unsupported)).toThrow("INVALID_FONT")
    cmapView.setUint16(cmap + 4, 3)
    cmapView.setUint16(cmap + 6, 0)
    expect(() => readFont(unsupported)).toThrow("INVALID_FONT")
    cmapView.setUint16(cmap + 6, 1)
    cmapView.setUint16(cmap + 12, 6)
    expect(() => readFont(unsupported)).toThrow("INVALID_FONT")
  })
})
