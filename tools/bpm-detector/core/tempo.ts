import { createPowerSpectrum } from "@workspace/pcm-audio/fft"

export const SAMPLE_RATE = 48_000
const frameSize = 1024
const hop = SAMPLE_RATE / 100
const onsetRate = SAMPLE_RATE / hop
const minBpm = 45
const maxBpm = 220
const minLag = Math.floor((60 * onsetRate) / maxBpm)
const maxLag = Math.ceil((60 * onsetRate) / minBpm)
const sectionFrames = 15 * SAMPLE_RATE

export function selectSections(channels: Float32Array[]) {
  const length = channels[0]!.length
  if (length <= sectionFrames * 3) {
    return [channels.map((channel) => channel.slice())]
  }
  const span = length - sectionFrames
  return [0, Math.floor(span / 2), span].map((start) =>
    channels.map((channel) => channel.slice(start, start + sectionFrames))
  )
}

function novelty(channels: Float32Array[]) {
  const frames = 1 + Math.floor((channels[0]!.length - frameSize) / hop)
  if (frames < 2 * onsetRate) return null

  const transform = createPowerSpectrum(frameSize)
  const bins = 128
  const power = new Float64Array(bins + 1)
  const energy = new Float64Array(bins + 1)
  const previous = new Float64Array(bins + 1)
  const weights = Float64Array.from(
    { length: bins + 1 },
    (_, i) => 1 / Math.sqrt(1 + i / 20)
  )
  const flux = new Float64Array(frames)
  const prefix = new Float64Array(frames + 1)
  for (let frame = 0; frame < frames; frame++) {
    energy.fill(0)
    for (const samples of channels) {
      transform(samples, frame * hop, power)
      for (let bin = 1; bin <= bins; bin++) energy[bin]! += power[bin]!
    }
    let change = 0
    for (let bin = 1; bin <= bins; bin++) {
      const magnitude = Math.log1p(
        (8 * Math.sqrt(energy[bin]! / channels.length)) / frameSize
      )
      change += Math.max(0, magnitude - previous[bin]!) * weights[bin]!
      previous[bin] = magnitude
    }
    flux[frame] = frame === 0 ? 0 : change
    prefix[frame + 1] = prefix[frame]! + flux[frame]!
  }

  // Remove the short-term baseline so recurring attacks stand out.
  const envelope = flux.map((value, frame) => {
    const first = Math.max(0, frame - 10)
    const last = Math.min(frames, frame + 11)
    const baseline = (prefix[last]! - prefix[first]!) / (last - first)
    return Math.max(0, value - Math.max(0.008, baseline * 1.25))
  })
  const peak = envelope.reduce((max, value) => Math.max(max, value), 0)
  let attacks = 0
  for (let i = 1; i < envelope.length - 1; i++) {
    const value = envelope[i]!
    if (
      value > peak * 0.15 &&
      value >= envelope[i - 1]! &&
      value > envelope[i + 1]!
    )
      attacks++
  }
  if (attacks < 3) return null
  const mean = envelope.reduce((sum, value) => sum + value, 0) / frames
  return envelope.map((value) => value - mean)
}

function correlation(envelope: Float64Array, lag: number) {
  let product = 0
  let leftEnergy = 0
  let rightEnergy = 0
  for (let i = lag; i < envelope.length; i++) {
    const left = envelope[i - lag]!
    const right = envelope[i]!
    product += left * right
    leftEnergy += left * left
    rightEnergy += right * right
  }
  const size = Math.sqrt(leftEnergy * rightEnergy)
  return product / Math.max(size, Number.MIN_VALUE)
}

export function detectTempo(sections: Float32Array[][]) {
  const envelopes = sections
    .map(novelty)
    .filter((envelope) => envelope !== null)
  if (envelopes.length === 0) return null
  const scores = new Float64Array(maxLag + 2)
  const peaks: number[] = []
  for (let lag = minLag - 1; lag <= maxLag + 1; lag++) {
    scores[lag] =
      envelopes.reduce((sum, envelope) => sum + correlation(envelope, lag), 0) /
      envelopes.length
  }
  for (let lag = minLag; lag <= maxLag; lag++) {
    if (scores[lag]! >= scores[lag - 1]! && scores[lag]! > scores[lag + 1]!)
      peaks.push(lag)
  }
  const strength = peaks.reduce((max, lag) => Math.max(max, scores[lag]!), 0)
  if (strength < 0.24) return null

  // Prefer the shortest period among similarly strong repeats.
  const lag = peaks.find((candidate) => scores[candidate]! >= strength * 0.84)!
  const before = scores[lag - 1]!
  const after = scores[lag + 1]!
  const offset = (before - after) / (2 * (before - 2 * scores[lag]! + after))
  const bpm = Math.round((60 * onsetRate) / (lag + offset))
  return Math.max(minBpm, Math.min(maxBpm, bpm))
}
