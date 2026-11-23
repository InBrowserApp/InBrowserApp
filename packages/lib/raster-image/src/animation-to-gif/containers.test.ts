import { readFileSync } from "node:fs"
import { expect, test } from "vitest"
import { crc32, readChunkType } from "../png-chunks"
import { readApng } from "./apng"
import { readAnimatedWebp } from "./webp"

function fixture(name: string) {
  return Uint8Array.from(readFileSync(`tools/image-viewer/fixtures/${name}`))
}

function pngChunks(bytes: Uint8Array<ArrayBuffer>) {
  const view = new DataView(bytes.buffer)
  const chunks = []
  for (let offset = 8; offset + 12 <= bytes.length;) {
    const size = view.getUint32(offset)
    const end = offset + size + 12
    chunks.push({ type: readChunkType(view, offset + 4), offset, end })
    offset = end
  }
  return chunks
}

function fixCrc(bytes: Uint8Array, offset: number, end: number) {
  const view = new DataView(bytes.buffer)
  view.setUint32(end - 4, crc32(bytes.subarray(offset + 4, end - 4)))
}

function tiffOrientation(value: number, littleEndian: boolean) {
  const tiff = new Uint8Array(26)
  const view = new DataView(tiff.buffer)
  view.setUint16(0, littleEndian ? 0x4949 : 0x4d4d)
  view.setUint16(2, 42, littleEndian)
  view.setUint32(4, 8, littleEndian)
  view.setUint16(8, 1, littleEndian)
  view.setUint16(10, 0x0112, littleEndian)
  view.setUint16(12, 3, littleEndian)
  view.setUint32(14, 1, littleEndian)
  view.setUint16(18, value, littleEndian)
  return tiff
}

test("APNG retains frame bounds, independent delays, and finite play count", async () => {
  const bytes = fixture("animation.apng")
  const view = new DataView(bytes.buffer)
  const control = pngChunks(bytes).find((chunk) => chunk.type === "acTL")!
  view.setUint32(control.offset + 12, 3)
  fixCrc(bytes, control.offset, control.end)

  const { width, height, frames, plays } = readApng(bytes.buffer)
  expect({ width, height, plays }).toEqual({
    width: 100,
    height: 100,
    plays: 3,
  })
  expect(frames.map(({ delay }) => delay)).toEqual([100, 200, 300])
  expect(frames[1]).toMatchObject({ x: 20, y: 20, width: 41, height: 41 })
  const frame = new Uint8Array(await frames[1]!.image().arrayBuffer())
  expect(pngChunks(frame).map(({ type }) => type)).toEqual([
    "IHDR",
    "IDAT",
    "IEND",
  ])
  expect(new DataView(frame.buffer).getUint32(16)).toBe(41)
})

test("APNG skips an independent default image and validates the frame CRC", () => {
  const bytes = fixture("animation.apng")
  const chunks = pngChunks(bytes)
  const first = chunks.find(({ type }) => type === "fcTL")!
  const next = chunks.find(
    ({ type, offset }) => type === "fcTL" && offset > first.offset
  )!
  const control = chunks.find(({ type }) => type === "acTL")!
  const posterOnly = new Uint8Array(bytes.length - (first.end - first.offset))
  posterOnly.set(bytes.subarray(0, first.offset))
  posterOnly.set(bytes.subarray(first.end), first.offset)
  const view = new DataView(posterOnly.buffer)
  view.setUint32(control.offset + 8, 2)
  fixCrc(posterOnly, control.offset, control.end)
  for (const { type, offset, end } of pngChunks(posterOnly)) {
    if (type !== "fcTL" && type !== "fdAT") continue
    view.setUint32(offset + 8, view.getUint32(offset + 8) - 1)
    fixCrc(posterOnly, offset, end)
  }

  expect(readApng(posterOnly.buffer).frames.map(({ delay }) => delay)).toEqual([
    200, 300,
  ])
  posterOnly[next.offset - (first.end - first.offset) + 28]! ^= 1
  expect(() => readApng(posterOnly.buffer)).toThrow("invalid")
})

