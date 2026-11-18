import { GIFEncoder, applyPalette, quantize } from "gifenc"

function gifRepeat(plays: number) {
  // The Netscape extension stores additional plays. Zero means infinite.
  return plays === 0 ? 0 : plays === 1 ? -1 : plays - 1
}

export function createGifEncoder(width: number, height: number, plays: number) {
  const encoder = GIFEncoder()

  return {
    addFrame(rgba: Uint8ClampedArray, delay: number) {
      const palette = quantize(rgba, 255)
      const indices = applyPalette(rgba, palette)

      // Use the same transparent index in every frame so clearing works
      // between opaque and transparent frames as well.
      for (let pixel = 0; pixel < indices.length; pixel++) {
        indices[pixel] = rgba[pixel * 4 + 3]! < 128 ? 0 : indices[pixel]! + 1
      }
      palette.unshift([0, 0, 0])
      encoder.writeFrame(indices, width, height, {
        palette,
        delay,
        repeat: gifRepeat(plays),
        transparent: true,
      })
    },
    finish() {
      encoder.finish()
      return new Blob([encoder.bytes()], { type: "image/gif" })
    },
  }
}
