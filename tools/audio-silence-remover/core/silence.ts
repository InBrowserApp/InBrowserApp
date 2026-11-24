export const SAMPLE_RATE = 48_000
const windowFrames = SAMPLE_RATE / 100
const retainedFrames = Math.round(SAMPLE_RATE * 0.15)
const fadeFrames = Math.round(SAMPLE_RATE * 0.005)

type Range = { start: number; end: number }

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
  const cuts: Range[] = []
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

export function removedFrames(cuts: Range[]) {
  return cuts.reduce((total, cut) => total + cut.end - cut.start, 0)
}

export function trimChannels(channels: Float32Array[], cuts: Range[]) {
  const length = channels[0]!.length - removedFrames(cuts)
  return channels.map((samples) => {
    const output = new Float32Array(length)
    let input = 0
    let offset = 0
    for (const cut of cuts) {
      output.set(samples.subarray(input, cut.start), offset)
      offset += cut.start - input
      input = cut.end
    }
    output.set(samples.subarray(input), offset)

    let removed = 0
    for (const cut of cuts) {
      const join = cut.start - removed
      const before = Math.min(join, fadeFrames)
      const after = Math.min(length - join, fadeFrames)
      for (let i = 0; i < before; i++) output[join - 1 - i]! *= i / fadeFrames
      for (let i = 0; i < after; i++) output[join + i]! *= i / fadeFrames
      removed += cut.end - cut.start
    }
    return output
  })
}
