import { truePeak } from "./peak"

export const SAMPLE_RATE = 48_000
const hop = SAMPLE_RATE / 10
const absoluteGate = -70
const peakCeiling = -1.001 // Leave headroom for 16-bit rounding.
const offset = -0.691

function addWeightedEnergy(samples: Float32Array, energy: Float64Array) {
  // Cascaded 48 kHz K-weighting filters from ITU-R BS.1770-5 Annex 1.
  let x1 = 0
  let x2 = 0
  let y1 = 0
  let y2 = 0
  let z1 = 0
  let z2 = 0
  let sum = 0
  for (let index = 0; index < samples.length; index++) {
    const x = samples[index]!
    const y =
      1.53512485958697 * x -
      2.69169618940638 * x1 +
      1.19839281085285 * x2 +
      1.69065929318241 * y1 -
      0.73248077421585 * y2
    const z = y - 2 * y1 + y2 + 1.99004745483398 * z1 - 0.99007225036621 * z2
    sum += z * z
    if ((index + 1) % hop === 0) {
      const block = Math.floor(index / hop)
      energy[block]! += sum
      sum = 0
    }
    x2 = x1
    x1 = x
    y2 = y1
    y1 = y
    z2 = z1
    z1 = z
  }
  if (samples.length < 4 * hop) {
    energy[Math.floor(samples.length / hop)]! += sum
  }
}

function gatedAverage(blocks: Float64Array, gate: number) {
  let sum = 0
  let count = 0
  for (const power of blocks) {
    if (power > gate) {
      sum += power
      count++
    }
  }
  return count ? sum / count : 0
}

function integratedLoudness(blocks: Float64Array, gain = 0) {
  const threshold = 10 ** ((absoluteGate - gain - offset) / 10)
  const relativeGate = gatedAverage(blocks, threshold) / 10
  return (
    offset +
    10 * Math.log10(gatedAverage(blocks, Math.max(threshold, relativeGate))) +
    gain
  )
}

export function measure(channels: Float32Array[]) {
  const energy = new Float64Array(
    Math.max(4, Math.floor(channels[0]!.length / hop))
  )
  let peak = -Infinity
  for (const channel of channels) {
    addWeightedEnergy(channel, energy)
    peak = Math.max(peak, truePeak(channel))
  }
  const blocks = new Float64Array(energy.length - 3)
  for (let i = 0; i < blocks.length; i++) {
    blocks[i] =
      (energy[i]! + energy[i + 1]! + energy[i + 2]! + energy[i + 3]!) /
      (4 * hop)
  }
  return { blocks, loudness: integratedLoudness(blocks), peak }
}

export function normalize(
  analysis: ReturnType<typeof measure>,
  target: number
) {
  const ceilingGain = peakCeiling - analysis.peak
  let gain = Math.min(target - analysis.loudness, ceilingGain)
  // Changing gain can move quiet blocks across the absolute gate.
  for (let attempt = 0; attempt < 3; attempt++) {
    const correction = target - integratedLoudness(analysis.blocks, gain)
    if (Math.abs(correction) < 0.005) break
    gain = Math.min(gain + correction, ceilingGain)
  }
  return {
    gain,
    loudness: integratedLoudness(analysis.blocks, gain),
    peak: analysis.peak + gain,
    limited:
      gain === ceilingGain &&
      target - integratedLoudness(analysis.blocks, gain) > 0.05,
  }
}
