import { createPowerSpectrum } from "@workspace/pcm-audio/fft"

export const SAMPLE_RATE = 48_000
export const FFT_SIZE = 8192
export const BIN_HZ = SAMPLE_RATE / FFT_SIZE
export const MIN_DB = -100
const maxWindows = 192

export function averageSpectrum(channels: Float32Array[]) {
  const length = channels[0]!.length
  const span = Math.max(0, length - FFT_SIZE)
  const windows = Math.min(maxWindows, 1 + Math.ceil(span / (FFT_SIZE / 2)))
  const bins = FFT_SIZE / 2 + 1
  const power = new Float64Array(bins)
  const summed = new Float64Array(bins)
  const fft = createPowerSpectrum(FFT_SIZE)
  for (let frame = 0; frame < windows; frame++) {
    const start = Math.round((frame * span) / Math.max(1, windows - 1))
    for (const samples of channels) {
      fft(samples, start, power)
      for (let bin = 0; bin < bins; bin++) summed[bin]! += power[bin]!
    }
  }

  const levels = new Float32Array(bins)
  const scale = (4 / FFT_SIZE) ** 2 / (windows * channels.length)
  let peak = 0
  for (let bin = 0; bin < bins; bin++) {
    const factor = bin === 0 || bin === bins - 1 ? scale / 4 : scale
    levels[bin] = Math.max(MIN_DB, 10 * Math.log10(summed[bin]! * factor))
    if (bin > 0 && levels[bin]! > (peak ? levels[peak]! : MIN_DB)) peak = bin
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
