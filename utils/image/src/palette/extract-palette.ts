export type PaletteColor = {
  r: number
  g: number
  b: number
  count: number
}

export type ExtractPaletteOptions = {
  colorCount: number
  sampleStride?: number
  ignoreTransparent?: boolean
  alphaThreshold?: number
}

export type ExtractPaletteResult = {
  colors: PaletteColor[]
  totalPixels: number
}

const SIGBITS = 5
const RSHIFT = 8 - SIGBITS
const MULT = 1 << RSHIFT
const HISTOSIZE = 1 << (3 * SIGBITS)
const HISTOMASK = (1 << SIGBITS) - 1

class VBox {
  public readonly histo: Uint32Array
  public r1: number
  public r2: number
  public g1: number
  public g2: number
  public b1: number
  public b2: number
  private cachedCount: number | null = null
  private cachedAvg: PaletteColor | null = null

  constructor(
    r1: number,
    r2: number,
    g1: number,
    g2: number,
    b1: number,
    b2: number,
    histo: Uint32Array,
  ) {
    this.r1 = r1
    this.r2 = r2
    this.g1 = g1
    this.g2 = g2
    this.b1 = b1
    this.b2 = b2
    this.histo = histo
  }

  count(): number {
    if (this.cachedCount !== null) return this.cachedCount
    let count = 0
    for (let r = this.r1; r <= this.r2; r += 1) {
      for (let g = this.g1; g <= this.g2; g += 1) {
        for (let b = this.b1; b <= this.b2; b += 1) {
          const index = getColorIndex(r, g, b)
          count += this.histo[index] ?? 0
        }
      }
    }
    this.cachedCount = count
    return count
  }

  volume(): number {
    return (this.r2 - this.r1 + 1) * (this.g2 - this.g1 + 1) * (this.b2 - this.b1 + 1)
  }

  avg(): PaletteColor {
    if (this.cachedAvg) return this.cachedAvg
    let total = 0
    let rsum = 0
    let gsum = 0
    let bsum = 0

    for (let r = this.r1; r <= this.r2; r += 1) {
      for (let g = this.g1; g <= this.g2; g += 1) {
        for (let b = this.b1; b <= this.b2; b += 1) {
          const index = getColorIndex(r, g, b)
          const count = this.histo[index] ?? 0
          if (count === 0) continue
          total += count
          rsum += count * (r + 0.5) * MULT
          gsum += count * (g + 0.5) * MULT
          bsum += count * (b + 0.5) * MULT
        }
      }
    }

    if (total === 0) {
      const r = Math.round(MULT * (this.r1 + this.r2 + 1) * 0.5)
      const g = Math.round(MULT * (this.g1 + this.g2 + 1) * 0.5)
      const b = Math.round(MULT * (this.b1 + this.b2 + 1) * 0.5)
      this.cachedAvg = { r, g, b, count: 0 }
      return this.cachedAvg
    }

    const avg = {
      r: Math.round(rsum / total),
      g: Math.round(gsum / total),
      b: Math.round(bsum / total),
      count: total,
    }
    this.cachedAvg = avg
    return avg
  }

  copy(): VBox {
    return new VBox(this.r1, this.r2, this.g1, this.g2, this.b1, this.b2, this.histo)
  }
}

class PQueue {
  private readonly compare: (a: VBox, b: VBox) => number
  contents: VBox[] = []

  constructor(compare: (a: VBox, b: VBox) => number) {
    this.compare = compare
  }

  push(item: VBox) {
    this.contents.push(item)
    this.contents.sort(this.compare)
  }

  pop(): VBox | undefined {
    if (this.contents.length === 0) return undefined
    this.contents.sort(this.compare)
    return this.contents.pop()
  }

  size(): number {
    return this.contents.length
  }
}

export function extractPalette(
  imageData: ImageData,
  options: ExtractPaletteOptions,
): ExtractPaletteResult {
  const colorCount = Math.max(1, Math.min(256, Math.floor(options.colorCount)))
  const sampleStride = Math.max(1, Math.floor(options.sampleStride ?? 1))
  const ignoreTransparent = options.ignoreTransparent ?? true
  const alphaThreshold = Math.max(0, Math.min(255, Math.floor(options.alphaThreshold ?? 8)))

  const histo = new Uint32Array(HISTOSIZE)
  const data = imageData.data
  let totalPixels = 0

  for (let i = 0; i < data.length; i += 4 * sampleStride) {
    const alpha = data[i + 3] ?? 255
    if (ignoreTransparent && alpha <= alphaThreshold) continue
    const r = (data[i] ?? 0) >> RSHIFT
    const g = (data[i + 1] ?? 0) >> RSHIFT
    const b = (data[i + 2] ?? 0) >> RSHIFT
    const index = getColorIndex(r, g, b)
    histo[index] = (histo[index] ?? 0) + 1
    totalPixels += 1
  }

  if (totalPixels === 0) {
    return { colors: [], totalPixels: 0 }
  }

  const vbox = vboxFromHisto(histo)
  if (!vbox) {
    return { colors: [], totalPixels }
  }

  const vboxes = quantize(histo, vbox, colorCount)
  const colors = vboxes.map((box) => box.avg()).filter((color) => color.count > 0)
  colors.sort((a, b) => b.count - a.count)

  return { colors, totalPixels }
}

