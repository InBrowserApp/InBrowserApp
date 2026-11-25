const lowestPitch = 40
const highestPitch = 2_000
const minimumRms = 0.003
const yinThreshold = 0.12
const minimumOctaveImprovement = 0.02

export function detectPitch(samples: Float32Array, sampleRate: number) {
  // Compare the same window at every lag. Retain at least half a frame
  // so a short coincidence does not count as a repeating waveform.
  const maxLag = Math.min(
    Math.floor(samples.length / 2),
    Math.ceil(sampleRate / lowestPitch) + 1
  )
  if (maxLag < 3) return null

  let sum = 0
  let energy = 0
  for (const sample of samples) {
    sum += sample
    energy += sample * sample
  }
  const mean = sum / samples.length
  if (energy / samples.length - mean * mean < minimumRms * minimumRms) {
    return null
  }

  const windowLength = samples.length - maxLag
  let cumulative = 0
  let left = 1
  let center = 1
  let candidate:
    | { frequency: number; loss: number; octaveLag: number; tolerance: number }
    | undefined
  for (let lag = 1; lag <= maxLag; lag++) {
    let difference = 0
    for (let index = 0; index < windowLength; index++) {
      const delta = samples[index]! - samples[index + lag]!
      difference += delta * delta
    }
    cumulative += difference
    // YIN normalizes each difference against the shorter lags.
    const right = cumulative ? (difference * lag) / cumulative : 1
    if (center < yinThreshold && center < left && center <= right) {
      const offset = (left - right) / (2 * (left - 2 * center + right))
      const period = lag - 1 + offset
      const frequency = sampleRate / period
      const loss = Math.max(0, center - ((left - right) * offset) / 4)
      if (!candidate) {
        const octaveLag = period * 2
        if (loss <= minimumOctaveImprovement || octaveLag >= maxLag) {
          return frequency <= highestPitch ? frequency : null
        }
        // A strong second harmonic can match at half the true period.
        // Only consider doubling when that first match has a meaningful error.
        candidate = {
          frequency,
          loss,
          octaveLag,
          tolerance: Math.max(2, octaveLag * 0.02),
        }
      } else if (
        Math.abs(period - candidate.octaveLag) <= candidate.tolerance &&
        candidate.loss - loss >= minimumOctaveImprovement &&
        loss < candidate.loss * 0.65
      ) {
        return frequency <= highestPitch ? frequency : null
      }
    }
    if (candidate && lag > candidate.octaveLag + candidate.tolerance + 1) break
    left = center
    center = right
  }
  return candidate && candidate.frequency <= highestPitch
    ? candidate.frequency
    : null
}