test("animated WebP keeps frame bounds, durations, and loop metadata", async () => {
  const bytes = fixture("animation.animated.webp")
  const { width, height, frames, plays } = readAnimatedWebp(bytes.buffer)
  expect({ width, height, plays }).toEqual({
    width: 100,
    height: 100,
    plays: 0,
  })
  expect(frames.map(({ delay }) => delay)).toEqual([100, 200, 300])
  expect(frames[1]!.width).toBeLessThan(width)
  expect(frames[1]!.x).toBeGreaterThan(0)
  const payload = await frames[1]!.image().arrayBuffer()
  const view = new DataView(payload)
  expect(readChunkType(view, 0)).toBe("RIFF")
  expect(view.getUint32(4, true) + 8).toBe(payload.byteLength)
  expect(readChunkType(view, 8)).toBe("WEBP")
  expect(readChunkType(view, 12)).toBe("VP8 ")
})

test("APNG reads orientation from valid eXIf metadata", () => {
  const source = fixture("animation.apng")
  const tiff = tiffOrientation(6, false)
  const exif = new Uint8Array(tiff.length + 12)
  new DataView(exif.buffer).setUint32(0, tiff.length)
  exif.set(new TextEncoder().encode("eXIf"), 4)
  exif.set(tiff, 8)
  fixCrc(exif, 0, exif.length)
  const ihdrEnd = pngChunks(source)[0]!.end
  const bytes = new Uint8Array(source.length + exif.length)
  bytes.set(source.subarray(0, ihdrEnd))
  bytes.set(exif, ihdrEnd)
  bytes.set(source.subarray(ihdrEnd), ihdrEnd + exif.length)
  expect(readApng(bytes.buffer).orientation).toBe(6)

  bytes[ihdrEnd + exif.length - 1]! ^= 1
  expect(readApng(bytes.buffer).orientation).toBe(1)
})

test("WebP reads prefixed EXIF and ignores reserved frame flags", () => {
  const source = fixture("animation.animated.webp")
  const tiff = tiffOrientation(8, true)
  const prefix = new TextEncoder().encode("Exif\0\0")
  const bytes = new Uint8Array(source.length + 8 + prefix.length + tiff.length)
  bytes.set(source)
  bytes.set(new TextEncoder().encode("EXIF"), source.length)
  const view = new DataView(bytes.buffer)
  view.setUint32(4, bytes.length - 8, true)
  view.setUint32(source.length + 4, prefix.length + tiff.length, true)
  bytes.set(prefix, source.length + 8)
  bytes.set(tiff, source.length + 8 + prefix.length)
  bytes[20]! |= 8
  for (let offset = 30; offset < source.length;) {
    if (readChunkType(view, offset) === "ANMF") bytes[offset + 23]! |= 0xfc
    const size = view.getUint32(offset + 4, true)
    offset += 8 + size + (size % 2)
  }

  const { orientation, frames } = readAnimatedWebp(bytes.buffer)
  expect(orientation).toBe(8)
  expect(frames.map(({ blend, dispose }) => [blend, dispose])).toEqual(
    readAnimatedWebp(source.buffer).frames.map(({ blend, dispose }) => [
      blend,
      dispose,
    ])
  )
})

test("the decoders reject still, wrong-format, and truncated inputs", () => {
  const apng = fixture("animation.apng")
  const webp = fixture("animation.animated.webp")
  expect(() => readApng(fixture("color-chart.png").buffer)).toThrow("invalid")
  expect(() => readApng(webp.buffer)).toThrow("invalid")
  expect(() => readApng(apng.slice(0, -1).buffer)).toThrow("invalid")
  expect(() => readAnimatedWebp(webp.slice(0, -1).buffer)).toThrow("invalid")
  expect(() => readAnimatedWebp(apng.buffer)).toThrow("invalid")

  // Turn the VP8X flags into those of a still container.
  webp[20]! &= ~2
  expect(() => readAnimatedWebp(webp.buffer)).toThrow("invalid")
})
