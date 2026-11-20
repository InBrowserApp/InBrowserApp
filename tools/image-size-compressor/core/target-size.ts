type Dimensions = Readonly<{ width: number; height: number }>

type Encode = (dimensions: Dimensions, quality: number) => Promise<Blob | null>

const RESIZE_QUALITY_FLOOR = 40

export async function encodeToLimit(
  original: Dimensions,
  limit: number,
  allowResize: boolean,
  encode: Encode
) {
  const { width, height } = original
  let scale = 1
  for (;;) {
    const size = {
      width: Math.max(1, Math.floor(width * scale)),
      height: Math.max(1, Math.floor(height * scale)),
    }
    const canResize = allowResize && (size.width > 1 || size.height > 1)
    const highest = await encode(size, 100)
    if (!highest) {
      if (!canResize) throw new Error("IMAGE_ENCODING_FAILED")
      // Some browsers cannot render a canvas at the source dimensions.
      scale *= 0.5
      continue
    }
    if (highest.size <= limit) return { blob: highest, ...size }

    const floor = canResize ? RESIZE_QUALITY_FLOOR : 0
    let best = await encode(size, floor)
    if (!best) throw new Error("IMAGE_ENCODING_FAILED")

    if (best.size <= limit) {
      let low = floor + 1
      let high = 99
      while (low <= high) {
        const quality = Math.floor((low + high) / 2)
        const candidate = await encode(size, quality)
        if (!candidate) break
        if (candidate.size <= limit) {
          best = candidate
          low = quality + 1
        } else {
          high = quality - 1
        }
      }
      return { blob: best, ...size }
    }
    if (!canResize) return { blob: best, ...size }

    // Bytes tend to scale with area. Recheck the actual encoding at each size.
    scale *= Math.min(0.95, Math.sqrt(limit / best.size))
  }
}
