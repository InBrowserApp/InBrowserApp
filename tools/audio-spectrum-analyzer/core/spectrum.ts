import { createPowerSpectrum } from "@workspace/pcm-audio/fft"

export const SAMPLE_RATE = 48_000
export const FFT_SIZE = 8192
export const BIN_HZ = SAMPLE_RATE / FFT_SIZE
export const MIN_DB = -100
const maxWindows = 192

export function selectFrames(channels: Float32Array[]) {
  const length = channels[0]!.length
  const frameLength = Math.min(length, FFT_SIZE)
  const span = Math.max(0, length - FFT_SIZE)
  const windows = Math.min(maxWindows, 1 + Math.ceil(span / (FFT_SIZE / 2)))
  const starts = Array.from({ length: windows }, (_, i) =>
    Math.round((i * span) / Math.max(1, windows - 1))
  )
  const selected = channels.map((samples) => {
    const frames = new Float32Array(windows * frameLength)
    for (const [index, start] of starts.entries()) {
      frames.set(
        samples.subarray(start, start + frameLength),
        index * frameLength
      )
    }
    return frames
  })
  return { channels: selected, frameLength }
}

export function averageSpectrum({
  channels,
  frameLength,
}: ReturnType<typeof selectFrames>) {
  const windows = channels[0]!.length / frameLength
  const bins = FFT_SIZE / 2 + 1
  const power = new Float64Array(bins)
  const summed = new Float64Array(bins)
  const fft = createPowerSpectrum(FFT_SIZE, frameLength)
  for (let frame = 0; frame < windows; frame++) {
    for (const samples of channels) {
      fft(samples, frame * frameLength, power)
      for (let bin = 0; bin < bins; bin++) summed[bin]! += power[bin]!
    }
  }

  const levels = new Float32Array(bins)
  const coherentGain = frameLength === 1 ? 1 : frameLength / 2
  const scale = (2 / coherentGain) ** 2 / (windows * channels.length)
  let peak: number | null = null
  let strongest = MIN_DB
  for (let bin = 0; bin < bins; bin++) {
    const factor = bin === 0 || bin === bins - 1 ? scale / 4 : scale
    const level = Math.fround(
      Math.max(MIN_DB, 10 * Math.log10(summed[bin]! * factor))
    )
    levels[bin] = level
    // Prefer an actual DC or Nyquist peak over equal Hann leakage in an adjacent bin.
    if (
      level > strongest ||
      (bin === bins - 1 && level === strongest && peak !== null)
    ) {
      peak = bin
      strongest = level
    }
  }
  return { levels, peak }
}

export function frequencyAtFraction(fraction: number, log: boolean) {
  const ratio = Math.min(1, Math.max(0, fraction))
  return log ? BIN_HZ * (FFT_SIZE / 2) ** ratio : (SAMPLE_RATE / 2) * ratio
}

export function fractionAtFrequency(frequency: number, log: boolean) {
  return log
    ? Math.log(Math.max(1, frequency / BIN_HZ)) / Math.log(FFT_SIZE / 2)
    : frequency / (SAMPLE_RATE / 2)
}
