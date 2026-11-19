import { crc32, readChunkType } from "@workspace/raster-image/png-chunks"
import { unzlibSync } from "fflate"
import { expect, test } from "vitest"
import { createApngEncoder } from "./animation"

test("encodes complete RGBA frames with independent delays and a finite loop count", async () => {
  const encoder = createApngEncoder(2, 1, 2, 3)
  encoder.addFrame(new Uint8ClampedArray([200, 0, 0, 255, 0, 0, 0, 0]), 20)
  encoder.addFrame(new Uint8ClampedArray([0, 0, 0, 0, 0, 200, 0, 128]), 655350)
  const blob = encoder.finish()
  const buffer = await blob.arrayBuffer()
  const view = new DataView(buffer)
  const chunks = []

  expect(blob.type).toBe("image/png")
  expect(view.getBigUint64(0)).toBe(0x89504e470d0a1a0an)
  for (let offset = 8; offset < buffer.byteLength;) {
    const length = view.getUint32(offset)
    const type = readChunkType(view, offset + 4)
    const data = new Uint8Array(buffer, offset + 8, length)
    expect(view.getUint32(offset + 8 + length)).toBe(
      crc32(new Uint8Array(buffer, offset + 4, length + 4))
    )
    chunks.push({ type, data, view: new DataView(buffer, offset + 8, length) })
    offset += length + 12
  }
  expect(chunks.map(({ type }) => type)).toEqual([
    "IHDR",
    "acTL",
    "fcTL",
    "IDAT",
    "fcTL",
    "fdAT",
    "IEND",
  ])
  const [header, animation, first, firstData, second, secondData] = chunks
  expect(header!.view.getUint32(0)).toBe(2)
  expect(header!.view.getUint32(4)).toBe(1)
  expect(header!.data.slice(8, 10)).toEqual(new Uint8Array([8, 6]))
  expect(animation!.view.getUint32(0)).toBe(2)
  expect(animation!.view.getUint32(4)).toBe(3)
  expect(first!.view.getUint32(0)).toBe(0)
  expect(first!.view.getUint16(20)).toBe(2)
  expect(first!.view.getUint16(22)).toBe(100)
  expect(Array.from(unzlibSync(firstData!.data))).toEqual([
    1, 200, 0, 0, 255, 56, 0, 0, 1,
  ])
  expect(second!.view.getUint32(0)).toBe(1)
  expect(second!.view.getUint16(20)).toBe(65535)
  expect(second!.data.slice(24)).toEqual(new Uint8Array([0, 0]))
  expect(secondData!.view.getUint32(0)).toBe(2)
  expect(Array.from(unzlibSync(secondData!.data.slice(4)))).toEqual([
    1, 0, 0, 0, 0, 0, 200, 0, 128,
  ])
})
