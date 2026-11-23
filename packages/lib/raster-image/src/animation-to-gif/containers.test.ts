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