function getColorIndex(r: number, g: number, b: number): number {
  return (r << (2 * SIGBITS)) + (g << SIGBITS) + b
}

function vboxFromHisto(histo: Uint32Array): VBox | null {
  let rmin = 1e9
  let rmax = 0
  let gmin = 1e9
  let gmax = 0
  let bmin = 1e9
  let bmax = 0
  let found = false

  for (let index = 0; index < HISTOSIZE; index += 1) {
    if (!histo[index]) continue
    found = true
    const r = (index >> (2 * SIGBITS)) & HISTOMASK
    const g = (index >> SIGBITS) & HISTOMASK
    const b = index & HISTOMASK
    if (r < rmin) rmin = r
    if (r > rmax) rmax = r
    if (g < gmin) gmin = g
    if (g > gmax) gmax = g
    if (b < bmin) bmin = b
    if (b > bmax) bmax = b
  }

  if (!found) return null
  return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo)
}

function quantize(histo: Uint32Array, vbox: VBox, maxColors: number): VBox[] {
  const pq = new PQueue((a, b) => a.count() - b.count())
  pq.push(vbox)

  const target = Math.max(1, Math.round(maxColors * 0.75))
  splitBoxes(pq, target, histo)

  const pq2 = new PQueue((a, b) => a.count() * a.volume() - b.count() * b.volume())
  pq2.contents = pq.contents.slice()
  splitBoxes(pq2, maxColors, histo)

  return pq2.contents
}

function splitBoxes(queue: PQueue, target: number, histo: Uint32Array) {
  let iterations = 0
  while (queue.size() < target && iterations < 1000) {
    const vbox = queue.pop()
    if (!vbox) break
    if (vbox.count() === 0) break

    const split = medianCutApply(histo, vbox)
    if (!split) {
      queue.push(vbox)
      break
    }

    const [vbox1, vbox2] = split
    queue.push(vbox1)
    if (vbox2) queue.push(vbox2)
    iterations += 1
  }
}

function medianCutApply(histo: Uint32Array, vbox: VBox): [VBox, VBox | null] | null {
  if (vbox.count() === 0) return null
  if (vbox.count() === 1) return [vbox.copy(), null]

  const rRange = vbox.r2 - vbox.r1
  const gRange = vbox.g2 - vbox.g1
  const bRange = vbox.b2 - vbox.b1

  let axis: 'r' | 'g' | 'b' = 'r'
  if (gRange >= rRange && gRange >= bRange) axis = 'g'
  if (bRange >= rRange && bRange >= gRange) axis = 'b'

  const { partialSum, total } = buildPartialSum(histo, vbox, axis)
  if (total === 0) return null

  const half = total / 2
  let cut = axis === 'r' ? vbox.r1 : axis === 'g' ? vbox.g1 : vbox.b1
  const max = axis === 'r' ? vbox.r2 : axis === 'g' ? vbox.g2 : vbox.b2

  for (let i = cut; i <= max; i += 1) {
    if ((partialSum[i] ?? 0) >= half) {
      cut = i
      break
    }
  }

  const min = axis === 'r' ? vbox.r1 : axis === 'g' ? vbox.g1 : vbox.b1
  if (cut <= min) cut = Math.min(max - 1, min)
  if (cut >= max) cut = Math.max(min, max - 1)
  if (cut < min || cut >= max) return [vbox.copy(), null]

  const vbox1 = vbox.copy()
  const vbox2 = vbox.copy()

  if (axis === 'r') {
    vbox1.r2 = cut
    vbox2.r1 = cut + 1
  } else if (axis === 'g') {
    vbox1.g2 = cut
    vbox2.g1 = cut + 1
  } else {
    vbox1.b2 = cut
    vbox2.b1 = cut + 1
  }

  return [vbox1, vbox2]
}

function buildPartialSum(histo: Uint32Array, vbox: VBox, axis: 'r' | 'g' | 'b') {
  const partialSum: number[] = []
  let total = 0

  if (axis === 'r') {
    for (let r = vbox.r1; r <= vbox.r2; r += 1) {
      let sum = 0
      for (let g = vbox.g1; g <= vbox.g2; g += 1) {
        for (let b = vbox.b1; b <= vbox.b2; b += 1) {
          sum += histo[getColorIndex(r, g, b)] ?? 0
        }
      }
      total += sum
      partialSum[r] = total
    }
  } else if (axis === 'g') {
    for (let g = vbox.g1; g <= vbox.g2; g += 1) {
      let sum = 0
      for (let r = vbox.r1; r <= vbox.r2; r += 1) {
        for (let b = vbox.b1; b <= vbox.b2; b += 1) {
          sum += histo[getColorIndex(r, g, b)] ?? 0
        }
      }
      total += sum
      partialSum[g] = total
    }
  } else {
    for (let b = vbox.b1; b <= vbox.b2; b += 1) {
      let sum = 0
      for (let r = vbox.r1; r <= vbox.r2; r += 1) {
        for (let g = vbox.g1; g <= vbox.g2; g += 1) {
          sum += histo[getColorIndex(r, g, b)] ?? 0
        }
      }
      total += sum
      partialSum[b] = total
    }
  }

  return { partialSum, total }
}
