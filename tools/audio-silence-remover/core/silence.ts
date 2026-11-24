export const SAMPLE_RATE = 48_000
const windowFrames = SAMPLE_RATE / 100
const retainedFrames = Math.round(SAMPLE_RATE * 0.15)

export type SilenceCut = { start: number; end: number }

export function audioLevels(channels: Float32Array[]) {
  const length = channels[0]!.length
  const levels = new Float32Array(Math.ceil(length / windowFrames))
  for (let block = 0; block < levels.length; block++) {
    const start = block * windowFrames
    const end = Math.min(length, start + windowFrames)
    let maxEnergy = 0
    for (const samples of channels) {
      let energy = 0
      for (let i = start; i < end; i++) energy += samples[i]! ** 2
      maxEnergy = Math.max(maxEnergy, energy / (end - start))
    }
    levels[block] = maxEnergy
  }
  return { length, levels }
}

export function findCuts(
  { length, levels }: ReturnType<typeof audioLevels>,
  threshold: number,
  minimum: number
) {
  const limit = 10 ** (threshold / 10)
  const minimumFrames = Math.round(minimum * SAMPLE_RATE)
  const cuts: SilenceCut[] = []
  let quietStart = 0
  let hasSound = false
  for (let i = 0; i <= levels.length; i++) {
    if (i < levels.length && levels[i]! < limit) continue
    const end = Math.min(length, i * windowFrames)
    if (end - quietStart >= minimumFrames) {
      const keepBefore =
        quietStart === 0
          ? 0
          : end === length
            ? retainedFrames
            : retainedFrames / 2
      cuts.push({
        start: quietStart + keepBefore,
        end: end - (retainedFrames - keepBefore),
      })
    }
    quietStart = end + windowFrames
    if (i < levels.length) hasSound = true
  }
  return { cuts: hasSound ? cuts : [], allQuiet: !hasSound }
}

export function removedFrames(cuts: SilenceCut[]) {
  return cuts.reduce((total, cut) => total + cut.end - cut.start, 0)
}

export function keptSpans(length: number, cuts: SilenceCut[]) {
  const spans: SilenceCut[] = []
  let start = 0
  for (const cut of cuts) {
    if (start < cut.start) spans.push({ start, end: cut.start })
    start = cut.end
  }
  if (start < length) spans.push({ start, end: length })
  return spans
}
