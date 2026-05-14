import type { PaletteColor } from "./types"

const SIGBITS = 5
const MULT = 1 << (8 - SIGBITS)
const HISTOMASK = (1 << SIGBITS) - 1

class VBox {
  private cachedCount: number | null = null

  constructor(
    public r1: number,
    public r2: number,
    public g1: number,
    public g2: number,
    public b1: number,
    public b2: number,
    public readonly histo: Uint32Array
  ) {}

  count(): number {
    if (this.cachedCount !== null) return this.cachedCount

    let count = 0
    for (let r = this.r1; r <= this.r2; r += 1) {
      for (let g = this.g1; g <= this.g2; g += 1) {
        for (let b = this.b1; b <= this.b2; b += 1) {
          count += this.histo[getColorIndex(r, g, b)]!
        }
      }
    }

    this.cachedCount = count
    return count
  }

  volume(): number {
    return (
      (this.r2 - this.r1 + 1) *
      (this.g2 - this.g1 + 1) *
      (this.b2 - this.b1 + 1)
    )
  }

  avg(): PaletteColor {
    let total = 0
    let rsum = 0
    let gsum = 0
    let bsum = 0

    for (let r = this.r1; r <= this.r2; r += 1) {
      for (let g = this.g1; g <= this.g2; g += 1) {
        for (let b = this.b1; b <= this.b2; b += 1) {
          const count = this.histo[getColorIndex(r, g, b)]!
          if (count === 0) continue

          total += count
          rsum += count * (r + 0.5) * MULT
          gsum += count * (g + 0.5) * MULT
          bsum += count * (b + 0.5) * MULT
        }
      }
    }

    return {
      r: Math.round(rsum / total),
      g: Math.round(gsum / total),
      b: Math.round(bsum / total),
      count: total,
    }
  }

  copy(): VBox {
    return new VBox(
      this.r1,
      this.r2,
      this.g1,
      this.g2,
      this.b1,
      this.b2,
      this.histo
    )
  }
}

class PQueue {
  contents: VBox[] = []

  constructor(private readonly compare: (a: VBox, b: VBox) => number) {}

  push(item: VBox) {
    this.contents.push(item)
    this.contents.sort(this.compare)
  }

  pop(): VBox | undefined {
    this.contents.sort(this.compare)
    return this.contents.pop()
  }

  size(): number {
    return this.contents.length
  }
}

function getColorIndex(r: number, g: number, b: number): number {
  return (r << (2 * SIGBITS)) + (g << SIGBITS) + b
}

function vboxFromHisto(histo: Uint32Array): VBox | null {
  let rmin = Number.POSITIVE_INFINITY
  let gmin = Number.POSITIVE_INFINITY
  let bmin = Number.POSITIVE_INFINITY
  let rmax = 0
  let gmax = 0
  let bmax = 0
  let found = false

  for (let index = 0; index < histo.length; index += 1) {
    if (!histo[index]) continue

    found = true

    const r = (index >> (2 * SIGBITS)) & HISTOMASK
    const g = (index >> SIGBITS) & HISTOMASK
    const b = index & HISTOMASK

    rmin = Math.min(rmin, r)
    rmax = Math.max(rmax, r)
    gmin = Math.min(gmin, g)
    gmax = Math.max(gmax, g)
    bmin = Math.min(bmin, b)
    bmax = Math.max(bmax, b)
  }

  return found ? new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo) : null
}

function quantizeHistogram(
  histo: Uint32Array,
  maxColors: number
): PaletteColor[] {
  const initialBox = vboxFromHisto(histo)
  if (!initialBox) return []

  const dominantQueue = new PQueue((a, b) => a.count() - b.count())
  dominantQueue.push(initialBox)
  splitBoxes(dominantQueue, Math.max(1, Math.round(maxColors * 0.75)))

  const mixedQueue = new PQueue(
    (a, b) => a.count() * a.volume() - b.count() * b.volume()
  )
  mixedQueue.contents = dominantQueue.contents.slice()
  splitBoxes(mixedQueue, maxColors)

  return mixedQueue.contents
    .map((box) => box.avg())
    .filter((color) => color.count > 0)
    .sort((a, b) => b.count - a.count)
}

function splitBoxes(queue: PQueue, target: number) {
  let iterations = 0

  while (queue.size() < target && iterations < 1000) {
    const vbox = queue.pop()!
    const split = medianCutApply(vbox)
    const [vbox1, vbox2] = split
    queue.push(vbox1)
    if (vbox2) queue.push(vbox2)
    iterations += 1
  }
}

function medianCutApply(vbox: VBox): [VBox, VBox | null] {
  if (vbox.count() === 1) return [vbox.copy(), null]

  const axis = getLongestAxis(vbox)
  const { partialSum, total } = buildPartialSum(vbox, axis)

  const min = axis === "r" ? vbox.r1 : axis === "g" ? vbox.g1 : vbox.b1
  const max = axis === "r" ? vbox.r2 : axis === "g" ? vbox.g2 : vbox.b2
  let cut = min

  for (let index = min; index <= max; index += 1) {
    if (partialSum[index]! >= total / 2) {
      cut = index
      break
    }
  }

  if (cut <= min) cut = Math.min(max - 1, min)
  if (cut >= max) cut = Math.max(min, max - 1)
  if (cut < min || cut >= max) return [vbox.copy(), null]

  const vbox1 = vbox.copy()
  const vbox2 = vbox.copy()

  if (axis === "r") {
    vbox1.r2 = cut
    vbox2.r1 = cut + 1
  } else if (axis === "g") {
    vbox1.g2 = cut
    vbox2.g1 = cut + 1
  } else {
    vbox1.b2 = cut
    vbox2.b1 = cut + 1
  }

  return [vbox1, vbox2]
}

function getLongestAxis(vbox: VBox): "r" | "g" | "b" {
  const ranges = {
    r: vbox.r2 - vbox.r1,
    g: vbox.g2 - vbox.g1,
    b: vbox.b2 - vbox.b1,
  }

  if (ranges.b >= ranges.r && ranges.b >= ranges.g) return "b"
  if (ranges.g >= ranges.r && ranges.g >= ranges.b) return "g"
  return "r"
}

function buildPartialSum(vbox: VBox, axis: "r" | "g" | "b") {
  const partialSum: number[] = []
  let total = 0
  const min = axis === "r" ? vbox.r1 : axis === "g" ? vbox.g1 : vbox.b1
  const max = axis === "r" ? vbox.r2 : axis === "g" ? vbox.g2 : vbox.b2

  for (let major = min; major <= max; major += 1) {
    let sum = 0

    for (let minorA = 0; minorA < 1 << (2 * SIGBITS); minorA += 1) {
      const first = minorA >> SIGBITS
      const second = minorA & HISTOMASK
      const r = axis === "r" ? major : axis === "g" ? first : first
      const g = axis === "g" ? major : axis === "r" ? first : second
      const b = axis === "b" ? major : axis === "r" ? second : second

      if (
        r < vbox.r1 ||
        r > vbox.r2 ||
        g < vbox.g1 ||
        g > vbox.g2 ||
        b < vbox.b1 ||
        b > vbox.b2
      ) {
        continue
      }

      sum += vbox.histo[getColorIndex(r, g, b)]!
    }

    total += sum
    partialSum[major] = total
  }

  return { partialSum, total }
}

export { HISTOMASK, SIGBITS, getColorIndex, quantizeHistogram }
