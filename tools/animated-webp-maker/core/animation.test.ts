import { expect, test } from "vitest"
import { webpAnimationBlob } from "./animation"

// libwebp's lossless still output for two identical red pixels.
const stillWebp = new Uint8Array([
  0x52, 0x49, 0x46, 0x46, 0x16, 0x0, 0x0, 0x0, 0x57, 0x45, 0x42, 0x50, 0x56,
  0x50, 0x38, 0x4c, 0xa, 0x0, 0x0, 0x0, 0x2f, 0x1, 0x0, 0x0, 0x0, 0x88, 0xc2,
  0x47, 0xff, 0x3,
])

test.each([false, true])(
  "wraps a still image with alpha flag %s in a valid animation",
  async (alpha) => {
    const image = stillWebp.slice()
    if (alpha) image[24] = 0x10
    const blob = webpAnimationBlob(image, 2, 1, [120, 655350], 3)
    const buffer = await blob.arrayBuffer()
    const view = new DataView(buffer)
    const ascii = new TextDecoder()
    const text = (offset: number) =>
      ascii.decode(new Uint8Array(buffer, offset, 4))

    expect(blob.type).toBe("image/webp")
    expect(text(0)).toBe("RIFF")
    expect(view.getUint32(4, true)).toBe(buffer.byteLength - 8)
    expect(text(8)).toBe("WEBP")
    expect(text(12)).toBe("VP8X")
    expect(view.getUint8(20)).toBe(alpha ? 0x12 : 0x02)
    expect(view.getUint8(24)).toBe(1)
    expect(view.getUint8(27)).toBe(0)
    expect(text(30)).toBe("ANIM")
    expect(view.getUint16(42, true)).toBe(3)
    expect(text(44)).toBe("ANMF")
    expect(view.getUint32(48, true)).toBe(34)
    expect(view.getUint8(58)).toBe(1)
    expect(view.getUint8(61)).toBe(0)
    expect(view.getUint16(64, true)).toBe(120)
    expect(view.getUint8(67)).toBe(0x02)
    expect(new Uint8Array(buffer, 68, 18)).toEqual(image.subarray(12))
    expect(text(86)).toBe("ANMF")
    expect(view.getUint32(106, true) & 0xffffff).toBe(655350)
    expect(new Uint8Array(buffer, 110, 18)).toEqual(image.subarray(12))
  }
)

test("clears the background color while retaining the encoder's animation", async () => {
  const animation = webpAnimationBlob(stillWebp, 2, 1, [120, 200], 3)
  const expected = new Uint8Array(await animation.arrayBuffer())
  const input = expected.slice()
  input.fill(255, 38, 42)
  const blob = webpAnimationBlob(input, 2, 1, [120, 200], 3)
  expect(new Uint8Array(await blob.arrayBuffer())).toEqual(expected)
})

test("leaves a non-animated extended WebP without an ANIM chunk intact", async () => {
  const image = stillWebp.slice()
  image.set(new TextEncoder().encode("VP8X"), 12)
  const blob = webpAnimationBlob(image, 2, 1, [120, 200], 3)
  expect(new Uint8Array(await blob.arrayBuffer())).toEqual(image)
})
